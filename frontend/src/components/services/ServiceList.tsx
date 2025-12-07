import { services } from '../../data/services';
import { ServiceCard } from './ServiceCard';

export function ServiceList() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
}
