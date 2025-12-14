interface PaymentConfirmationPanelProps {
    leadId: string;
}

/**
 * Panel showing payment confirmation when payment details should not be shown
 */
export default function PaymentConfirmationPanel({
    leadId
}: PaymentConfirmationPanelProps) {
    return (
        <div className="lg:w-[450px] bg-card/40 backdrop-blur-md p-6 lg:p-10 flex flex-col justify-center border-l border-white/5">
            <h3 className="text-xl font-bold mb-6">What Happens Next?</h3>
            <ol className="relative border-l border-primary/20 ml-2 space-y-6">
                <li className="mb-2 ml-6">
                    <span className="absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-background bg-primary/20">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    </span>
                    <h4 className="font-semibold text-foreground">Payment Verification</h4>
                    <p className="text-sm text-muted-foreground mt-1">We are currently verifying your payment with our bank. This usually takes less than 24 hours.</p>
                </li>
                <li className="mb-2 ml-6">
                    <span className="absolute flex items-center justify-center w-4 h-4 bg-muted rounded-full -left-2 ring-4 ring-background"></span>
                    <h4 className="font-medium text-muted-foreground">Confirmation Email</h4>
                    <p className="text-sm text-muted-foreground mt-1">Once verified, you'll receive a confirmation email with your service details.</p>
                </li>
                <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-4 h-4 bg-muted rounded-full -left-2 ring-4 ring-background"></span>
                    <h4 className="font-medium text-muted-foreground">Service Start</h4>
                    <p className="text-sm text-muted-foreground mt-1">Our experts will begin working on your application immediately after confirmation.</p>
                </li>
            </ol>

            <div className="mt-8 pt-6 border-t border-border/10">
                <p className="text-sm text-muted-foreground">
                    Reference ID: <span className="font-mono font-bold text-foreground">{leadId}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Keep this ID handy for any future correspondence.
                </p>
            </div>
        </div>
    );
}
