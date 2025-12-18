import { Request, Response, NextFunction } from 'express';
import { config_vars } from '../config/env.js';
import { AuthorizationError } from '../utils/errors.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getAllowedOrigins(): string[] {
    const origins = config_vars.cors.origin;
    return Array.isArray(origins) ? origins : [origins];
}

export function validateOrigin(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    if (SAFE_METHODS.has(req.method) || config_vars.nodeEnv === 'test') {
        return next();
    }

    const allowedOrigins = getAllowedOrigins();

    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        return next();
    }

    const referer = req.headers.referer;
    if (referer) {
        try {
            const refererOrigin = new URL(referer).origin;
            if (allowedOrigins.includes(refererOrigin)) {
                return next();
            }
        } catch {
            // malformed referer → fall through
        }
    }

    throw new AuthorizationError('Invalid request origin');
}
