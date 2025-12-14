import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const incoming = req.headers['x-request-id'] as string | undefined;
  const requestId = incoming || uuidv4();
  res.setHeader('X-Request-Id', requestId);
  (req as any).requestId = requestId;

  const start = Date.now();

  // Use 'once' instead of 'on' to prevent memory leaks
  res.once('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      {
        reqId: requestId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        ip: req.ip,
      },
      'request_finished'
    );
  });

  logger.info(
    { reqId: requestId, method: req.method, url: req.originalUrl, ip: req.ip },
    'request_start'
  );
  next();
}

export { logger };

export default logger;
