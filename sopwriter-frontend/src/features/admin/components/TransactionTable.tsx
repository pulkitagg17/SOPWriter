import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Check, X } from "lucide-react";
import TransactionStatusBadge from "@/features/admin/components/TransactionStatusBadge";
import { formatTableDateTime } from "@/shared/utils/dateUtils";
import { EmptyState } from "@/shared/components/EmptyState";
import { PRICING_MAP } from "@/core/config/constants";

interface Transaction {
    _id: string;
    leadId: {
        _id: string;
        name: string;
        email: string;
        service: string;
    } | string;
    transactionId: string;
    amount?: number;
    remark?: string;
    status: 'DECLARED' | 'VERIFIED' | 'REJECTED';
    submittedAt: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onAction: (txId: string, action: 'VERIFY' | 'REJECT') => void;
}

export default function TransactionTable({ transactions, onAction }: TransactionTableProps) {
    if (transactions.length === 0) {
        return <EmptyState message="No transactions found." />;
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Lead</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Txn ID / UTR</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx) => {
                        const lead = typeof tx.leadId === 'object' && tx.leadId !== null ? tx.leadId : null;
                        const serviceName = lead?.service || "";
                        const amount = PRICING_MAP[serviceName];
                        const displayLeadId = lead ? lead._id : (typeof tx.leadId === 'string' ? tx.leadId : "Unknown");

                        return (
                            <TableRow key={tx._id}>
                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                    {formatTableDateTime(tx.submittedAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="font-mono text-xs font-medium" title={displayLeadId}>
                                        {displayLeadId.substring(displayLeadId.length - 8)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{lead?.name || "Unknown"}</div>
                                </TableCell>
                                <TableCell className="max-w-[150px] truncate" title={serviceName}>
                                    {serviceName || "-"}
                                </TableCell>
                                <TableCell className="font-mono text-xs">{tx.transactionId}</TableCell>
                                <TableCell>
                                    {amount ? `₹${amount.toLocaleString('en-IN')}` : '-'}
                                </TableCell>
                                <TableCell>
                                    <TransactionStatusBadge status={tx.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {tx.status === 'DECLARED' && (
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                onClick={() => onAction(tx._id, 'VERIFY')}
                                            >
                                                <Check className="h-4 w-4 sm:mr-1" />
                                                <span className="hidden sm:inline">Verify</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                onClick={() => onAction(tx._id, 'REJECT')}
                                            >
                                                <X className="h-4 w-4 sm:mr-1" />
                                                <span className="hidden sm:inline">Reject</span>
                                            </Button>
                                        </div>
                                    )}
                                    {tx.status !== 'DECLARED' && (
                                        <span className="text-xs text-muted-foreground italic px-2">
                                            {tx.status === 'VERIFIED' ? 'Verified' : 'Rejected'}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
