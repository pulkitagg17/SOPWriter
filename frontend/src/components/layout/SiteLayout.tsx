import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface SiteLayoutProps {
    children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
