import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog";
import { formatTableDateTime } from "@/shared/utils/dateUtils";
import { Badge } from "@/shared/components/ui/badge";
import type { Lead } from "@/features/admin/hooks/useAdminLeads";

interface LeadDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
}

export default function LeadDetailsModal({ isOpen, onClose, lead }: LeadDetailsModalProps) {
    if (!lead) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Lead Details</DialogTitle>
                    <DialogDescription>
                        View complete information for this application.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid gap-6 py-4">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Application Status</h3>
                            <Badge variant={lead.status === 'VERIFIED' ? 'default' : 'secondary'}>
                                {lead.status}
                            </Badge>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                            <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p className="font-medium">{lead.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                    <p className="font-medium">{formatTableDateTime(lead.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="font-medium">{lead.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                    <p className="font-medium">{lead.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                            <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                                Service Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                                    <p className="font-medium">{lead.service}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reference ID</p>
                                    <p className="font-medium font-mono text-xs">{lead._id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                            <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                                Application Notes
                            </h3>
                            <div className="bg-background p-3 rounded-md border min-h-[100px] whitespace-pre-wrap text-sm">
                                {lead.notes ? lead.notes : <span className="text-muted-foreground italic">No notes available.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
