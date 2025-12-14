import { useState } from "react";
import { api } from "@/core/api/client";
import { ENDPOINTS } from "@/core/config/endpoints";
import { getUserFriendlyError } from "@/core/api/errorMapper";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useDeclareTransaction(leadId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const declareTransaction = async (transactionId: string, remark?: string) => {
        setIsLoading(true);
        try {
            await api.post(ENDPOINTS.TRANSACTIONS(leadId), {
                transactionId,
                remark,
            });
            navigate("/success");
        } catch (err) {
            const msg = getUserFriendlyError(err);
            toast.error(msg);
            // Let the component know it failed if needed, but toast is sufficient handled here
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { declareTransaction, isLoading };
}
