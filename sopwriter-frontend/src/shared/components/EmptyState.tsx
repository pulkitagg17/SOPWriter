import { cn } from "@/shared/utils/cn";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div className={cn("p-8 text-center text-muted-foreground border rounded-lg bg-muted/20", className)}>
      {message}
    </div>
  );
}