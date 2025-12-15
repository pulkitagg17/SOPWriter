import { api } from "../api/client";



const TOKEN_KEY = '__admin_token_fallback';

export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post("/admin/login", { email, password });
        if (response.data.success && response.data.data?.token) {
            sessionStorage.setItem(TOKEN_KEY, response.data.data.token);
        }
        return response.data.success;
    },
    logout: async () => {
        try {
            await api.post("/admin/logout");
        } finally {
            sessionStorage.removeItem(TOKEN_KEY);
            window.location.href = "/admin/login";
        }
    },
    checkSession: async () => {
        try {
            const response = await api.get("/admin/me");
            return response.data.success ? response.data.data.admin : null;
        } catch {
            return null;
        }
    },
    forgotPassword: async (email: string) => {
        return api.post("/admin/forgot-password", { email });
    },
    verifyOtp: async (email: string, otp: string) => {
        const response = await api.post("/admin/verify-otp", { email, otp });
        return response.data.data.resetToken;
    },
    resetPassword: async (resetToken: string, newPassword: string) => {
        return api.post("/admin/reset-password", { resetToken, newPassword });
    }
};
