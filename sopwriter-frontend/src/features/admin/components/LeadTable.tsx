import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { formatTableDateTime } from "@/shared/utils/dateUtils";
import { EmptyState } from "@/shared/components/EmptyState";

interface Lead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    status: string;
    notes?: string;
    createdAt: string;
}

interface LeadTableProps {
    leads: Lead[];
    onView: (lead: Lead) => void;
}

export default function LeadTable({ leads, onView }: LeadTableProps) {
    if (leads.length === 0) {
        return <EmptyState message="No leads found." />;
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[100px]">Ref ID</TableHead>
                        <TableHead className="min-w-[150px]">Submitted</TableHead>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[180px]">Email</TableHead>
                        <TableHead className="min-w-[130px]">Phone</TableHead>
                        <TableHead className="min-w-[180px]">Service</TableHead>
                        <TableHead className="min-w-[200px]">Notes</TableHead>
                        <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow key={lead._id}>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                {lead._id.substring(lead._id.length - 8)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground">
                                        {formatTableDateTime(lead.createdAt)}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.phone || "-"}</TableCell>
                            <TableCell>{lead.service}</TableCell>
                            <TableCell className="max-w-xs truncate" title={lead.notes}>
                                {lead.notes || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                                <button
                                    onClick={() => onView(lead)}
                                    className="text-sm text-primary hover:underline font-medium"
                                >
                                    View
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
