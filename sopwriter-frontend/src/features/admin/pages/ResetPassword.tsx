import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/core/auth/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface PasswordRequirement {
    label: string;
    test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
    { label: "One special character (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetToken } = location.state || {}; // Expect token from nav state

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!resetToken) {
            toast.error("Invalid session. Please verify OTP again.");
            navigate("/admin/forgot-password");
        }
    }, [resetToken, navigate]);

    // Check all password requirements
    const requirementStatus = useMemo(() => {
        return passwordRequirements.map((req) => ({
            ...req,
            passed: req.test(password),
        }));
    }, [password]);

    const allRequirementsMet = requirementStatus.every((r) => r.passed);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!allRequirementsMet) {
            toast.error("Please meet all password requirements");
            return;
        }

        if (!passwordsMatch) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await auth.resetPassword(resetToken, password);
            toast.success("Password reset successfully. Please login.");
            navigate("/admin/login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset password. Token may have expired.");
            navigate("/admin/forgot-password");
        } finally {
            setIsLoading(false);
        }
    };

    if (!resetToken) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <Card className="w-full max-w-md shadow-xl border-muted/50">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Create a new strong password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pass">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="pass"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter strong password"
                                    className="pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements Checklist */}
                        {password.length > 0 && (
                            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium text-foreground mb-3">Password Requirements:</p>
                                {requirementStatus.map((req, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-2 text-sm transition-colors ${req.passed ? "text-green-500" : "text-muted-foreground"
                                            }`}
                                    >
                                        {req.passed ? (
                                            <Check className="h-4 w-4 shrink-0" />
                                        ) : (
                                            <X className="h-4 w-4 shrink-0 text-red-400" />
                                        )}
                                        <span>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <div className={`flex items-center gap-2 text-sm mt-2 ${passwordsMatch ? "text-green-500" : "text-red-400"
                                    }`}>
                                    {passwordsMatch ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            <span>Passwords match</span>
                                        </>
                                    ) : (
                                        <>
                                            <X className="h-4 w-4" />
                                            <span>Passwords do not match</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
