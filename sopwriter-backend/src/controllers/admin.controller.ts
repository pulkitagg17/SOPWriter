// src/controllers/admin.controller.ts
import type { Request, Response } from 'express';

import {
  loginAdmin,
  refreshSession,
  forgotPassword,
  verifyOtp,
  resetPassword,
  revokeRefreshToken,
} from '../services/auth.service.js';

import {
  verifyTransaction,
  findAllTransactions,
  getTransactionById
} from '../services/transaction.service.js';
import { findAllLeads } from '../services/lead.service.js';
import { mailService } from '../services/mail.service.js';
import { logAudit } from '../services/audit.service.js';

import { AuditAction } from '../constants/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  AuthenticationError,
  ValidationError,
} from '../utils/errors.js';

import { config_vars } from '../config/env.js';

const isProd = config_vars.nodeEnv === 'production';

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' as const : 'lax' as const,
  path: '/',
  maxAge: 10 * 60 * 1000,
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' as const : 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) {
  res.cookie('admin_token', tokens.accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
}

function clearAuthCookies(res: Response) {
  res.clearCookie('admin_token', {
    path: '/',
    secure: true,
    sameSite: isProd ? 'none' : 'lax'
  });

  res.clearCookie('refresh_token', {
    path: '/',
    secure: true,
    sameSite: isProd ? 'none' : 'lax'
  });
}

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip || 'unknown';

  const { accessToken, refreshToken, admin } = await loginAdmin(email, password);

  setAuthCookies(res, { accessToken, refreshToken });

  await logAudit({
    actorId: admin._id.toString(),
    actorEmail: admin.email,
    action: AuditAction.ADMIN_LOGIN,
    status: 'SUCCESS',
    ip,
    userAgent: req.get('user-agent'),
  });

  res.json({
    success: true,
    data: {
      admin: {
        id: admin._id,
        email: admin.email
      },
      token: accessToken,
    },
    message: 'Logged in successfully'
  });
});

export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out' });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token missing');
  }

  const { accessToken, refreshToken: newRefresh } =
    await refreshSession(refreshToken);

  setAuthCookies(res, {
    accessToken,
    refreshToken: newRefresh
  });

  res.json({ success: true, data: { token: accessToken } });
});

export const forgotPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  await forgotPassword(req.body.email);
  res.json({ success: true, message: 'If email exists, OTP sent' });
});

export const verifyOtpHandler = asyncHandler(async (req: Request, res: Response) => {
  const { resetToken } = await verifyOtp(req.body.email, req.body.otp);
  res.json({ success: true, data: { resetToken } });
});

export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  await resetPassword(req.body.resetToken, req.body.newPassword);
  clearAuthCookies(res);
  res.json({ success: true, message: 'Password reset successful' });
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  const admin = (req as any).admin;

  res.json({
    success: true,
    data: {
      admin: {
        id: admin.sub,
        email: admin.email,
        role: admin.role,
      },
    }
  });
});

export const listLeads = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await findAllLeads(req.query.search as string, { page, limit });

  res.json({
    success: true,
    data: {
      items: result.items,
    },
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  });
});

export const listTransactions = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await findAllTransactions({
    status: req.query.status as string,
    leadId: req.query.leadId as string,
  });

  res.json({ success: true, data: { items: transactions } });
});

export const getTransactionDetail = asyncHandler(
  async (req: Request, res: Response) => {
    const tx = await getTransactionById(req.params.id);

    if (!tx) {
      throw new ValidationError('Transaction not found');
    }

    res.json({ success: true, data: tx });
  }
);

export const verifyTransactionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, note } = req.body;

  if (action !== 'VERIFY' && action !== 'REJECT') {
    throw new ValidationError('Invalid action');
  }

  const admin = (req as any).admin;

  const { lead } = await verifyTransaction(
    id,
    { id: admin.sub, email: admin.email },
    action,
    note
  );

  if (lead) {
    await mailService.sendUserVerification(lead.email, {
      name: lead.name,
      leadId: lead._id.toString(),
      status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
      note,
      appUrl: config_vars.app.baseUrl,
    });
  }

  await logAudit({
    actorId: admin.sub,
    actorEmail: admin.email,
    action:
      action === 'VERIFY'
        ? AuditAction.TRANSACTION_VERIFY
        : AuditAction.TRANSACTION_REJECT,
    targetId: id,
    status: 'SUCCESS',
    ip: req.ip,
    userAgent: req.get('user-agent'),
    details: { note },
  });

  res.json({
    success: true,
    data: {
      transactionId: id,
      status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
    }
  });
});
