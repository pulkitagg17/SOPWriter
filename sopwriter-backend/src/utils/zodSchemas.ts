import { z } from 'zod';
import { sanitizeText, sanitizeEmail, sanitizeHtml } from './sanitize.js';
import { TransactionMethod } from '../constants/index.js';

export const createLeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().min(1).max(100),
  notes: z.string().max(2000).optional(),
});

export const createTransactionSchema = z.object({
  transactionId: z
    .string()
    .min(1, 'Transaction ID required')
    .transform(sanitizeText),

  amount: z.number().positive().optional(),

  method: z
    .enum([
      TransactionMethod.UPI,
      TransactionMethod.BANK_TRANSFER,
      TransactionMethod.QR_CODE,
      TransactionMethod.OTHER,
    ])
    .optional(),

  remark: z
    .string()
    .max(1000)
    .optional()
    .transform((v) => (v ? sanitizeHtml(v) : v)),
});

export const verifyTransactionSchema = z.object({
  action: z.enum(['VERIFY', 'REJECT']),

  note: z
    .string()
    .max(500)
    .optional()
    .transform((v) => (v ? sanitizeHtml(v) : v)),
});

export const loginSchema = z.object({
  email: z.string().email().transform(sanitizeEmail),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().transform(sanitizeEmail),
});

export const verifyOtpSchema = z.object({
  email: z.string().email().transform(sanitizeEmail),
  otp: z.string().length(6),
});

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: z.string().min(8),
});

export const createServiceSchema = z
  .object({
    code: z.string().min(1).max(50).transform(sanitizeText),
    name: z.string().min(1).max(100).transform(sanitizeText),
    category: z.enum(['documents', 'profile', 'visa']),
    price: z.number().positive().max(1_000_000),
    description: z
      .string()
      .max(500)
      .optional()
      .transform((v) => (v ? sanitizeHtml(v) : v)),
    active: z.boolean().optional(),
  })
  .strict();

export const updateServiceSchema = createServiceSchema.partial().strict();

export const updateSettingSchema = z
  .object({
    value: z.string().min(1),
    description: z
      .string()
      .optional()
      .transform((v) => (v ? sanitizeText(v) : v)),
  })
  .strict();

export type CreateLeadDTO = z.infer<typeof createLeadSchema>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type VerifyTransactionDTO = z.infer<typeof verifyTransactionSchema>;
