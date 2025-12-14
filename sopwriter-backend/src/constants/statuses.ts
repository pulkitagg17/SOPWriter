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

export type TransactionStatusType = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const TransactionMethod = {
  UPI: 'UPI',
  BANK: 'BANK',
  OTHER: 'OTHER',
} as const;

export type TransactionMethodType = (typeof TransactionMethod)[keyof typeof TransactionMethod];

export const ServiceCategory = {
  DOCUMENTS: 'documents',
  PROFILE: 'profile',
  VISA: 'visa',
} as const;

export type ServiceCategoryType = (typeof ServiceCategory)[keyof typeof ServiceCategory];

export const SettingType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
} as const;

export type SettingTypeType = (typeof SettingType)[keyof typeof SettingType];

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

export type HistoryActionType = (typeof HistoryAction)[keyof typeof HistoryAction];
