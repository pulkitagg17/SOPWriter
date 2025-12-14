import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import type { Lead } from "@/features/admin/hooks/useAdminLeads";
import { memo } from "react";
import { formatTableDateTime } from "@/shared/utils/dateUtils";
import { EmptyState } from "@/shared/components/EmptyState";

interface LeadTableProps {
    leads: Lead[];
}

function LeadTableComponent({ leads }: LeadTableProps) {
    if (leads.length === 0) {
        return <EmptyState message="No leads found." />;
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
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
                                <button className="text-sm text-primary hover:underline">
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

const LeadTable = memo(LeadTableComponent);

export default LeadTable;