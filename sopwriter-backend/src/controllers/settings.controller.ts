import type { Request, Response, NextFunction } from 'express';
import Service from '../models/Service.js';
import GlobalSettings from '../models/GlobalSettings.js';

// ========== SERVICES CRUD ==========

export const getAllServices = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await Service.find({}).sort({ category: 1, name: 1 }).lean();
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, name, category, price, description, active } = req.body;

    const service = new Service({
      code,
      name,
      category,
      price,
      description,
      active: active !== undefined ? active : true,
    });

    await service.save();
    res.status(201).json({ success: true, data: service });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        code: 'DUPLICATE_SERVICE',
        message: 'Service code already exists',
      });
      return;
    }
    next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, price, description, active } = req.body;

    const service = await Service.findByIdAndUpdate(
      id,
      { name, category, price, description, active },
      { new: true, runValidators: true }
    );

    if (!service) {
      res.status(404).json({
        success: false,
        code: 'SERVICE_NOT_FOUND',
        message: 'Service not found',
      });
      return;
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      res.status(404).json({
        success: false,
        code: 'SERVICE_NOT_FOUND',
        message: 'Service not found',
      });
      return;
    }

    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};

// ========== SETTINGS CRUD ==========

export const getAllSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await GlobalSettings.find({}).lean();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    const setting = await GlobalSettings.findOneAndUpdate(
      { key },
      { value, description },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
};

export const deleteSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { key } = req.params;

    const setting = await GlobalSettings.findOneAndDelete({ key });

    if (!setting) {
      res.status(404).json({
        success: false,
        code: 'SETTING_NOT_FOUND',
        message: 'Setting not found',
      });
      return;
    }

    res.json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    next(error);
  }
};
