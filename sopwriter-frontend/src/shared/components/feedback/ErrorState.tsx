import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ title = "Something went wrong", message = "An error occurred while loading this content.", onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="mt-6">
                    Try Again
                </Button>
            )}
        </div>
    );
}
