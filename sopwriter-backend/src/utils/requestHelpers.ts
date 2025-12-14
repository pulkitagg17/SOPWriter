import { Request } from 'express';

/**
 * Safely extract client IP address
 * Requires 'trust proxy' to be enabled in Express
 */
export function getClientIp(req: Request): string {
  return req.ip || 'unknown';
}
