import { useState } from 'react';
import { Button } from '../components/ui/button';
import { services } from '../data/services';

export function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate network delay
        setTimeout(() => {
            alert("This is a prototype form. In the full version, this will send your details directly to my dashboard.");
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Contact & Enquiry</h1>
                <p className="text-lg text-muted-foreground">
                    Fill out the form below to get in touch. I typically respond via WhatsApp or Email within 24 hours.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-6 md:p-8 shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-900">Full Name</label>
                        <input
                            id="name"
                            required
                            type="text"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-900">Email Address</label>
                        <input
                            id="email"
                            required
                            type="email"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="whatsapp" className="text-sm font-medium text-slate-900">WhatsApp Number</label>
                        <input
                            id="whatsapp"
                            required
                            type="tel"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="+1 234 567 8900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="service" className="text-sm font-medium text-slate-900">Interested Service</label>
                        <select
                            id="service"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select a service...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.slug}>{s.name}</option>
                            ))}
                            <option value="other">Other / General Enquiry</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="deadline" className="text-sm font-medium text-slate-900">Target Deadline (Optional)</label>
                    <input
                        id="deadline"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="e.g., Next month, Dec 15th..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-900">Message / Background</label>
                    <textarea
                        id="message"
                        required
                        className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Briefly describe your requirements or background..."
                    />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Enquiry (Prototype)"}
                </Button>

                <p className="text-xs text-muted-foreground text-center md:text-left">
                    * In the full version, this will send your details directly to my dashboard.
                </p>
            </form>
        </div>
    );
}
