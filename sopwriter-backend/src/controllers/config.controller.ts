import { Request, Response, NextFunction } from 'express';
import Service from '../models/Service.js';
import GlobalSettings from '../models/GlobalSettings.js';

export const getPublicConfig = async (_req: Request, res: Response, next: NextFunction) => {
  try {
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
    // Group services by category
    const categoryMap: Record<string, any[]> = {
      documents: [],
      profile: [],
      visa: [],
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
    const config = {
      contact: {
        phone: settingsMap['contact_phone'] || process.env.DEFAULT_CONTACT_PHONE || '+1234567890',
        whatsapp: settingsMap['contact_whatsapp'] || process.env.DEFAULT_WHATSAPP || '1234567890',
        email:
          settingsMap['contact_email'] || process.env.DEFAULT_CONTACT_EMAIL || 'info@example.com',
        supportEmail:
          settingsMap['support_email'] ||
          process.env.DEFAULT_SUPPORT_EMAIL ||
          'support@example.com',
      },
      payment: {
        upiId: settingsMap['payment_upi_id'] || process.env.DEFAULT_UPI_ID || 'example@upi',
        upiQrImage: settingsMap['payment_qr_image'] || process.env.DEFAULT_QR_IMAGE || '/qr.jpg',
      },
      categories: [
        {
          key: 'documents',
          label: 'Application Documents',
          description: 'SOP, LOR, Essays, Research',
          services: categoryMap['documents'],
        },
        {
          key: 'profile',
          label: 'Profile Building',
          description: 'Resume, Interview Prep',
          services: categoryMap['profile'],
        },
        {
          key: 'visa',
          label: 'Visa Preparation',
          description: 'USA Visa, Australia GTE',
          services: categoryMap['visa'],
        },
      ],
    };

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};
