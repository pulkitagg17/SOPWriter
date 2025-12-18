import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
        logger.info(
            {
                requestId: (req as any).requestId,
                method: req.method,
                path: req.originalUrl,
                tusCode: res.statusCode,
                durationMs: Date.now() - start,
                ip: req.ip,
            },
            'HTTP_REQUEST'
        );
    });

    next();
}
