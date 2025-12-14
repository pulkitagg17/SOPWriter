import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { type ReactElement } from "react";
import { PAYMENT_STATUS_CONFIG, PAYMENT_STATUS_ICONS, type PaymentStatus } from "@/features/payment/utils/paymentStatus.constants";
import type { Lead } from "@/types/config";

export interface PaymentStatusInfoWithIcon {
    icon: ReactElement;
    text: string;
    description: string;
    color: string;
    showPaymentDetails: boolean;
}

/**
 * Get the icon component for a status
 */
function getStatusIcon(status: PaymentStatus, className: string): ReactElement {
    const iconName = PAYMENT_STATUS_ICONS[status];

    switch (iconName) {
        case "CheckCircle2":
            return <CheckCircle2 className={ className } />;
        case "XCircle":
            return <XCircle className={ className } />;
        case "Clock":
        default:
            return <Clock className={ className } />;
    }
}

/**
 * Get payment status information for a lead
 * @param lead - The lead object
 * @returns Payment status configuration or null if lead is null
 */
export function getPaymentStatusInfo(lead: Lead | null): PaymentStatusInfoWithIcon | null {
    if (!lead) return null;

    const status = lead.status as PaymentStatus;
    const config = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.NEW;

    return {
        ...config,
        icon: getStatusIcon(status, config.iconClassName),
    };
}

/**
 * Check if payment details should be shown based on lead status
 * @param lead - The lead object
 * @returns Boolean indicating if payment details should be shown
 */
export function shouldShowPaymentDetails(lead: Lead | null): boolean {
    if (!lead) return false;

    const status = lead.status as PaymentStatus;
    const config = PAYMENT_STATUS_CONFIG[status];

    return config?.showPaymentDetails ?? false;
}
