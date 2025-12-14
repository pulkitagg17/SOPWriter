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
    (error) => {
        // Hooks will use errorMapper to get user friendly messages
        return Promise.reject(error);
    }
);
