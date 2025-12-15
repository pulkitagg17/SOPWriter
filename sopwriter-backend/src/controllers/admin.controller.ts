import type { Request, Response } from 'express';
import Transaction from '../models/Transaction.js';
import Lead from '../models/Lead.js';
import AuditLog from '../models/AuditLog.js';
import * as transactionService from '../services/transaction.service.js';
import { MailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';
import { NotFoundError, AuthenticationError } from '../utils/errors.js';
import { escapeRegex } from '../utils/sanitize.js';
import { parsePagination, buildPaginationMeta } from '../utils/pagination.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { ErrorCode, PAGINATION, TIMEOUT } from '../constants/index.js';
import { AuthService } from '../services/auth.service.js';
import { logger } from '../config/logger.js';

const mail = MailService.getInstance();
const authService = AuthService.getInstance();

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  const result = await authService.login(email, password);

  res.cookie('admin_token', result.accessToken, {
    httpOnly: true,
    secure: true, // Must be true for SameSite=None
    sameSite: 'none', // Must be 'none' for cross-site (Vercel -> Render)
    path: '/',
    maxAge: 10 * 60 * 1000,
  });

  res.cookie('refresh_token', result.refreshToken, {
    httpOnly: true,
    secure: true, // Must be true for SameSite=None
    sameSite: 'none', // Must be 'none' for cross-site (Vercel -> Render)
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logger.info({ event: 'login_success', user: email, ip }, 'Admin logged in');

  // Audit Log
  await AuditLog.create({
    adminId: result.admin._id,
    action: 'ADMIN_LOGIN',
    ip,
    userAgent: req.get('user-agent'),
    status: 'SUCCESS'
  });

  res.json(successResponse({ message: 'Logged in successfully' }));
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  const admin = (req as any).admin;
  res.json(successResponse({ admin: { id: admin.sub, email: admin.email, role: admin.scope } }));
});

export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }

  // Clear cookies with exact same options as set
  const cookieOptions: any = {
    path: '/',
    secure: true,
    sameSite: 'none'
  };

  res.clearCookie('admin_token', cookieOptions);
  res.clearCookie('refresh_token', cookieOptions);

  // Fallbacks for safety
  res.clearCookie('admin_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });

  // Cleanup legacy/vendor cookies
  res.clearCookie('__session');
  res.clearCookie('__clerk_db_jwt');
  res.clearCookie('jwt_token');

  res.json(successResponse({ message: 'Logged out' }));
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token missing');
  }

  const result = await authService.refreshSession(refreshToken);

  // Force secure settings for refresh as well
  res.cookie('admin_token', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 10 * 60 * 1000,
  });

  res.cookie('refresh_token', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json(successResponse({ message: 'Session refreshed' }));
});

export const forgotPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  await authService.forgotPassword(email);

  logger.info({ event: 'otp_requested', email, ip }, 'OTP requested');

  res.json(successResponse({ message: 'If the email exists, an OTP has been sent' }));
});

export const verifyOtpHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  const result = await authService.verifyOtp(email, otp);

  logger.info({ event: 'otp_verified', email, ip }, 'OTP verified successfully');

  res.json(successResponse({ resetToken: result.resetToken }));
});

export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  await authService.resetPassword(resetToken, newPassword);

  // Requirement 8: Manual Re-Login. Clear sessions.
  res.clearCookie('admin_token');

  logger.info({ event: 'password_reset', ip }, 'Password reset successfully');

  // Audit Log (adminId might be inferred from token payload if we had it, but here we just know it happened via OTP)
  // We can look up admin by resetToken if we decoded it earlier in service, but service handles it.
  // For now log the IP.
  await AuditLog.create({
    action: 'PASSWORD_RESET',
    ip,
    userAgent: req.get('user-agent'),
    status: 'SUCCESS'
  });

  res.json(
    successResponse({ message: 'Password reset successfully. Please login with new password.' })
  );
});

export const listLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query);

  const filter: Record<string, any> = {};
  if (req.query.search) {
    const search = escapeRegex(req.query.search as string);
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { service: { $regex: search, $options: 'i' } },
    ];
  }

  if (req.query.status) {
    filter.status = req.query.status as string;
  }

  const [total, data] = await Promise.all([
    Lead.countDocuments(filter).maxTimeMS(TIMEOUT.DB_QUERY_MS),
    Lead.find(filter)
      .select('-history')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .maxTimeMS(TIMEOUT.DB_QUERY_MS)
      .exec(),
  ]);

  const pagination = buildPaginationMeta({ page, limit, skip }, total);
  res.json(successResponse({ items: data }, pagination));
});

export const listTransactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const status = (req.query.status as string) || undefined;
  const { page, limit, skip } = parsePagination(req.query, {
    maxLimit: PAGINATION.MAX_TRANSACTIONS_LIMIT,
  });

  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (req.query.leadId) filter.leadId = req.query.leadId;

  const [total, docs] = await Promise.all([
    Transaction.countDocuments(filter),
    Transaction.find(filter)
      .populate('leadId', '_id name email service')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
  ]);

  const pagination = buildPaginationMeta({ page, limit, skip }, total);
  res.json(successResponse({ items: docs }, pagination));
});

export const getTransactionDetail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const tx = await Transaction.findById(id)
      .populate('leadId')
      .maxTimeMS(TIMEOUT.DB_QUERY_MS)
      .lean()
      .exec();

    if (!tx) throw new NotFoundError('Transaction', id);

    res.json(successResponse(tx));
  }
);

export const verifyTransactionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, note } = req.body;

  if (!['VERIFY', 'REJECT'].includes(action)) {
    res
      .status(400)
      .json(errorResponse(ErrorCode.INVALID_ACTION, 'Action must be VERIFY or REJECT'));
    return;
  }

  const admin = (req as any).admin || { id: 'unknown' };
  const result = await transactionService.verifyTransaction(
    id,
    { id: admin.sub || admin.id, email: admin.email },
    action as 'VERIFY' | 'REJECT',
    note
  );

  if (result.lead) {
    mail
      .sendUserVerification(result.lead.email, {
        name: result.lead.name,
        leadId: result.lead._id.toString(),
        status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
        note,
        appUrl: config_vars.app.baseUrl,
      })
      .catch(() => { });
  }

  // Audit Log
  await AuditLog.create({
    adminId: admin.adminId || admin.id || admin._id || admin.sub,
    action: action === 'VERIFY' ? 'TRANSACTION_VERIFY' : 'TRANSACTION_REJECT',
    targetId: id,
    details: { note },
    ip: req.ip,
    userAgent: req.get('user-agent'),
    status: 'SUCCESS'
  });

  res.json(
    successResponse({
      transactionId: id,
      status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
    })
  );
});
