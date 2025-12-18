import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import Admin from '../models/Admin.js';
import RefreshToken from '../models/RefreshToken.js';
import { config_vars } from '../config/env.js';
import { mailService } from './mail.service.js';

import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from '../utils/errors.js';

import { logAudit } from './audit.service.js';
import { AuditAction } from '../constants/index.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

const OTP_MAX_ATTEMPTS = 3;
const OTP_VALIDITY_MINUTES = 5;
const OTP_REQUESTS_PER_HOUR = 3;
const OTP_REQUEST_COOLDOWN_MS = 60 * 1000;

const PASSWORD_MIN_LENGTH = 8;

// ============================
// LOGIN
// ============================
export async function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    await fakeHashCompare(password);
    await logAudit({
      actorEmail: normalizedEmail,
      action: AuditAction.ADMIN_LOGIN,
      status: 'FAILURE',
      details: { reason: 'ADMIN_NOT_FOUND' },
    });
    throw new AuthenticationError('Invalid credentials');
  }

  if (admin.lockUntil && admin.lockUntil > new Date()) {
    throw new AuthorizationError('Account temporarily locked');
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    admin.loginAttempts += 1;

    if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      admin.lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      admin.loginAttempts = 0;
    }

    await admin.save();

    await logAudit({
      actorId: admin._id.toString(),
      actorEmail: admin.email,
      action: AuditAction.ADMIN_LOGIN,
      status: 'FAILURE',
      details: { reason: 'INVALID_PASSWORD' },
    });

    throw new AuthenticationError('Invalid credentials');
  }

  admin.loginAttempts = 0;
  admin.lockUntil = null;
  await admin.save();

  const accessToken = generateAccessToken(admin);
  const refreshToken = await issueRefreshToken(admin);

  return { accessToken, refreshToken, admin };
}

// ============================
// FORGOT PASSWORD
// ============================
export async function forgotPassword(email: string) {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return;

  if (
    admin.lastOtpRequest &&
    Date.now() - admin.lastOtpRequest.getTime() < OTP_REQUEST_COOLDOWN_MS
  ) {
    throw new ValidationError('Please wait before requesting another OTP');
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  if (admin.otpRequestWindowStart && admin.otpRequestWindowStart > oneHourAgo) {
    if (admin.otpRequestCount1h >= OTP_REQUESTS_PER_HOUR) {
      throw new ValidationError('Too many OTP requests');
    }
    admin.otpRequestCount1h += 1;
  } else {
    admin.otpRequestWindowStart = new Date();
    admin.otpRequestCount1h = 1;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  admin.otpHash = await bcrypt.hash(otp, 10);
  admin.otpExpires = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000);
  admin.otpAttempts = 0;
  admin.lastOtpRequest = new Date();

  await admin.save();
  await mailService.sendOtp(admin.email, otp);

  await logAudit({
    actorEmail: admin.email,
    action: AuditAction.ADMIN_FORGOT_PASSWORD,
    status: 'SUCCESS',
  });
}

// ============================
// VERIFY OTP
// ============================
export async function verifyOtp(email: string, otp: string) {
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin || !admin.otpHash || !admin.otpExpires) {
    throw new ValidationError('Invalid or expired OTP');
  }

  if (admin.otpExpires < new Date()) {
    throw new ValidationError('OTP expired');
  }

  if (admin.otpAttempts >= OTP_MAX_ATTEMPTS) {
    admin.otpHash = null;
    admin.otpExpires = null;
    await admin.save();
    throw new ValidationError('OTP attempts exceeded');
  }

  const match = await bcrypt.compare(otp, admin.otpHash);
  if (!match) {
    admin.otpAttempts += 1;
    await admin.save();
    throw new ValidationError('Invalid OTP');
  }

  const resetToken = jwt.sign(
    { adminId: admin._id.toString(), scope: 'reset-password' },
    config_vars.jwt.secret,
    { expiresIn: '5m' }
  );

  admin.otpHash = null;
  admin.otpExpires = null;
  admin.otpAttempts = 0;
  await admin.save();

  await logAudit({
    actorId: admin._id.toString(),
    actorEmail: admin.email,
    action: AuditAction.ADMIN_VERIFY_OTP,
    status: 'SUCCESS',
  });

  return { resetToken };
}

// ============================
// RESET PASSWORD
// ============================
export async function resetPassword(resetToken: string, newPassword: string) {
  let payload: any;

  try {
    payload = jwt.verify(resetToken, config_vars.jwt.secret);
  } catch {
    throw new ValidationError('Invalid or expired reset token');
  }

  if (payload.scope !== 'reset-password') {
    throw new AuthorizationError('Invalid token scope');
  }

  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    throw new ValidationError('Password too short');
  }

  const admin = await Admin.findById(payload.adminId);
  if (!admin) throw new AuthenticationError('Admin not found');

  admin.passwordHash = await bcrypt.hash(newPassword, 12);
  admin.tokenVersion += 1;

  await admin.save();

  await RefreshToken.updateMany(
    { adminId: admin._id },
    { revoked: true }
  );

  await logAudit({
    actorId: admin._id.toString(),
    actorEmail: admin.email,
    action: AuditAction.ADMIN_RESET_PASSWORD,
    status: 'SUCCESS',
  });
}

// ============================
// REFRESH SESSION
// ============================
export async function refreshSession(token: string) {
  const refresh = await RefreshToken.findOne({ token });
  if (!refresh || refresh.revoked || refresh.expiresAt < new Date()) {
    throw new AuthenticationError('Invalid refresh token');
  }

  const admin = await Admin.findById(refresh.adminId);
  if (!admin) throw new AuthenticationError('Admin not found');

  refresh.revoked = true;
  await refresh.save();

  const newRefreshToken = await issueRefreshToken(admin);
  const newAccessToken = generateAccessToken(admin);

  await logAudit({
    actorId: admin._id.toString(),
    actorEmail: admin.email,
    action: AuditAction.ADMIN_REFRESH,
    status: 'SUCCESS',
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    admin,
  };
}

// ============================
// LOGOUT
// ============================
export async function revokeRefreshToken(token: string) {
  await RefreshToken.updateOne({ token }, { revoked: true });
}

// ============================
// INTERNAL HELPERS
// ============================
function generateAccessToken(admin: any) {
  return jwt.sign(
    {
      adminId: admin._id.toString(),
      scope: 'admin',
      version: admin.tokenVersion,
      permissions: ['READ', 'WRITE', 'DANGEROUS', 'MANAGE_SETTINGS'],
    },
    config_vars.jwt.secret,
    { expiresIn: '15m' }
  );
}

async function issueRefreshToken(admin: any) {
  const token = crypto.randomBytes(40).toString('hex');

  await RefreshToken.create({
    token,
    adminId: admin._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
}

async function fakeHashCompare(password: string) {
  await bcrypt.compare(
    password,
    '$2b$12$......................................................'
  );
}
