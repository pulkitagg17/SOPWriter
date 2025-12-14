import { Suspense, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/shared/components/layout/Header";

export const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

// Scroll to top on route change and disable browser scroll restoration
function ScrollToTop() {
    const { pathname } = useLocation();

    // Disable browser's automatic scroll restoration
    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Scroll to top on route change
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollToTop />
            <Header />
            <Suspense fallback={<PageLoader />}>
                {children}
            </Suspense>
        </>
    );
}

