import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PenTool } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import TrackApplicationModal from "./TrackApplicationModal";
import { useConfig } from "@/contexts/ConfigContext";

export default function Header() {
    const [isTrackOpen, setIsTrackOpen] = useState(false);
    const { config } = useConfig();
    const whatsappLink = `https://wa.me/${config.contact.whatsapp}`;

    const handleTrackOpen = useCallback(() => {
        setIsTrackOpen(true);
    }, []);

    const handleTrackClose = useCallback(() => {
        setIsTrackOpen(false);
    }, []);



    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Brand */}
                <div className="flex lg:flex-1">
                    <Link
                        to="/"
                        className="flex items-center gap-2 group"
                        aria-label="Home"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <PenTool className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                            {import.meta.env.VITE_APP_NAME || "SOPWriter"}
                        </span>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex flex-1 justify-end items-center gap-3 sm:gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleTrackOpen}
                        className="hidden sm:flex"
                    >
                        Track Application
                    </Button>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                        aria-label="Talk to an Expert on WhatsApp"
                    >
                        <Button
                            className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white shadow-lg"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span className="hidden sm:inline">Talk to an Expert</span>
                            <span className="sm:hidden">Chat</span>
                        </Button>
                    </a>
                </div>
            </div>
            <TrackApplicationModal isOpen={isTrackOpen} onClose={handleTrackClose} />
        </header>
    );
}
