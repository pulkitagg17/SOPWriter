import { Link } from 'react-router-dom';
import { type Service } from '../../data/services';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface ServiceCardProps {
    service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="mb-2">
                    <Badge variant="outline" className="font-normal">
                        {service.category}
                    </Badge>
                </div>
                <CardTitle className="text-xl leading-tight">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.shortDescription}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link to={`/services/${service.slug}`}>View details</Link>
                </Button>
                <Button size="sm" asChild>
                    <Link to="/contact">Enquire</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
