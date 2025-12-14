import { useState, useEffect, useCallback } from "react";
import { api } from "@/core/api/client";
import { toast } from "sonner";

export interface Lead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    status: string;
    notes?: string;
    createdAt: string;
}

export function useAdminLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchLeads = useCallback(async () => {
        setIsLoading(true);
        // Create a new AbortController for each request
        const controller = new AbortController();

        try {
            let query = `?limit=100`;
            if (debouncedSearch) {
                query += `&search=${encodeURIComponent(debouncedSearch)}`;
            }

            const res = await api.get(`/admin/leads${query}`, {
                signal: controller.signal
            });

            if (res.data.success) {
                let filteredLeads = res.data.data.items;

                // Client-side status filter
                if (statusFilter !== "all") {
                    filteredLeads = filteredLeads.filter((lead: Lead) => lead.status === statusFilter);
                }

                setLeads(filteredLeads);
            }
        } catch (error: unknown) {
            // Ignore abort errors
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            console.error(error);
            toast.error("Failed to load leads");
        } finally {
            setIsLoading(false);
        }

        // Return the controller so it can be aborted if needed
        return controller;
    }, [debouncedSearch, statusFilter]);

    useEffect(() => {
        const controllerPromise = fetchLeads();

        // Cleanup function to abort the request if the component unmounts
        return () => {
            controllerPromise.then(controller => {
                if (controller) {
                    controller.abort();
                }
            });
        };
    }, [fetchLeads]);

    return {
        leads,
        isLoading,
        refetch: fetchLeads,
        search,
        setSearch,
        statusFilter,
        setStatusFilter
    };
}
