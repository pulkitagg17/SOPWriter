import type { Request, Response, NextFunction } from 'express';
import { logger } from './requestLogger.js';
import { AppError } from '../utils/errors.js';
import { ErrorCode } from '../constants/index.js';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  const reqId = (req as any).requestId || req.headers['x-request-id'] || null;
  logger.error({ reqId, err }, 'unhandled_error');

  // Handle custom AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      requestId: reqId,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV !== 'production' && err.stack && { stack: err.stack }),
    });
    return;
  }

  // Standardized error response shape for other errors
  const payload: any = {
    success: false,
    code: err.code || ErrorCode.INTERNAL_ERROR,
    message: err.message || 'Internal server error',
    requestId: reqId,
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;
  // If validation errors were attached
  if (err.validation) payload.details = err.validation;

  // map certain known error types to status codes
  let status = 500;
  if (err.name === 'ValidationError' || err.code === ErrorCode.VALIDATION_ERROR) status = 400;
  if (err.code === ErrorCode.AUTH_REQUIRED || err.code === ErrorCode.AUTH_INVALID) status = 401;
  if (err.code === ErrorCode.FORBIDDEN) status = 403;
  if (
    err.code === ErrorCode.NOT_FOUND ||
    err.code === ErrorCode.TRANSACTION_NOT_FOUND ||
    err.code === ErrorCode.LEAD_NOT_FOUND
  )
    status = 404;
  if (err.code === ErrorCode.RATE_LIMIT) status = 429;

  res.status(status).json(payload);
}

export default errorHandler;
