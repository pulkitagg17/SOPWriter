import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Admin, IAdmin } from '../models/Admin.js';
import RefreshToken from '../models/RefreshToken.js';
import { config_vars } from '../config/env.js';
import { MailService } from './mail.service.js';
import { OTP, ADMIN_SECURITY, VALIDATION } from '../constants/limits.js';
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from '../utils/errors.js';

export class AuthService {
  private static instance: AuthService;

  private constructor() { }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string) {
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Generic error for security
    const invalidCredsError = new AuthenticationError('Invalid credentials');

    if (!admin) {
      // Fake verify to prevent timing attacks
      await bcrypt.compare(
        password,
        '$2b$12$......................................................'
      );
      throw invalidCredsError;
    }

    // Check lockout
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      throw new AuthorizationError('Account is temporarily locked. Please try again later.');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      admin.loginAttempts += 1;

      if (admin.loginAttempts >= ADMIN_SECURITY.MAX_LOGIN_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + ADMIN_SECURITY.LOCKOUT_MINUTES * 60 * 1000);
        admin.loginAttempts = 0;
      }

      await admin.save();
      throw invalidCredsError;
    }

    // Success
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    const accessToken = this.generateToken(admin);
    const refreshToken = await this.generateRefreshToken(admin);

    return { accessToken, refreshToken, admin };
  }

  async forgotPassword(email: string) {
    // Always return success message to prevent enumeration
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return;

    // Check OTP rate limits 1 OTP/min
    if (admin.lastOtpRequest && Date.now() - admin.lastOtpRequest.getTime() < 60 * 1000) {
      throw new AppError('RATE_LIMIT', 'Please wait before requesting another OTP', 429);
    }

    // Check 3 OTPs per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (admin.otpRequestWindowStart && admin.otpRequestWindowStart > oneHourAgo) {
      if (admin.otpRequestCount1h >= OTP.REQUEST_LIMIT_PER_HOUR) {
        throw new AppError('RATE_LIMIT', 'Too many OTP requests. Please try again later.', 429);
      }
      admin.otpRequestCount1h += 1;
    } else {
      // Reset window
      admin.otpRequestWindowStart = new Date();
      admin.otpRequestCount1h = 1;
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    // Use bcrypt for OTP hashing (adds salt and work factor)
    const otpHash = await bcrypt.hash(otp, 10);

    admin.otpHash = otpHash;
    admin.otpExpires = new Date(Date.now() + OTP.VALIDITY_MINUTES * 60 * 1000);
    admin.otpAttempts = 0;
    admin.lastOtpRequest = new Date();

    await admin.save();

    // Send Email
    await MailService.getInstance().sendOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string) {
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Check if OTP exists and not expired
    if (!admin || !admin.otpHash || !admin.otpExpires || admin.otpExpires < new Date()) {
      throw new ValidationError('Invalid or expired OTP');
    }

    // Check OTP attempts
    if (admin.otpAttempts >= OTP.MAX_ATTEMPTS) {
      // Invalidate OTP
      admin.otpHash = null;
      admin.otpExpires = null;
      await admin.save();
      throw new ValidationError('Too many failed attempts. OTP invalidated.');
    }

    // Verify Hash
    const isMatch = await bcrypt.compare(otp, admin.otpHash);
    if (!isMatch) {
      admin.otpAttempts += 1;
      await admin.save();
      throw new ValidationError('Invalid OTP');
    }

    // Success - return signed reset token
    const resetToken = jwt.sign(
      { adminId: admin._id, scope: 'reset-password' },
      config_vars.jwt.secret,
      { expiresIn: '5m' }
    );

    // Clear OTP immediately after successful verification (single-use)
    admin.otpHash = null;
    admin.otpExpires = null;
    admin.otpAttempts = 0;
    await admin.save();

    return { resetToken };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    // Verify token
    let payload: any;
    try {
      payload = jwt.verify(resetToken, config_vars.jwt.secret);
    } catch (err) {
      throw new ValidationError('Invalid or expired reset token');
    }

    if (payload.scope !== 'reset-password') {
      throw new AuthorizationError('Invalid token scope');
    }

    if (newPassword.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      throw new ValidationError(
        `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
      );
    }

    // Strong password validation
    const passwordErrors: string[] = [];
    if (!/[A-Z]/.test(newPassword)) {
      passwordErrors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(newPassword)) {
      passwordErrors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(newPassword)) {
      passwordErrors.push('one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      passwordErrors.push('one special character');
    }

    if (passwordErrors.length > 0) {
      throw new ValidationError(`Password must contain ${passwordErrors.join(', ')}`);
    }

    const admin = await Admin.findById(payload.adminId);
    if (!admin) throw new AuthenticationError('Admin not found');

    // Update password
    const salt = await bcrypt.genSalt(12);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    admin.otpHash = null;
    admin.otpExpires = null;
    admin.otpAttempts = 0;

    // Invalidate all existing sessions
    admin.tokenVersion += 1;

    await admin.save();
  }

  generateToken(admin: IAdmin) {
    return jwt.sign(
      { adminId: admin._id, scope: 'admin', version: admin.tokenVersion },
      config_vars.jwt.secret,
      { expiresIn: '15m' }
    );
  }

  async generateRefreshToken(admin: IAdmin) {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      token,
      adminId: admin._id,
      expiresAt,
    });

    return token;
  }

  async refreshSession(token: string) {
    const refreshToken = await RefreshToken.findOne({ token }).populate('adminId');

    if (!refreshToken || refreshToken.revoked || refreshToken.expiresAt < new Date()) {
      // If using a revoked token, we should probably revoke all descendent tokens (security)
      // For now, just fail.
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    const admin = await Admin.findById(refreshToken.adminId);
    if (!admin) throw new AuthenticationError('Admin not found');

    // Rotation: Revoke old, issue new
    refreshToken.revoked = true;
    await refreshToken.save();

    const newRefreshToken = await this.generateRefreshToken(admin as IAdmin);
    // Link rotation (optional, stored in replacingToken if schema supports it, I added it)
    refreshToken.replacingToken = newRefreshToken;
    await refreshToken.save();

    const newAccessToken = this.generateToken(admin as IAdmin);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, admin };
  }

  async revokeRefreshToken(token: string) {
    await RefreshToken.updateOne({ token }, { revoked: true });
  }
}
