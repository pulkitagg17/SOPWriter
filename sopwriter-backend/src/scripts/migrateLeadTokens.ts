import mongoose from 'mongoose';
import crypto from 'crypto';
import Lead from '../models/Lead.js';
import { config_vars } from '../config/env.js';
import { logger } from '../config/logger.js'; // Assuming logger exists

async function migrate() {
    try {
        logger.info('Starting Lead Access Token Migration...');

        await mongoose.connect(config_vars.mongoUri);
        logger.info('Connected to MongoDB');

        // Find leads where accessToken is missing
        const leads = await Lead.find({ accessToken: { $exists: false } });
        logger.info(`Found ${leads.length} leads without access tokens`);

        let updated = 0;
        for (const lead of leads) {
            // Direct update to ensure we don't trigger other hooks or validation unnecessary
            // But save() is safer for schema defaults.
            // Note: accessToken is select: false, so it wouldn't be in 'leads' anyway unless selected.
            // safely update
            const token = crypto.randomBytes(32).toString('hex');
            await Lead.updateOne({ _id: lead._id }, { $set: { accessToken: token } });
            updated++;
        }

        logger.info(`Successfully passed tokens to ${updated} leads.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
