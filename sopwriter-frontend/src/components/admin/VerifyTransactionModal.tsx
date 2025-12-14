import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { api } from "@/core/api/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VerifyTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: string | null;
    currentAction: 'VERIFY' | 'REJECT' | null;
    onSuccess: () => void;
}

export default function VerifyTransactionModal({
    isOpen,
    onClose,
    transactionId,
    currentAction,
    onSuccess
}: VerifyTransactionModalProps) {
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!transactionId || !currentAction) return;

        // Validation: Reject requires a note
        if (currentAction === 'REJECT' && !note.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post(`/admin/transactions/${transactionId}/verify`, {
                action: currentAction,
                note
            });
            if (res.data.success) {
                toast.success(`Transaction ${currentAction === 'VERIFY' ? 'Verified' : 'Rejected'}`);
                onSuccess();
                onClose();
                setNote("");
            }
        } catch (error) {
            console.error(error);
            toast.error("Action failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {currentAction === 'VERIFY' ? 'Verify Transaction' : 'Reject Transaction'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {currentAction === 'VERIFY'
                            ? "Confirm verification of this payment transaction."
                            : "Provide a reason for rejecting this transaction."}
                    </p>

                    {currentAction === 'REJECT' && (
                        <div className="space-y-2">
                            <Label htmlFor="note">Reason for Rejection *</Label>
                            <Textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                className="min-h-[100px]"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || (currentAction === 'REJECT' && !note.trim())}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {currentAction === 'VERIFY' ? 'Verify' : 'Reject'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
