import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ServiceList } from '../components/services/ServiceList';

export function HomePage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">
            {/* Hero Section */}
            <section className="grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Human-crafted SOPs, visa letters & academic documents
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        No AI, no templates. Everything written personally for each client to ensure authenticity and success.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" asChild>
                            <Link to="/services">View all services</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link to="/contact">Get a free consultation</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                        13+ specialized services for your abroad study and visa journey.
                    </p>
                </div>

                <div className="bg-slate-50 border rounded-2xl p-8 space-y-4 shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-900">Expertise in:</h3>
                    <ul className="space-y-3">
                        {[
                            "SOP, Motivation Letter, LOR, University Essays",
                            "Research proposals & academic writing",
                            "Profile building & interview preparation",
                            "USA visa interview prep & Australia GTE"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-slate-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Services Preview */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Key Services</h2>
                    <Link to="/services" className="text-sm font-medium text-primary hover:underline">
                        See all services &rarr;
                    </Link>
                </div>
                <ServiceList />
            </section>
        </div>
    );
}
