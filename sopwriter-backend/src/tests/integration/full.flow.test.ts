import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config_vars } from '../../config/env.js';
import Admin from '../../models/Admin.js';
import { mailService } from '../../di/container.js';
import { createApp } from '../../app.js';

let mongod: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  jest.spyOn(mailService, 'sendLeadConfirmation').mockResolvedValue(undefined);
  jest.spyOn(mailService, 'sendAdminNotification').mockResolvedValue(undefined);
  jest.spyOn(mailService, 'sendUserVerification').mockResolvedValue(undefined);

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

    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Full', email: 'full@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;

    const txRes = await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-F1' })
      .expect(201);

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

    expect(mailService.sendLeadConfirmation).toHaveBeenCalled();
    expect(mailService.sendAdminNotification).toHaveBeenCalled();
    expect(mailService.sendUserVerification).toHaveBeenCalled();
  });
});
