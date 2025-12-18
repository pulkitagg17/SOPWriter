import Service from '../models/Service.js';
import GlobalSettings from '../models/GlobalSettings.js';
import { config_vars } from '../config/env.js';
import { ServiceCategory } from '../constants/index.js';
import { DuplicateError } from '../utils/errors.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service-related operations
 */
export async function getAllServices() {
    return Service.find({}).sort({ category: 1, name: 1 }).lean();
}

export async function createService(data: any) {
    try {
        return await Service.create({
            code: data.code,
            name: data.name,
            category: data.category,
            price: data.price,
            description: data.description,
            active: data.active ?? true,
        });
    }
    catch (err: any) {
        if (err.code == 11000) {
            throw new DuplicateError('Service', 'code');
        }
        if (err.name === 'ValidationError') {
            throw new ValidationError(err.message);
        }
        throw err;
    }
}

export async function updateService(id: string, data: any) {
    return Service.findByIdAndUpdate(
        id,
        {
            name: data.name,
            category: data.category,
            price: data.price,
            description: data.description,
            active: data.active,
        },
        { new: true, runValidators: true }
    );
}

export async function deleteService(id: string) {
    return Service.findByIdAndDelete(id);
}

export async function bulkUpdateServices(active: boolean) {
    return Service.updateMany({}, { active });
}

export async function getActiveServices() {
    return Service.find({ active: true }).lean();
}

/**
 * Global Settings related operations
 */
export async function getAllSettings() {
    return GlobalSettings.find({}).lean();
}

export async function updateSetting(key: string, value: string, description?: string) {
    return GlobalSettings.findOneAndUpdate(
        { key },
        { value, description },
        { new: true, upsert: true, runValidators: true }
    );
}

export async function deleteSetting(key: string) {
    return GlobalSettings.findOneAndDelete({ key });
}

export async function getPublicConfigData() {
    const services = await getActiveServices();
    const settings = await getAllSettings();

    const settingsMap = Object.fromEntries(
        settings.map((s) => [s.key, s.value])
    );

    // Initialize categories with empty arrays
    const catMap: Record<string, any[]> = {
        [ServiceCategory.DOCUMENTS]: [],
        [ServiceCategory.PROFILE]: [],
        [ServiceCategory.VISA]: [],
    };

    for (const svc of services) {
        if (!catMap[svc.category]) {
            // Handle unknown categories dynamically or ignore
            catMap[svc.category] = [];
        }
        catMap[svc.category].push({
            name: svc.name,
            price: svc.price,
            description: svc.description || '',
        });
    }

    const categories = Object.entries(catMap).map(([key, services]) => ({
        key,
        services
    }));

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
        categories,
    };
}
