import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPublicConfigData } from '../services/settings.service.js';

export const getPublicConfig = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await getPublicConfigData();
    res.json({ success: true, data });
  }
);
