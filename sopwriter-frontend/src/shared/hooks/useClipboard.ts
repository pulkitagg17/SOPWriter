import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Custom hook for clipboard operations with toast notifications
 * @returns Object with copyToClipboard function
 */
export function useClipboard() {
    const copyToClipboard = useCallback((text: string, label: string = "Text") => {
        navigator.clipboard.writeText(text).then(
            () => {
                toast.success(`${label} copied to clipboard`);
            },
            (err) => {
                console.error("Failed to copy to clipboard:", err);
                toast.error(`Failed to copy ${label}`);
            }
        );
    }, []);

    return { copyToClipboard };
}
