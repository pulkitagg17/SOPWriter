import { z } from 'zod';
import { sanitizeText, sanitizeEmail, sanitizeHtml } from './sanitize.js';
import { VALIDATION, TransactionMethod } from '../constants/index.js';

export const createLeadSchema = z.object({
  name: z.string().min(VALIDATION.MIN_NAME_LENGTH).transform(sanitizeText),
  email: z.string().email().transform(sanitizeEmail),
  phone: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeText(val) : val)),
  service: z.string().min(VALIDATION.MIN_SERVICE_LENGTH).transform(sanitizeText),
  notes: z
    .string()
    .max(VALIDATION.MAX_NOTES_LENGTH)
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : val)),
});

export const createTransactionSchema = z.object({
  transactionId: z.string().min(1).transform(sanitizeText),
  amount: z.number().positive().optional(),
  method: z
    .enum([TransactionMethod.UPI, TransactionMethod.BANK, TransactionMethod.OTHER])
    .optional(),
  remark: z
    .string()
    .max(VALIDATION.MAX_REMARK_LENGTH)
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : val)),
});

export const verifyTransactionSchema = z.object({
  action: z.enum(['VERIFY', 'REJECT']),
  note: z
    .string()
    .max(VALIDATION.MAX_VERIFICATION_NOTE_LENGTH)
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : val)),
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
  otp: z.string().min(6).max(6),
});

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: z.string().min(VALIDATION.MIN_PASSWORD_LENGTH),
});

export const createServiceSchema = z.object({
  code: z.string().min(1).max(50).transform(sanitizeText),
  name: z.string().min(1).max(100).transform(sanitizeText),
  category: z.enum(['documents', 'profile', 'visa']),
  price: z.number().positive().max(1000000),
  description: z.string().max(500).optional().transform(val => val ? sanitizeHtml(val) : val),
  active: z.boolean().optional(),
}).strict();

export const updateServiceSchema = createServiceSchema.partial().strict();

export const updateSettingSchema = z.object({
  value: z.string().min(1),
  description: z.string().optional().transform(val => val ? sanitizeText(val) : val),
}).strict();

export type CreateLeadDTO = z.infer<typeof createLeadSchema>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type VerifyTransactionDTO = z.infer<typeof verifyTransactionSchema>;
