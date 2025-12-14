import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { useState } from "react";
import { api } from "@/core/api/client";
import { toast } from "sonner";

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
  onSuccess,
}: VerifyTransactionModalProps) {
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!transactionId || !currentAction) return;

    setIsSubmitting(true);
    try {
      const endpoint = `/admin/transactions/${transactionId}/verify`;

      await api.post(endpoint, {
        action: currentAction,
        note: remark
      });

      toast.success(`Transaction ${currentAction === 'VERIFY' ? 'verified' : 'rejected'} successfully`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRemark("");
    onClose();
  };

  const actionText = currentAction === 'VERIFY' ? 'Verify' : 'Reject';
  const title = `${actionText} Transaction`;
  const description = currentAction === 'VERIFY'
    ? "Confirm verification of this payment transaction"
    : "Reject this payment transaction with a reason";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              Remark
            </Label>
            <Textarea
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="col-span-3"
              placeholder="Add any notes or reasons..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant={currentAction === 'VERIFY' ? 'default' : 'destructive'}
          >
            {isSubmitting ? 'Processing...' : actionText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
