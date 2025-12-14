import { Suspense } from "react";
import Header from "@/shared/components/layout/Header";

export const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <Suspense fallback={<PageLoader />}>
                {children}
            </Suspense>
        </>
    );
}
