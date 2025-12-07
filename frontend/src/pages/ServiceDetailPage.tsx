import { useParams, Link } from 'react-router-dom';
import { services } from '../data/services';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function ServiceDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Service not found</h1>
                <p className="text-muted-foreground">The service you are looking for does not exist.</p>
                <Button asChild>
                    <Link to="/services">Return to all services</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            <div className="space-y-4">
                <Badge variant="secondary" className="text-sm py-1 px-3">
                    Category: {service.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                    {service.name}
                </h1>
            </div>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-slate-700">
                    {service.longDescription}
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-blue-900">What to expect:</h3>
                <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        100% Human-written content (No AI)
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        1-2 rounds of revisions included
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Delivery in editable DOCX and PDF formats
                    </li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="flex-1 sm:flex-none">
                    <Link to="/contact">Enquire about this service</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="flex-1 sm:flex-none">
                    <Link to="/services">Back to all services</Link>
                </Button>
            </div>
        </div>
    );
}
