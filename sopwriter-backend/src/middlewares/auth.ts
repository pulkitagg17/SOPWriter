import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config_vars } from '../config/env.js';
import { ErrorCode } from '../constants/index.js';
import { errorResponse } from '../utils/responses.js';
import Admin from '../models/Admin.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

export interface AdminTokenPayload {
  adminId: string;
  scope: string;
  version: number;
  iat?: number;
  exp?: number;
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.['admin_token'];

    // Allow Bearer fallback or primarily use cookie?
    // Requirement 9: "no localStorage usage". Implies frontend uses cookies.
    // But for API testing/flexibility, we can support Bearer too if cookie is missing.
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.slice('Bearer '.length).trim();
    }

    if (!token) {
      throw new AuthenticationError('Authentication required');
    }

    let payload: AdminTokenPayload;
    try {
      payload = jwt.verify(token, config_vars.jwt.secret) as AdminTokenPayload;
    } catch (err) {
      throw new AuthenticationError('Invalid or expired token');
    }

    if (payload.scope !== 'admin') {
      throw new AuthorizationError('Insufficient permissions');
    }

    // Verify version/session against DB for "Strict Invalidation"
    const admin = await Admin.findById(payload.adminId);
    if (!admin) {
      throw new AuthenticationError('Admin not found');
    }

    if (admin.tokenVersion !== payload.version) {
      throw new AuthenticationError('Session invalidated. Please login again.');
    }

    // attach admin info
    (req as any).admin = { sub: admin._id, ...payload };
    next();
  } catch (err: any) {
    if (err instanceof AuthenticationError || err instanceof AuthorizationError) {
      res
        .status(err.statusCode)
        .json(errorResponse(err.code || ErrorCode.AUTH_INVALID, err.message));
      return;
    }
    // Handle async errors or db errors
    res.status(500).json(errorResponse(ErrorCode.INTERNAL_ERROR, 'Internal Server Error'));
    return;
  }
}
