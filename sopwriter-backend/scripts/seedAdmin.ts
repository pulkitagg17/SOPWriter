import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Admin from '../src/models/Admin.js';
import { config_vars } from '../src/config/env.js';

dotenv.config();

async function seedAdmin() {
    try {
        const uri = process.env.MONGO_URI || config_vars.mongoUri;
        console.log('Connecting to DB...');
        await mongoose.connect(uri);

        const email = process.env.ADMIN_EMAIL || config_vars.admin.email;
        const password = process.env.ADMIN_PASSWORD || config_vars.admin.password;

        if (!email || !password) {
            console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD');
            process.exit(1);
        }

        // Delete ALL existing admins to ensure only one admin exists
        const deleteResult = await Admin.deleteMany({});
        if (deleteResult.deletedCount > 0) {
            console.log(`Removed ${deleteResult.deletedCount} existing admin(s)`);
        }

        // Create new admin with current credentials
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);

        await Admin.create({
            email: email.toLowerCase(),
            passwordHash: hash,
            tokenVersion: 0
        });

        console.log(`Admin created/updated: ${email}`);
        console.log('Only this admin can now log in.');

    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

seedAdmin();
