import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DeclarePaymentModal from "@/features/payment/components/DeclarePaymentModal";
import OrderDetailsPanel from "@/features/payment/components/OrderDetailsPanel";
import PaymentInstructionsPanel from "@/features/payment/components/PaymentInstructionsPanel";
import PaymentConfirmationPanel from "@/features/payment/components/PaymentConfirmationPanel";
import PaymentStatusBanner from "@/features/payment/components/PaymentStatusBanner";
import { Loader2, AlertCircle } from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";
import { useLead } from "@/features/payment/hooks/useLead";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { getPaymentStatusInfo } from "@/features/payment/utils/paymentStatus";

export default function Payment() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const leadId = searchParams.get("leadId");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { config } = useConfig();
    const { lead, isLoading, error } = useLead(leadId);
    const { copyToClipboard } = useClipboard();

    const upiUrl = config.payment.upiQrImage || "/qr.jpg";
    const upiId = config.payment.upiId;
    const supportEmail = config.contact.supportEmail;

    // Redirect if no leadId
    if (!leadId) {
        navigate("/");
        return null;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full bg-card border border-border rounded-xl p-6 text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-xl font-bold">Application Not Found</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // Get payment status info using our utility
    const paymentStatus = getPaymentStatusInfo(lead);

    return (
        <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden font-sans">
            {/* Background Ambient Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[128px] pointer-events-none" />

            {/* Payment Status Banner */}
            {paymentStatus && (
                <PaymentStatusBanner statusInfo={paymentStatus} />
            )}

            {/* Main Glass Card */}
            <div className="relative w-full max-w-5xl bg-card/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                <OrderDetailsPanel
                    leadId={leadId}
                    leadDetails={lead}
                    config={config}
                    onCopyClick={copyToClipboard}
                />

                {/* Conditional Rendering based on payment status */}
                {paymentStatus?.showPaymentDetails ? (
                    <PaymentInstructionsPanel
                        upiUrl={upiUrl}
                        upiId={upiId}
                        supportEmail={supportEmail}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        copyToClipboard={copyToClipboard}
                    />
                ) : (
                    paymentStatus && (
                        <PaymentConfirmationPanel
                            leadId={leadId}
                        />
                    )
                )}
            </div>

            <DeclarePaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                leadId={leadId}
            />
        </div>
    );
}
