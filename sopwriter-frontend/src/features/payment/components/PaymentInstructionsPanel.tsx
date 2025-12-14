import { Button } from "@/shared/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface PaymentInstructionsPanelProps {
  upiUrl: string;
  upiId: string;
  supportEmail: string;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  copyToClipboard: (text: string, label: string) => void;
}

export default function PaymentInstructionsPanel({
  upiUrl,
  upiId,
  supportEmail,
  setIsModalOpen,
  copyToClipboard
}: PaymentInstructionsPanelProps) {
  return (
    <div className="lg:w-[450px] bg-card/40 backdrop-blur-md p-6 flex flex-col space-y-6 border-l border-white/5">
      {/* QR Code Section */}
      <div className="flex flex-col items-center space-y-5">
        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/10 border border-white/20 max-w-[220px] w-full aspect-square relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/5 rounded-2xl pointer-events-none" />
          <img
            src={upiUrl}
            alt="UPI QR Code"
            className="w-full h-full object-contain"
          />
          {/* Logo in center (optional, mimics PhonePe style in screenshot) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center p-1">
              <span className="font-bold text-xs text-black">PAY</span>
            </div>
          </div>
        </div>
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-muted-foreground">QR not working? You can pay directly to :</p>
          <div
            className="inline-flex items-center gap-3 bg-secondary/50 hover:bg-secondary pl-4 pr-3 py-2.5 rounded-xl cursor-pointer transition-all border border-border/50 group"
            onClick={() => copyToClipboard(upiId, 'UPI ID')}
          >
            <span className="font-mono text-base font-bold text-foreground tracking-tight">{upiId}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-background/80 text-foreground/70 px-2 py-1 rounded-md shadow-sm group-hover:bg-background group-hover:text-primary transition-colors">Tap to copy</span>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-gradient-to-b from-muted/50 to-muted/20 border border-border/50 rounded-2xl p-6 space-y-5 shadow-inner">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          How to Pay with UPI
        </h3>
        <ol className="space-y-5 text-sm">
          <li className="flex gap-3">
            <span className="flex-none font-bold text-orange-500">1.</span>
            <span className="text-muted-foreground"><strong className="text-foreground">Open any UPI app</strong> (PhonePe, Google Pay, Paytm, etc.)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-none font-bold text-orange-500">2.</span>
            <span className="text-muted-foreground">Scan the QR code above or use the UPI ID manually</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-none font-bold text-orange-500">3.</span>
            <span className="text-muted-foreground">Verify the payment details and confirm</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-none font-bold text-orange-500">4.</span>
            <div className="space-y-1 text-muted-foreground">
              <span className="text-orange-500 font-bold tracking-wide mr-1">(MANDATORY)</span> Email the screenshot of the payment transaction and your Reference ID to:
              <div
                onClick={() => copyToClipboard(supportEmail, "Email")}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors block mt-1"
              >
                {supportEmail}
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-none font-bold text-orange-500">5.</span>
            <span className="text-muted-foreground">Click <strong className="text-foreground">"I Have Paid"</strong> below and enter your Transaction ID.</span>
          </li>
        </ol>
      </div>

      {/* Action Button */}
      <div className="space-y-4 pt-2">
        <Button
          size="lg"
          className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
          onClick={() => setIsModalOpen(true)}
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          I Have Paid
        </Button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help with payment? Contact us at <a href={`mailto:${supportEmail}`} className="underline hover:text-primary transition-colors">{supportEmail}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
