import type { Request, Response } from 'express';
import Service from '../models/Service.js';
import GlobalSettings from '../models/GlobalSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { ErrorCode } from '../constants/index.js';
import { cacheService } from '../services/cache.service.js';

// ========== SERVICES CRUD ==========

export const getAllServices = asyncHandler(async (_req: Request, res: Response) => {
  const services = await Service.find({}).sort({ category: 1, name: 1 }).lean();
  res.json(successResponse(services));
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { code, name, category, price, description, active } = req.body;

  const service = new Service({
    code,
    name,
    category,
    price,
    description,
    active: active !== undefined ? active : true,
  });

  try {
    await service.save();
    // Invalidate cache when service is created
    cacheService.invalidate('public-config');
    res.status(201).json(successResponse(service));
  } catch (error: any) {
    if (error.code === 11000) {
      res
        .status(400)
        .json(errorResponse(ErrorCode.DUPLICATE_SERVICE, 'Service code already exists'));
      return;
    }
    throw error;
  }
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, price, description, active } = req.body;

  const service = await Service.findByIdAndUpdate(
    id,
    { name, category, price, description, active },
    { new: true, runValidators: true }
  );

  if (!service) {
    res.status(404).json(errorResponse(ErrorCode.SERVICE_NOT_FOUND, 'Service not found'));
    return;
  }

  // Invalidate cache when service is updated
  cacheService.invalidate('public-config');
  res.json(successResponse(service));
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await Service.findByIdAndDelete(id);

  if (!service) {
    res.status(404).json(errorResponse(ErrorCode.SERVICE_NOT_FOUND, 'Service not found'));
    return;
  }

  // Invalidate cache when service is deleted
  cacheService.invalidate('public-config');
  res.json(successResponse({ message: 'Service deleted' }));
});

// ========== SETTINGS CRUD ==========

export const getAllSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await GlobalSettings.find({}).lean();
  res.json(successResponse(settings));
});

export const updateSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const { value, description } = req.body;

  const setting = await GlobalSettings.findOneAndUpdate(
    { key },
    { value, description },
    { new: true, upsert: true, runValidators: true }
  );

  // Invalidate cache when setting is updated
  cacheService.invalidate('public-config');
  res.json(successResponse(setting));
});

export const deleteSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;

  const setting = await GlobalSettings.findOneAndDelete({ key });

  if (!setting) {
    res.status(404).json(errorResponse(ErrorCode.SETTING_NOT_FOUND, 'Setting not found'));
    return;
  }

  // Invalidate cache when setting is deleted
  cacheService.invalidate('public-config');
  res.json(successResponse({ message: 'Setting deleted' }));
});
