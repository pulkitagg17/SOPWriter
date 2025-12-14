import { Badge } from "@/shared/components/ui/badge";

interface TransactionStatusBadgeProps {
  status: 'DECLARED' | 'VERIFIED' | 'REJECTED';
}

export default function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const statusConfig: Record<TransactionStatusBadgeProps['status'], { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
    DECLARED: { label: 'Pending', variant: 'warning' },
    VERIFIED: { label: 'Verified', variant: 'success' },
    REJECTED: { label: 'Rejected', variant: 'destructive' },
  };

  const { label, variant } = statusConfig[status];

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
}
