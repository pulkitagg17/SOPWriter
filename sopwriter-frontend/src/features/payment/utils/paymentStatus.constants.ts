/**
 * Payment Status Constants
 * Centralized configuration for lead payment statuses across the app
 */

export const LEAD_STATUSES = {
    NEW: 'NEW',
    PAYMENT_DECLARED: 'PAYMENT_DECLARED',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
} as const;

export type PaymentStatus = (typeof LEAD_STATUSES)[keyof typeof LEAD_STATUSES];

interface PaymentStatusConfig {
    text: string;
    description: string;
    color: string;
    iconClassName: string;
    showPaymentDetails: boolean;
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
    NEW: {
        text: 'Payment Pending',
        description: 'Please complete the payment to proceed with your application',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-200',
        iconClassName: 'h-5 w-5 text-yellow-600 dark:text-yellow-400',
        showPaymentDetails: true,
    },
    PAYMENT_DECLARED: {
        text: 'Payment Under Review',
        description: 'Your payment declaration is being verified. We\'ll confirm within 24 hours.',
        color: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200',
        iconClassName: 'h-5 w-5 text-blue-600 dark:text-blue-400',
        showPaymentDetails: false,
    },
    VERIFIED: {
        text: 'Payment Confirmed',
        description: 'Your payment has been verified successfully. We\'ll start working on your application shortly.',
        color: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-200',
        iconClassName: 'h-5 w-5 text-green-600 dark:text-green-400',
        showPaymentDetails: false,
    },
    REJECTED: {
        text: 'Payment Issue',
        description: 'There was an issue with your payment. Please contact support or declare payment again.',
        color: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200',
        iconClassName: 'h-5 w-5 text-red-600 dark:text-red-400',
        showPaymentDetails: true,
    },
};

export const PAYMENT_STATUS_ICONS: Record<PaymentStatus, string> = {
    NEW: 'Clock',
    PAYMENT_DECLARED: 'Clock',
    VERIFIED: 'CheckCircle2',
    REJECTED: 'XCircle',
};
