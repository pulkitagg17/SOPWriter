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

export type CreateLeadDTO = z.infer<typeof createLeadSchema>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type VerifyTransactionDTO = z.infer<typeof verifyTransactionSchema>;
