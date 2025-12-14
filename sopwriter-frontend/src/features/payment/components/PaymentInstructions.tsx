import { toast } from "sonner";

export default function PaymentInstructions() {
    const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || "support@example.com";
    const upiId = import.meta.env.VITE_UPI_ID || "example@upi";

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <div className="space-y-6">
            {/* UPI ID Copy Section */}
            <div className="text-center space-y-2">
                <p className="font-medium text-foreground">QR not working? You can pay directly to:</p>
                <div
                    onClick={() => copyToClipboard(upiId, 'UPI ID')}
                    className="inline-flex items-center gap-2 bg-secondary/50 hover:bg-secondary border border-border px-4 py-2 rounded-full cursor-pointer transition-colors group"
                >
                    <span className="font-mono font-bold text-lg">{upiId}</span>
                    <span className="text-xs bg-background border px-2 py-0.5 rounded text-muted-foreground group-hover:text-foreground transition-colors">
                        Tap to copy UPI ID
                    </span>
                </div>
            </div>

            {/* Instructions Card */}
            <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">How to Pay with UPI</h3>
                <ol className="space-y-4 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                        <span className="flex-none font-bold text-primary">1.</span>
                        <span>Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-none font-bold text-primary">2.</span>
                        <span>Scan the QR code above or use the UPI ID manually</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-none font-bold text-primary">3.</span>
                        <span>Verify the payment details and confirm</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-none font-bold text-primary">4.</span>
                        <span className="text-foreground font-medium">
                            (MANDATORY) Email the screenshot of the payment transaction and your Reference ID to <a href={`mailto:${supportEmail}`} className="text-primary hover:underline font-bold">{supportEmail}</a>
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-none font-bold text-primary">5.</span>
                        <span>Click "I Have Paid" below and enter your Transaction ID.</span>
                    </li>
                </ol>
            </div>

            {/* Reference ID Footer */}
            <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground mb-4">Need help with payment? Contact us at <a href={`mailto:${supportEmail}`} className="underline text-primary">{supportEmail}</a></p>
            </div>
        </div>
    );
}
