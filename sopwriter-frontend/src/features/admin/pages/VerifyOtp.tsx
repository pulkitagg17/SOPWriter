import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "@/core/auth/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyOtp() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/admin/forgot-password");
        }
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const resetToken = await auth.verifyOtp(email, otp);
            toast.success("OTP Verified");
            // Navigate to reset password with token
            // We can pass token in state to avoid exposing in URL, or URL param
            navigate("/admin/reset-password", { state: { resetToken, email } });
        } catch (error) {
            console.error(error);
            toast.error("Invalid or expired OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <Card className="w-full max-w-md shadow-xl border-muted/50">
                <CardHeader className="text-center">
                    <CardTitle>Enter OTP</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to {email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                className="text-center text-lg tracking-widest"
                                required
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading || otp.length < 6}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link to="/admin/forgot-password">Resend Code</Link>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
