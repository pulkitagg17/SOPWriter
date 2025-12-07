import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/cn';
import { useState } from 'react';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight text-slate-900">GlobalDocs</span>
                    <span className="text-xs text-muted-foreground font-medium">SOP & Visa Consulting</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/services"
                        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        Services
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        Contact
                    </NavLink>
                    <Button asChild size="sm">
                        <Link to="/contact">Get in Touch</Link>
                    </Button>
                </nav>

                {/* Mobile Menu Toggle (Simple) */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="sr-only">Open menu</span>
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    )}
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white px-4 py-4 space-y-4 flex flex-col">
                    <NavLink
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/services"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        Services
                    </NavLink>
                    <NavLink
                        to="/about"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contact"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
                    >
                        Contact
                    </NavLink>
                </div>
            )}
        </header>
    );
}
