import { useState, useEffect, useCallback } from "react";
import { api } from "@/core/api/client";
import { toast } from "sonner";

export interface Transaction {
    _id: string;
    leadId: {
        _id: string;
        name: string;
        email: string;
        service: string;
    } | string; // Populated lead object or string ID
    transactionId: string;
    utrNumber?: string;
    amount?: number;
    remark?: string;
    status: 'DECLARED' | 'VERIFIED' | 'REJECTED';
    submittedAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export function useAdminTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("DECLARED");

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        // Create a new AbortController for each request
        const controller = new AbortController();

        try {
            const res = await api.get(`/admin/transactions?status=${filterStatus}&limit=50`, {
                signal: controller.signal
            });
            if (res.data.success) {
                setTransactions(res.data.data.items);
            }
        } catch (error: unknown) {
            // Ignore abort errors
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            console.error(error);
            toast.error("Failed to load transactions");
        } finally {
            setIsLoading(false);
        }

        // Return the controller so it can be aborted if needed
        return controller;
    }, [filterStatus]);

    useEffect(() => {
        const controllerPromise = fetchTransactions();

        // Cleanup function to abort the request if the component unmounts
        return () => {
            controllerPromise.then(controller => {
                if (controller) {
                    controller.abort();
                }
            });
        };
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        refetch: fetchTransactions,
        filterStatus,
        setFilterStatus
    };
}
