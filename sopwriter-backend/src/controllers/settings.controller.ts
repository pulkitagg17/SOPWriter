import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as settingsService from '../services/settings.service.js';

/**
 * =========================
 * SERVICES (ADMIN)
 * =========================
 */

export const getAllServices = asyncHandler(async (_req: Request, res: Response) => {
  const services = await settingsService.getAllServices();
  res.json({ success: true, data: services });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  try {
    const service = await settingsService.createService(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ success: false, code: 'DUPLICATE_SERVICE', message: 'Service code already exists' });
      return;
    }
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: err.message });
      return;
    }
    throw err;
  }
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const service = await settingsService.updateService(req.params.id, req.body);

  if (!service) {
    res.status(404).json({ success: false, code: 'SERVICE_NOT_FOUND', message: 'Service not found' });
    return;
  }

  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const service = await settingsService.deleteService(req.params.id);

  if (!service) {
    res.status(404).json({ success: false, code: 'SERVICE_NOT_FOUND', message: 'Service not found' });
    return;
  }

  res.json({ success: true, message: 'Service deleted' });
});

export const bulkUpdateServices = asyncHandler(async (req: Request, res: Response) => {
  const { active } = req.body;

  if (typeof active !== 'boolean') {
    res.status(400).json({ success: false, message: 'Active status is required' });
    return;
  }

  await settingsService.bulkUpdateServices(active);

  res.json({
    success: true,
    message: `All services ${active ? 'enabled' : 'disabled'}`,
  });
});

/**
 * =========================
 * GLOBAL SETTINGS (ADMIN)
 * =========================
 */

export const getAllSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await settingsService.getAllSettings();
  res.json({ success: true, data: settings });
});

export const updateSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const { value, description } = req.body;

  const setting = await settingsService.updateSetting(key, value, description);
  res.json({ success: true, data: setting });
});

export const deleteSetting = asyncHandler(async (req: Request, res: Response) => {
  const setting = await settingsService.deleteSetting(req.params.key);

  if (!setting) {
    res.status(404).json({ success: false, code: 'SETTING_NOT_FOUND', message: 'Setting not found' });
    return;
  }

  res.json({ success: true, message: 'Setting deleted' });
});
