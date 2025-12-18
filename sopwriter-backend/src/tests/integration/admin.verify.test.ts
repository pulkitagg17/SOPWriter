import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createApp } from '../../app.js';
import * as mailServiceModule from '../../services/mail.service.js';
import { logger } from '../../config/logger.js';
import { config_vars } from '../../config/env.js';
import Admin from '../../models/Admin.js';

let mongod: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    app = createApp();
  } catch (error) {
    logger.error({ err: error }, 'Failed to start MongoMemoryServer');
    throw error;
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Admin verify flow', () => {
  async function getAdminToken() {
    const email = `admin-${Date.now()}@test.com`;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password', salt);
    const admin = await Admin.create({
      email,
      passwordHash: hash,
      tokenVersion: 0,
    });
    return jwt.sign({ adminId: admin._id, scope: 'admin', version: 0 }, config_vars.jwt.secret, {
      expiresIn: '1h',
    });
  }

  it('verifies a transaction and notifies user', async () => {
    const mailSpy = jest
      .spyOn(mailServiceModule.mailService, 'sendUserVerification')
      .mockResolvedValue(undefined);

    // create lead and tx
    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Gina', email: 'g@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    const txRes = await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-V1' })
      .expect(201);
    const txId = txRes.body.data.transactionId;

    // verify as admin
    const token = await getAdminToken();
    const res = await request(app)
      .post(`/api/admin/transactions/${txId}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'VERIFY', note: 'Looks good' })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('VERIFIED');
    expect(mailSpy).toHaveBeenCalled();

    // fetch tx detail and assert status updated
    const txDetail = await request(app)
      .get(`/api/admin/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(txDetail.body.data.status).toBe('VERIFIED');
    expect(txDetail.body.data.verifiedBy).toBeDefined();

    mailSpy.mockRestore();
  });

  it('rejects a transaction and notifies user', async () => {
    const mailSpy = jest
      .spyOn(mailServiceModule.mailService, 'sendUserVerification')
      .mockResolvedValue(undefined);

    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Hank', email: 'h@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    const txRes = await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-R1' })
      .expect(201);
    const txId = txRes.body.data.transactionId;

    const token = await getAdminToken();
    const res = await request(app)
      .post(`/api/admin/transactions/${txId}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'REJECT', note: 'Invalid screenshot' })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('REJECTED');
    expect(mailSpy).toHaveBeenCalled();

    const txDetail = await request(app)
      .get(`/api/admin/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(txDetail.body.data.status).toBe('REJECTED');

    mailSpy.mockRestore();
  });

  it('returns 404 for missing transaction', async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .post(`/api/admin/transactions/000000000000000000000000/verify`)
      .set('Authorization', `Bearer ${token}`)
      .send({ action: 'VERIFY' })
      .expect(404);
    expect(res.body.code).toBe('TRANSACTION_NOT_FOUND');
  });
});
