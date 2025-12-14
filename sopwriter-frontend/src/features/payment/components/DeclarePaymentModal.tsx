import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useDeclareTransaction } from "@/features/payment/hooks/useDeclareTransaction";
import { Loader2 } from "lucide-react";

interface DeclarePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    leadId: string;
}

export default function DeclarePaymentModal({ isOpen, onClose, leadId }: DeclarePaymentModalProps) {
    const [transactionId, setTransactionId] = useState("");
    const [remark, setRemark] = useState("");
    const { declareTransaction, isLoading } = useDeclareTransaction(leadId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionId.trim()) return;

        try {
            await declareTransaction(transactionId, remark);
            // Success will redirect, but we can close modal here too just in case
            onClose();
        } catch {
            // Error handled by hook toast
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Declare Payment</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Enter the Transaction ID / UTR Number from your payment app to verify your submission.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 py-2 sm:py-4">
                    <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="txnId" className="text-sm">Transaction ID / UTR <span className="text-destructive">*</span></Label>
                        <Input
                            id="txnId"
                            placeholder="e.g. 123456789012"
                            value={transactionId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)}
                            required
                            className="text-base"
                        />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="remark" className="text-sm">Remark (Optional)</Label>
                        <Textarea
                            id="remark"
                            placeholder="Any additional details..."
                            value={remark}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemark(e.target.value)}
                            rows={3}
                            className="text-base"
                        />
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !transactionId.trim()} className="w-full sm:w-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
