import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../src/models/Service.js';
import GlobalSettings from '../src/models/GlobalSettings.js';

import { config_vars } from '../src/config/env.js';
import { logger } from '../src/config/logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || config_vars.mongoUri;

const SERVICES = [
    // Documents
    { code: 'SOP', category: 'documents', name: 'Statement of Purpose (SOP)', price: 2499, description: 'Personalized SOPs crafted to clearly present your academic background, goals, and motivation, aligned with the expectations of your target university and program.' },
    { code: 'LOR', category: 'documents', name: 'Letter of Recommendation (LOR)', price: 1499, description: 'Professionally written LOR content highlighting your strengths, achievements, and suitability, structured to match international academic standards.' },
    { code: 'MOTIVATION', category: 'documents', name: 'Motivation Letter', price: 1999, description: 'A focused and compelling motivation letter explaining your intent, interests, and future plans, tailored for universities, scholarships, or visa applications.' },
    { code: 'RES_PROP', category: 'documents', name: 'Research Proposal', price: 3499, description: 'Detailed and academically sound research proposals outlining objectives, methodology, and expected outcomes, aligned with faculty and program requirements.' },
    { code: 'UNI_ESSAY', category: 'documents', name: 'University Essays', price: 1299, description: 'Well-structured essays addressing specific university prompts, ensuring clarity, originality, and relevance to the institution’s values.' },
    { code: 'THESIS', category: 'documents', name: 'Thesis Writing', price: 9999, description: 'Structured assistance for theses and academic projects, including problem formulation, literature review, methodology, and formal presentation.' },
    { code: 'RES_PAPER', category: 'documents', name: 'Research Paper Support', price: 4999, description: 'Guidance and editorial support for drafting, refining, and structuring research papers according to academic and publication standards.' },

    // Profile
    { code: 'RESUME', category: 'profile', name: 'Resume Upgrade', price: 1499, description: 'Professionally optimized resumes tailored for academic admissions, research roles, or international job applications.' },
    { code: 'PROFILE_CONSULT', category: 'profile', name: 'Profile Building Consultation', price: 999, description: 'One-on-one expert guidance to strengthen your academic and professional profile, including document strategy and application positioning.' },
    { code: 'INTERVIEW', category: 'profile', name: 'Interview Preparation', price: 1999, description: 'Personalized interview preparation sessions focusing on clarity, confidence, and relevant questioning for university or academic interviews.' },

    // Visa
    { code: 'VISA_USA', category: 'visa', name: 'USA Visa Interview Prep', price: 2999, description: 'Structured mock interviews and guidance based on real visa interview scenarios, focusing on clarity, confidence, and compliance.' },
    { code: 'VISA_AUS_GTE', category: 'visa', name: 'Australia GTE Preparation', price: 2999, description: 'Targeted assistance for Genuine Temporary Entrant (GTE) documentation and interview preparation in line with Australian immigration requirements.' },
];

const SETTINGS = [
    { key: 'contact_phone', value: '+1234567890', description: 'Main support phone number' },
    { key: 'contact_whatsapp', value: '1234567890', description: 'WhatsApp number (without +)' },
    { key: 'contact_email', value: 'info@example.com', description: 'General inquiry email' },
    { key: 'support_email', value: 'support@example.com', description: 'Support email for payments' },
    { key: 'payment_upi_id', value: 'example@upi', description: 'UPI ID for payments' },
    { key: 'payment_qr_image', value: '/qr.jpg', description: 'Path to QR code image (relative to public)' },
];

async function seed() {
    logger.info({ uri: MONGO_URI }, 'Connecting to DB');
    await mongoose.connect(MONGO_URI, {});
    try {
        // Seed Services
        logger.info('Seeding Services...');
        // Clear existing services to ensure clean state with new schema
        await Service.deleteMany({});
        logger.info('Cleared existing services.');

        for (const s of SERVICES) {
            const doc = new Service(s);
            await doc.save();
            logger.info(`Seeded service ${s.code}`);
        }

        // Seed Settings
        logger.info('Seeding Settings...');
        for (const s of SETTINGS) {
            await GlobalSettings.findOneAndUpdate(
                { key: s.key },
                { $set: s },
                { upsert: true, new: true }
            );
            logger.info(`Seeded setting ${s.key}`);
        }

    } catch (err) {
        logger.error({ err }, 'Seed error');
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        logger.info('Disconnected');
    }
}

// Check if running directly (ESM compatible check)
// In TS with ESM, require.main is not available.
// We can just run seed() since this is intended as a script.
seed();
