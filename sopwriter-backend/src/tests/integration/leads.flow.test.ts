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

describe('POST /api/leads flow', () => {
  it('creates a lead and sends confirmation email', async () => {
    const spy = jest
      .spyOn(mailServiceModule.MailService.prototype, 'sendLeadConfirmation')
      .mockResolvedValue({ ok: true } as any);
    const payload = { name: 'Alice', email: 'alice@example.com', service: 'VISA_TOURIST' };
    const res = await request(app).post('/api/v1/leads').send(payload).expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.leadId).toBeDefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('dedupes identical lead within window and returns 200', async () => {
    const spy = jest
      .spyOn(mailServiceModule.MailService.prototype, 'sendLeadConfirmation')
      .mockResolvedValue({ ok: true } as any);
    const payload = { name: 'Bob', email: 'bob@example.com', service: 'VISA_TOURIST' };
    const r1 = await request(app).post('/api/v1/leads').send(payload).expect(201);
    const r2 = await request(app).post('/api/v1/leads').send(payload).expect(200);
    expect(r2.body.data.leadId).toEqual(r1.body.data.leadId);
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });

  it('rejects invalid payload', async () => {
    const res = await request(app).post('/api/v1/leads').send({ name: 'A' }).expect(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
