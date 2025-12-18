import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    logger.warn(
      {
        code: err.code,
        statusCode: err.statusCode,
        details: err.details,
      },
      err.message
    );

    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  // Unknown / programmer error
  logger.error({ err }, 'UNHANDLED_EXCEPTION');

  res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  });
}

export default errorHandler;
