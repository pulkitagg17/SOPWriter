import { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../utils/errors.js';

type Source = 'body' | 'params' | 'query';

export const validateRequest =
  <T>(schema: ZodType<T>, source: Source = 'body') =>
    (req: Request, _res: Response, next: NextFunction) => {
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        return next(
          new ValidationError(
            'Invalid request data',
            result.error.format()
          )
        );
      }

      req.validatedBody = result.data;
      next();
    };
