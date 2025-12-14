import { AxiosError } from "axios";

export const getUserFriendlyError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        if (error.response) {
            // Backend returned an error response
            const status = error.response.status;
            const data = error.response.data as { message?: string };

            if (status === 429) {
                return "Too many attempts. Please try again shortly.";
            }
            if (status === 400) {
                return data?.message || "Please check your input and try again.";
            }
            if (status >= 500) {
                return "Something went wrong on our server. Please try again later.";
            }
            return data?.message || "An unexpected error occurred.";
        } else if (error.request) {
            // Request was made but no response received
            return "Unable to reach the server. Please check your internet connection.";
        }
    }
    return "An unexpected error occurred. Please try again.";
};
