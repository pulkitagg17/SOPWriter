import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ErrorCode } from '../constants/index.js';
import { errorResponse } from '../utils/responses.js';

export function validateRequest(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parse = schema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        ...errorResponse(ErrorCode.VALIDATION_ERROR, 'Invalid request', parse.error.issues),
      });
    }
    // attach validated data
    (req as any).validatedBody = parse.data;
    return next();
  };
}
