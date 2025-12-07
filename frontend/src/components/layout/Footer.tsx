export function Footer() {
    return (
        <footer className="border-t bg-slate-50 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-900">GlobalDocs</span>
                    <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</span>
                </div>
                <div className="flex flex-col md:items-end gap-1 text-sm text-muted-foreground">
                    <p>Contact: hello@globaldocs.com</p>
                    <p>WhatsApp: +1 (555) 123-4567</p>
                </div>
            </div>
        </footer>
    );
}
