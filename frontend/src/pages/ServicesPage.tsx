import { ServiceList } from '../components/services/ServiceList';

export function ServicesPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">All Services</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Comprehensive writing and consulting solutions tailored to your academic and professional goals.
                    Every document is crafted personally by a human expert.
                </p>
            </div>

            <ServiceList />
        </div>
    );
}
