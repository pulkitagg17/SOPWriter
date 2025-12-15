export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  DEFAULT_PAGE: 1,
  MAX_TRANSACTIONS_LIMIT: 200,
} as const;

export const VALIDATION = {
  MAX_NOTES_LENGTH: 2000,
  MAX_REMARK_LENGTH: 1000,
  MAX_VERIFICATION_NOTE_LENGTH: 500,
  MIN_NAME_LENGTH: 2,
  MIN_SERVICE_LENGTH: 1,
  MIN_PASSWORD_LENGTH: 8,
  MIN_JWT_SECRET_LENGTH: 64, // 512 bits minimum for production security
} as const;

export const RATE_LIMIT = {
  LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  LOGIN_MAX_ATTEMPTS: 5,
  DEFAULT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  DEFAULT_MAX: 100,
  DEFAULT_MAX_LEADS: 10,
  DEFAULT_MAX_TRANSACTIONS: 20,
} as const;

export const OTP = {
  MAX_ATTEMPTS: 3,
  VALIDITY_MINUTES: 5,
  REQUEST_LIMIT_PER_MINUTE: 1,
  REQUEST_LIMIT_PER_HOUR: 3,
} as const;

export const ADMIN_SECURITY = {
  LOCKOUT_MINUTES: 30,
  MAX_LOGIN_ATTEMPTS: 5,
} as const;

export const RETRY = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 100,
  EXPONENTIAL_BASE: 2,
} as const;

export const TIMEOUT = {
  DB_QUERY_MS: 5000,
  SOCKET_MS: 45000,
  SERVER_SELECTION_MS: 5000,
} as const;

export const DEDUPE = {
  WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const CONNECTION_POOL = {
  MAX_SIZE: 10,
  MIN_SIZE: 2,
} as const;

export const CACHE = {
  DEFAULT_TTL_SECONDS: 300, // 5 minutes
  CHECK_PERIOD_SECONDS: 60,
} as const;
