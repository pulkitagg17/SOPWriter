import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Success() {
    return (
        <div className="min-h-[80vh] py-24 px-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="rounded-full bg-green-100 p-4 mb-6 text-green-600 dark:bg-green-900/30 dark:text-green-500">
                <CheckCircle2 className="h-12 w-12" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Payment Verification Submitted</h1>

            <p className="text-lg text-muted-foreground mb-8">
                Thank you! We have received your transaction details.
                We have sent a <strong>confirmation email</strong> to your inbox.
                Our team will verify the payment within <strong className="text-foreground">24 hours</strong>.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg w-full mb-8 text-left space-y-2">
                <h3 className="font-semibold text-foreground">What happens next?</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>We verify your transaction ID with the bank.</li>
                    <li>You will receive a confirmation email once verified.</li>
                    <li>Your assigned expert will contact you shortly after.</li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link to="/">
                    <Button size="lg" className="w-full sm:w-auto">Return to Home</Button>
                </Link>
                <a href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'support@sopwriter.com'}`}>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">Contact Support</Button>
                </a>
            </div>
        </div>
    );
}
