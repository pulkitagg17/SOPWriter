import { Request, Response, NextFunction } from 'express';
import { config_vars } from '../config/env.js';
import { AuthenticationError } from '../utils/errors.js';

/**
 * Validates that state-changing requests (POST, PUT, DELETE, PATCH)
 * originate from allowed domains.
 * This complements SameSite=Strict cookies for CSRF protection.
 */
export const validateOrigin = (req: Request, _res: Response, next: NextFunction) => {
    // Skip for GET/HEAD/OPTIONS (safe methods)
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const origin = req.headers.origin;
    const referer = req.headers.referer;

    // In production, Origin or Referer is usually present
    if (!origin && !referer) {
        // If strict security is required, reject.
        // However, some valid clients might omit them.
        // Given the requirement "Validate Origin or Referer", we'll enforce it.
        throw new AuthenticationError('Missing Origin or Referer header');
    }

    // Check Origin
    if (origin) {
        if (config_vars.cors.origin.includes(origin)) {
            return next();
        }
        throw new AuthenticationError('Invalid Origin');
    }

    // Fallback to Referer
    if (referer) {
        const refererUrl = new URL(referer);
        if (config_vars.cors.origin.includes(refererUrl.origin)) {
            return next();
        }
        throw new AuthenticationError('Invalid Referer');
    }

    next();
};
