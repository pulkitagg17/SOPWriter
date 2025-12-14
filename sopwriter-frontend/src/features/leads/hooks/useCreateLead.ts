import { useState } from "react";
import { api } from "@/core/api/client";
import { ENDPOINTS } from "@/core/config/endpoints";
import { getUserFriendlyError } from "@/core/api/errorMapper";
import { toast } from "sonner";
import type { WizardDetails } from "@/types/wizard";

interface CreateLeadPayload extends WizardDetails {
    service: string;
}

export function useCreateLead() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createLead = async (data: CreateLeadPayload) => {
        setIsLoading(true);
        setError(null);

        // Create a new AbortController for each request
        const controller = new AbortController();

        try {
            const response = await api.post(ENDPOINTS.LEADS, data, {
                signal: controller.signal
            });
            // Backend returns { success: true, data: { leadId: "..." } }
            const leadId = response.data.data?.leadId || response.data.leadId || response.data.id || response.data._id;
            if (!leadId) {
                console.error("Unexpected response format:", response.data);
                throw new Error("Invalid response from server");
            }
            return leadId;
        } catch (err: unknown) {
            // Ignore abort errors
            if (err instanceof Error && err.name === 'AbortError') {
                return null;
            }
            const msg = getUserFriendlyError(err);
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createLead, isLoading, error };
}
