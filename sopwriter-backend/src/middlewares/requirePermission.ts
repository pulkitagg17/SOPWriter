import { AdminRoutePolicy } from '../constants/index.js';
import { AuthenticationError } from '../utils/errors.js';
import { Request, Response, NextFunction } from 'express';

export function requirePermission(route: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const admin = (req as any).admin;
        if (!admin) throw new AuthenticationError('Admin context missing');

        let policyRoute = route;
        if (route.includes(':id')) {
            policyRoute = route.replace(':id', req.params.id);
        }

        const requiredPermission = AdminRoutePolicy[policyRoute as keyof typeof AdminRoutePolicy];
        if (!requiredPermission) {
            next();
            return;
        }

        next();
    }
}
