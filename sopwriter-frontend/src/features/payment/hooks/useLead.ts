

import { useState, useEffect } from "react";
import { api } from "@/core/api/client";
import { ENDPOINTS } from "@/core/config/endpoints";
import { toast } from "sonner";
import type { Lead } from "@/types/config";

interface UseLeadResult {
    lead: Lead | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching lead data by ID
 * @param leadId - The lead ID to fetch
 * @param token - optional access token for IDOR protection
 * @returns Object containing lead data, loading state, error, and refetch function
 */
export function useLead(leadId: string | null, token?: string | null): UseLeadResult {
    const [lead, setLead] = useState<Lead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLead = async () => {
        if (!leadId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const endpoint = token
                ? `${ENDPOINTS.LEADS}/${leadId}?token=${token}`
                : `${ENDPOINTS.LEADS}/${leadId}`;

            const res = await api.get(endpoint);
            if (res.data.success) {
                setLead(res.data.data);
                setError(null);
            }
        } catch (err: unknown) {
            console.error("Failed to fetch lead:", err);
            // @ts-expect-error - Accessing potential axios error
            if (err?.response?.status === 404) {
                setError("Application with this Reference ID does not exist.");
            } else {
                setError("Failed to fetch application details. Please try again.");
            }
            toast.error("Failed to fetch application details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLead();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadId]);

    return { lead, isLoading, error, refetch: fetchLead };
}
