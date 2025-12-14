import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";
import { auth } from "@/core/auth/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function AdminLogin() {
    // Redirect if already logged in
    useAdminAuth(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await auth.login(email, password);
            if (success) {
                toast.success("Welcome back, Admin");
                navigate("/admin/dashboard");
            } else {
                toast.error("Invalid credentials");
            }
        } catch (error: unknown) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    toast.error("Invalid credentials");
                } else if (error.response.status === 429) {
                    toast.error("Too many attempts. Please try again later.");
                } else {
                    toast.error(error.response.data?.message || "Login failed");
                }
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <Card className="w-full max-w-md shadow-xl border-muted/50">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/forgot-password')}
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}
