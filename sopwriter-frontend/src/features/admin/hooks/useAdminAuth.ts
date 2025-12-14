import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/core/auth/auth.service";

export function useAdminAuth(requireAuth = true) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            try {
                const admin = await auth.checkSession();
                if (mounted) {
                    setIsAuthenticated(!!admin);

                    if (requireAuth && !admin) {
                        navigate("/admin/login");
                    } else if (!requireAuth && admin) {
                        navigate("/admin/dashboard");
                    }
                }
            } catch {
                if (mounted && requireAuth) {
                    navigate("/admin/login");
                }
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        checkAuth();

        return () => { mounted = false; };
    }, [requireAuth, navigate]);

    return { isAuthenticated, isLoading };
}
