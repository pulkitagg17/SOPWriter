import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config_vars } from '../config/env.js';
import { ErrorCode, RATE_LIMIT } from '../constants/index.js';
import { errorResponse } from '../utils/responses.js';

/**
 * Common rate limit handler for all rate limiters
 */
const rateLimitHandler = (_req: Request, res: Response) => {
  res
    .status(429)
    .json(errorResponse(ErrorCode.RATE_LIMIT, 'Too many requests. Please try again later.'));
};

export const leadsRateLimiter = rateLimit({
  windowMs: config_vars.rateLimit.windowMs,
  max: config_vars.rateLimit.maxLeads,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const transactionsRateLimiter = rateLimit({
  windowMs: config_vars.rateLimit.windowMs,
  max: config_vars.rateLimit.maxTransactions,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const loginRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.LOGIN_WINDOW_MS,
  max: RATE_LIMIT.LOGIN_MAX_ATTEMPTS,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res
      .status(429)
      .json(
        errorResponse(ErrorCode.RATE_LIMIT, 'Too many login attempts. Please try again later.')
      );
  },
});

// Rate limiter for forgot-password (prevent OTP spam)
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 request per minute to prevent OTP email spam
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res
      .status(429)
      .json(errorResponse(ErrorCode.RATE_LIMIT, 'Please wait before requesting another OTP.'));
  },
});

// Rate limiter for verify-otp (allow a few retries for typos)
export const otpRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 attempts per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
