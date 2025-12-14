import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/core/auth/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await auth.forgotPassword(email);
            setIsSent(true);
            toast.success("If an account exists, an OTP has been sent.");
        } catch (error) {
            console.error(error);
            // Generic message or rate limit
            toast.error("Failed to send OTP. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
                <Card className="w-full max-w-md shadow-xl border-muted/50">
                    <CardHeader className="text-center">
                        <CardTitle>Check your email</CardTitle>
                        <CardDescription>
                            We've sent a 6-digit verification code to {email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild className="w-full">
                            <Link to={`/admin/verify-otp?email=${encodeURIComponent(email)}`}>
                                Enter OTP
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link to="/admin/login">Back to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <Card className="w-full max-w-md shadow-xl border-muted/50">
                <CardHeader>
                    <div className="mb-2">
                        <Link to="/admin/login" className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                    </div>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a code to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Code
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
