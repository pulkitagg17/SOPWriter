import type { PaymentStatusInfoWithIcon } from "@/features/payment/utils/paymentStatus";

interface PaymentStatusBannerProps {
    statusInfo: PaymentStatusInfoWithIcon;
}

/**
 * Banner component to display payment status at the top of the payment page
 */
export default function PaymentStatusBanner({ statusInfo }: PaymentStatusBannerProps) {
    return (
        <div className={`w-full max-w-6xl mb-6 rounded-2xl border p-5 flex items-start gap-4 ${statusInfo.color}`}>
            <div className="pt-0.5">
                {statusInfo.icon}
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-lg">{statusInfo.text}</h3>
                <p className="text-sm opacity-90 mt-1">{statusInfo.description}</p>
            </div>
        </div>
    );
}
