import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../../app.js';
import * as mailServiceModule from '../../services/mail.service.js';

let mongod: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    process.env.APP_BASE_URL = 'http://test.app';
    app = createApp();
  } catch (error) {
    console.error('Failed to start MongoMemoryServer', error);
    throw error;
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
});

afterEach(async () => {
  // clear collections
  const { collections } = mongoose.connection;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('POST /api/leads/:leadId/transactions', () => {
  it('creates a transaction and notifies admin', async () => {
    const spyAdmin = jest
      .spyOn(mailServiceModule.MailService.prototype, 'sendAdminNotification')
      .mockResolvedValue({ ok: true } as any);
    // create a lead first
    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Charlie', email: 'c@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;

    const payload = {
      transactionId: 'TX-999',
      amount: 1000,
      method: 'UPI',
      remark: 'paid via upi',
    };
    const res = await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send(payload)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transactionId).toBeDefined();
    expect(spyAdmin).toHaveBeenCalled();

    spyAdmin.mockRestore();
  });

  it('returns 404 if lead not found', async () => {
    const res = await request(app)
      .post(`/api/v1/leads/000000000000000000000000/transactions`)
      .send({ transactionId: 'X' })
      .expect(404);
    expect(res.body.code).toBe('LEAD_NOT_FOUND');
  });

  it('rejects invalid payload', async () => {
    // invalid: missing transactionId
    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Dana', email: 'd@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    const res = await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send({ amount: -5 })
      .expect(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
