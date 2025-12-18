import { config } from 'dotenv';
import { z } from 'zod';
import { VALIDATION, RATE_LIMIT } from '../constants/index.js';
import { logger } from './logger.js';

// ============================
// Load env file
// ============================
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
} else {
  config();
}

const MIN_JWT_SECRET_LENGTH = 64;

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  MONGO_URI: z.string().url(),

  // Mail
  FROM_EMAIL: z.string().email(),
  ADMIN_NOTIFY_EMAIL: z.string().email(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_SECURE: z.string().default('false'),

  // Auth
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default(String(RATE_LIMIT.DEFAULT_WINDOW_MS)),
  RATE_LIMIT_MAX: z.string().default(String(RATE_LIMIT.DEFAULT_MAX)),
  RATE_LIMIT_MAX_LEADS: z.string().default(String(RATE_LIMIT.DEFAULT_MAX_LEADS)),
  RATE_LIMIT_MAX_TRANSACTIONS: z.string().default(
    String(RATE_LIMIT.DEFAULT_MAX_TRANSACTIONS)
  ),

  // Admin bootstrap
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(VALIDATION.MIN_PASSWORD_LENGTH),

  // App
  APP_BASE_URL: z.string().url(),

  // Defaults
  DEFAULT_CONTACT_PHONE: z.string().optional(),
  DEFAULT_WHATSAPP: z.string().optional(),
  DEFAULT_CONTACT_EMAIL: z.string().email().optional(),
  DEFAULT_SUPPORT_EMAIL: z.string().email().optional(),
  DEFAULT_UPI_ID: z.string().optional(),
  DEFAULT_QR_IMAGE: z.string().optional(),

  // Logging
  LOG_LEVEL: z.string().optional(),

  // Mail provider
  MAIL_PROVIDER: z.enum(['sendgrid', 'smtp', 'memory']).optional(),
  SENDGRID_API_KEY: z.string().optional(),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.error({ errors: parsed.error.flatten().fieldErrors }, 'Invalid environment variables');
    throw new Error('Invalid environment variables');
  }

  if (parsed.data.NODE_ENV === 'production') {
    if (parsed.data.JWT_SECRET.length < MIN_JWT_SECRET_LENGTH) {
      throw new Error(
        `JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters in production`
      );
    }

    if (
      parsed.data.JWT_SECRET.toLowerCase().includes('change') ||
      parsed.data.JWT_SECRET.toLowerCase().includes('default')
    ) {
      throw new Error(
        'PRODUCTION SECURITY ERROR: JWT_SECRET appears insecure. Change it immediately.'
      );
    }

    if (parsed.data.ADMIN_PASSWORD.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      throw new Error(
        `ADMIN_PASSWORD must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
      );
    }

    if (
      parsed.data.ADMIN_PASSWORD.toLowerCase().includes('change') ||
      parsed.data.ADMIN_PASSWORD.toLowerCase().includes('default')
    ) {
      throw new Error(
        'PRODUCTION SECURITY ERROR: ADMIN_PASSWORD appears insecure. Change it immediately.'
      );
    }
  }

  return parsed.data;
};

export const env = parseEnv();

// ============================
// Normalized config export
// ============================
export const config_vars = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,

  mongoUri: env.MONGO_URI,

  email: {
    from: env.FROM_EMAIL,
    adminNotify: env.ADMIN_NOTIFY_EMAIL,
    smtp: {
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT, 10),
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      secure: env.SMTP_SECURE === 'true',
    },
  },

  jwt: {
    secret: env.JWT_SECRET,
  },

  cors: {
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
  },

  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(env.RATE_LIMIT_MAX, 10),
    maxLeads: parseInt(env.RATE_LIMIT_MAX_LEADS, 10),
    maxTransactions: parseInt(env.RATE_LIMIT_MAX_TRANSACTIONS, 10),
  },

  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  },

  app: {
    baseUrl: env.APP_BASE_URL,
  },

  defaults: {
    contactPhone: env.DEFAULT_CONTACT_PHONE || '+1234567890',
    whatsapp: env.DEFAULT_WHATSAPP || '1234567890',
    contactEmail: env.DEFAULT_CONTACT_EMAIL || 'info@example.com',
    supportEmail: env.DEFAULT_SUPPORT_EMAIL || 'support@example.com',
    upiId: env.DEFAULT_UPI_ID || 'example@upi',
    qrImage: env.DEFAULT_QR_IMAGE || '/qr.jpg',
  },

  mail: {
    provider: env.MAIL_PROVIDER || 'smtp',
    sendgridApiKey: env.SENDGRID_API_KEY,
  },
};
