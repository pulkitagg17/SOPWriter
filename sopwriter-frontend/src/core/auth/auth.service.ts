import { api } from "../api/client";



export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post("/admin/login", { email, password });
        return response.data.success;
    },
    logout: async () => {
        await api.post("/admin/logout");
        window.location.href = "/admin/login";
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
