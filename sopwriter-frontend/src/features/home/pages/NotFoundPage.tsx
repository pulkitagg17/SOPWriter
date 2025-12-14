import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been removed or renamed.
            </p>
            <Link to="/" className="mt-8">
                <Button>Go Back Home</Button>
            </Link>
        </div>
    );
}
