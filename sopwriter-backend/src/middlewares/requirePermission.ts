import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/errors.js';
import { AdminPermission, AdminPermissionType } from '../constants/index.js';

export function requirePermission(required: AdminPermissionType) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const admin = (req as any).admin;

        if (!admin) throw new AuthenticationError('Admin context missing');

        if (required === AdminPermission.DANGEROUS) {
            if (!admin.email) {
                throw new AuthenticationError('Dangerous action blocked');
            }
        }

        next();
    }
}
