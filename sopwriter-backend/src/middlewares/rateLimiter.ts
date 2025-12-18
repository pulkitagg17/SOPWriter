import rateLimit from 'express-rate-limit';
import type { Request } from 'express';
import { config_vars } from '../config/env.js';

const defaultMessage = {
  success: false,
  code: 'RATE_LIMIT',
  message: 'Too many requests. Please try again later.'
};



const ipEmailKey = (req: Request, _res: any) => {
  const email = req.body?.email || 'unknown-email';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  return `${ip}:${email.toLowerCase()}`;
}

export const leadsRateLimiter = rateLimit({
  windowMs: config_vars.rateLimit.windowMs,
  max: config_vars.rateLimit.maxLeads,
  standardHeaders: true,
  legacyHeaders: false,
  message: defaultMessage,
  validate: { ip: false },
});

export const transactionsRateLimiter = rateLimit({
  windowMs: config_vars.rateLimit.windowMs,
  max: config_vars.rateLimit.maxTransactions,
  standardHeaders: true,
  legacyHeaders: false,
  message: defaultMessage,
  validate: { ip: false },
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: ipEmailKey,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'RATE_LIMIT',
    message: 'Too many login attempts. Please try again later.',
  },
  validate: { ip: false },
});

export const adminActionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    code: 'RATE_LIMIT',
    message: 'Too many admin actions.',
  },
  validate: { ip: false },
})

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  keyGenerator: ipEmailKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'RATE_LIMIT',
    message: 'Please wait before requesting another OTP.',
  },
  validate: { ip: false },
});

export const otpRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: ipEmailKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: defaultMessage,
  validate: { ip: false },
});

export const resetPasswordRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  keyGenerator: ipEmailKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: defaultMessage,
  validate: { ip: false },
});

export const adminReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
});

export const adminDangerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
});
