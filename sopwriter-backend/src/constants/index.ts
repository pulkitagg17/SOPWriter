export const LeadStatus = {
    NEW: 'NEW',
    PAYMENT_DECLARED: 'PAYMENT_DECLARED',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
} as const;

export type LeadStatusType = (typeof LeadStatus)[keyof typeof LeadStatus];

export const TransactionStatus = {
    DECLARED: 'DECLARED',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
} as const;

export type TransactionStatusType =
    (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const TransactionMethod = {
    UPI: 'UPI',
    BANK_TRANSFER: 'BANK_TRANSFER',
    QR_CODE: 'QR_CODE',
    OTHER: 'OTHER',
} as const;

export type TransactionMethodType =
    (typeof TransactionMethod)[keyof typeof TransactionMethod];

export const ServiceCategory = {
    DOCUMENTS: 'documents',
    PROFILE: 'profile',
    VISA: 'visa',
} as const;

export type ServiceCategoryType =
    (typeof ServiceCategory)[keyof typeof ServiceCategory];

export const HistoryAction = {
    CREATED: 'CREATED',
    DUPLICATE_ATTEMPT: 'DUPLICATE_ATTEMPT',
    PAYMENT_DECLARED: 'PAYMENT_DECLARED',
    PAYMENT_VERIFIED: 'PAYMENT_VERIFIED',
    PAYMENT_REJECTED: 'PAYMENT_REJECTED',
    DECLARED: 'DECLARED',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
} as const;

export type HistoryActionType =
    (typeof HistoryAction)[keyof typeof HistoryAction];

export const AuditAction = {
    ADMIN_LOGIN: 'ADMIN_LOGIN',
    ADMIN_LOGOUT: 'ADMIN_LOGOUT',
    ADMIN_REFRESH: 'ADMIN_REFRESH',

    ADMIN_FORGOT_PASSWORD: 'ADMIN_FORGOT_PASSWORD',
    ADMIN_VERIFY_OTP: 'ADMIN_VERIFY_OTP',
    ADMIN_RESET_PASSWORD: 'ADMIN_RESET_PASSWORD',

    TRANSACTION_VERIFY: 'TRANSACTION_VERIFY',
    TRANSACTION_REJECT: 'TRANSACTION_REJECT',

    ADMIN_VIEW_LEADS: 'ADMIN_VIEW_LEADS',
} as const;

export type AuditActionType =
    (typeof AuditAction)[keyof typeof AuditAction];

export const AdminPermission = {
    READ: 'READ',
    WRITE: 'WRITE',
    DANGEROUS: 'DANGEROUS',
    MANAGE_SETTINGS: 'MANAGE_SETTINGS',
} as const;

export type AdminPermissionType =
    (typeof AdminPermission)[keyof typeof AdminPermission];

export const PAGINATION = {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
    DEFAULT_PAGE: 1,
    MAX_TRANSACTIONS_LIMIT: 200,
} as const;

export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
} as const;

export const RATE_LIMIT = {
    DEFAULT_WINDOW_MS: 15 * 60 * 1000,
    DEFAULT_MAX: 100,
    DEFAULT_MAX_LEADS: 10,
    DEFAULT_MAX_TRANSACTIONS: 50,
} as const;

export const AdminRoutePolicy = {
    // Auth
    '/me': AdminPermission.READ,
    '/logout': AdminPermission.READ,

    // Leads
    '/leads': AdminPermission.READ,

    // Transactions
    '/transactions': AdminPermission.READ,
    '/transactions/:id': AdminPermission.READ,
    '/transactions/:id/verify': AdminPermission.DANGEROUS,

    // Settings (future)
    '/settings': AdminPermission.DANGEROUS,
} as const;
