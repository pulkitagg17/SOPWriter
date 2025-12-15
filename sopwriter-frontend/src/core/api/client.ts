import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});



// Request interceptor can be used for other things, but token logic is handled by cookies now.
// api.interceptors.request.use((config) => { ... });

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // If the error comes from login or refresh endpoint, don't retry, just fail
            if (
                originalRequest.url?.includes('/login') ||
                originalRequest.url?.includes('/refresh') ||
                originalRequest.url?.includes('/forgot-password') ||
                originalRequest.url?.includes('/verify-otp') ||
                originalRequest.url?.includes('/reset-password')
            ) {
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh the session
                await api.post('/admin/refresh');

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clean up and redirect
                // Ideally use a router navigation, but here window.location is safe fallback
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/admin/login';
                }
                return Promise.reject(refreshError);
            }
        }

        // Hooks will use errorMapper to get user friendly messages
        return Promise.reject(error);
    }
);
