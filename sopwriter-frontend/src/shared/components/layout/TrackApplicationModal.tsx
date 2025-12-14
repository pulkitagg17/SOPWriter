import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { api } from "@/core/api/client";
import { ENDPOINTS } from "@/core/config/endpoints";

interface TrackApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TrackApplicationModal({ isOpen, onClose }: TrackApplicationModalProps) {
    const [leadId, setLeadId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadId.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            // Validate lead ID exists before navigating
            const res = await api.get(ENDPOINTS.LEADS + "/" + leadId.trim());
            if (res.data.success) {
                navigate(`/payment?leadId=${leadId.trim()}`);
                onClose();
            } else {
                setError("Application not found. Please check your Reference ID.");
            }
        } catch (err: unknown) {
            // @ts-expect-error - Accessing potential axios error
            if (err?.response?.status === 404) {
                setError("Application with this Reference ID does not exist.");
            } else {
                setError("Failed to track application. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setLeadId("");
                setError(null);
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Track Application</DialogTitle>
                    <DialogDescription>
                        Enter your Reference ID (Lead ID) to check status or complete payment.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 py-2">
                    <div className="space-y-2">
                        <Input
                            placeholder="e.g. 64f2a..."
                            value={leadId}
                            onChange={(e) => {
                                setLeadId(e.target.value);
                                if (error) setError(null);
                            }}
                            required
                            disabled={isLoading}
                            className="text-base"
                        />
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Tracking...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Track Application
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center pt-1">
                        Lost your ID? Check the <strong>confirmation email</strong> we sent you.
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}
