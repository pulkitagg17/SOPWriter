import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Admin from '../src/models/Admin.js';
import { config_vars } from '../src/config/env.js';
import { logger } from '../src/config/logger.js';

dotenv.config();

async function seedAdmin() {
    try {
        const uri = process.env.MONGO_URI || config_vars.mongoUri;
        logger.info('Connecting to DB...');
        await mongoose.connect(uri);

        const email = process.env.ADMIN_EMAIL || config_vars.admin.email;
        const password = process.env.ADMIN_PASSWORD || config_vars.admin.password;

        if (!email || !password) {
            logger.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD');
            process.exit(1);
        }

        // Delete ALL existing admins to ensure only one admin exists
        const deleteResult = await Admin.deleteMany({});
        if (deleteResult.deletedCount > 0) {
            logger.info(`Removed ${deleteResult.deletedCount} existing admin(s)`);
        }

        // Create new admin with current credentials
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);

        await Admin.create({
            email: email.toLowerCase(),
            passwordHash: hash,
            tokenVersion: 0
        });

        logger.info(`Admin created/updated: ${email}`);
        logger.info('Only this admin can now log in.');

    } catch (error) {
        logger.error({ err: error }, 'Error seeding admin');
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        logger.info('Disconnected');
    }
}

seedAdmin();
