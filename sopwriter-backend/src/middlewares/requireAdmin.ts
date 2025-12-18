import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config_vars } from '../config/env.js';
import Admin from '../models/Admin.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import mongoose from 'mongoose';

interface AdminTokenPayload {
  adminId: string;
  scope: 'admin';
  version: number;
  iat: number;
  exp: number;
}

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  let token: string | undefined;

  if (req.cookies?.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7).trim();
  }

  if (!token) {
    throw new AuthenticationError('Authentication required');
  }

  let payload: AdminTokenPayload;

  try {
    payload = jwt.verify(
      token,
      config_vars.jwt.secret
    ) as AdminTokenPayload;
  } catch {
    throw new AuthenticationError('Invalid or expired token');
  }

  if (payload.scope !== 'admin') {
    throw new AuthorizationError('Insufficient permissions');
  }

  const admin = await Admin.findById(
    new mongoose.Types.ObjectId(payload.adminId)
  );

  if (!admin) {
    throw new AuthenticationError('Admin not found');
  }

  if (admin.tokenVersion !== payload.version) {
    throw new AuthenticationError('Session invalidated. Please login again.');
  }

  (req as any).admin = {
    sub: admin._id.toString(),
    email: admin.email,
    role: 'admin',
  };

  next();
}
