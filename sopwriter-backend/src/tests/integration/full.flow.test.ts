import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../../app.js';
import * as mailModule from '../../services/mail.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config_vars } from '../../config/env.js';
import Admin from '../../models/Admin.js';

let mongod: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const k in collections) await collections[k].deleteMany({});
});

describe('full integration flow', () => {
  it('lead -> declare -> admin verify', async () => {
    // Spying
    const leadSpy = jest
      .spyOn(mailModule.MailService.prototype, 'sendLeadConfirmation')
      .mockResolvedValue({ ok: true } as any);
    const adminSpy = jest
      .spyOn(mailModule.MailService.prototype, 'sendAdminNotification')
      .mockResolvedValue({ ok: true } as any);
    const userVerifySpy = jest
      .spyOn(mailModule.MailService.prototype, 'sendUserVerification')
      .mockResolvedValue({ ok: true } as any);

    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Full', email: 'full@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    expect(leadSpy).toHaveBeenCalled();

    const txRes = await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-F1' })
      .expect(200);
    expect(adminSpy).toHaveBeenCalled();
    const txId = txRes.body.data.transactionId;

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    const admin = await Admin.create({
      email: 'admin@flow.com',
      passwordHash: hash,
      tokenVersion: 0,
    });

    const token = jwt.sign(
      { adminId: admin._id, scope: 'admin', version: 0 },
      config_vars.jwt.secret,
      {
        expiresIn: '1h',
      }
    );

    const verifyRes = await request(app)
      .post(`/api/admin/transactions/${txId}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'VERIFY', note: 'ok' })
      .expect(200);
    expect(verifyRes.body.data.status).toBe('VERIFIED');
    expect(userVerifySpy).toHaveBeenCalled();

    leadSpy.mockRestore();
    adminSpy.mockRestore();
    userVerifySpy.mockRestore();
  });
});
