import { Request, Response } from 'express';
import Service from '../models/Service.js';
import GlobalSettings from '../models/GlobalSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responses.js';
import { config_vars } from '../config/env.js';
import { ServiceCategory } from '../constants/index.js';
import { cacheService } from '../services/cache.service.js';

export const getPublicConfig = asyncHandler(async (_req: Request, res: Response) => {
  const config = await cacheService.getOrSet(
    'public-config',
    async () => {
      // 1. Fetch Services
      const services = await Service.find({ active: true }).lean();

      // 2. Fetch Settings
      const settings = await GlobalSettings.find({}).lean();
      const settingsMap = settings.reduce(
        (acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        },
        {} as Record<string, string>
      );

      // 3. Construct Categories
      const categoryMap: Record<string, any[]> = {
        [ServiceCategory.DOCUMENTS]: [],
        [ServiceCategory.PROFILE]: [],
        [ServiceCategory.VISA]: [],
      };

      services.forEach((svc) => {
        if (categoryMap[svc.category]) {
          categoryMap[svc.category].push({
            name: svc.name,
            price: svc.price,
            description: svc.description || '',
          });
        }
      });

      // 4. Construct Final Config Response
      return {
        contact: {
          phone: settingsMap['contact_phone'] || config_vars.defaults.contactPhone,
          whatsapp: settingsMap['contact_whatsapp'] || config_vars.defaults.whatsapp,
          email: settingsMap['contact_email'] || config_vars.defaults.contactEmail,
          supportEmail: settingsMap['support_email'] || config_vars.defaults.supportEmail,
        },
        payment: {
          upiId: settingsMap['payment_upi_id'] || config_vars.defaults.upiId,
          upiQrImage: settingsMap['payment_qr_image'] || config_vars.defaults.qrImage,
        },
        categories: [
          {
            key: ServiceCategory.DOCUMENTS,
            label: 'Application Documents',
            description: 'SOP, LOR, Essays, Article',
            services: categoryMap[ServiceCategory.DOCUMENTS],
          },
          {
            key: ServiceCategory.PROFILE,
            label: 'Profile Building',
            description: 'Resume, Interview Prep',
            services: categoryMap[ServiceCategory.PROFILE],
          },
          {
            key: ServiceCategory.VISA,
            label: 'Visa Preparation',
            description: 'USA Visa, Australia GTE',
            services: categoryMap[ServiceCategory.VISA],
          },
        ],
      };
    },
    300 // Cache for 5 minutes
  );

  res.status(200).json(successResponse(config));
});
