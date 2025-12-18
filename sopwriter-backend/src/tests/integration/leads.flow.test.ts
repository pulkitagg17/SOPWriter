import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../../app.js';
import { mailService } from '../../di/container.js';
import { logger } from '../../config/logger.js';

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
    logger.error({ err: error }, 'Failed to start MongoMemoryServer');
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
      .spyOn(mailService, 'sendLeadConfirmation')
      .mockResolvedValue(undefined);
    const payload = { name: 'Alice', email: 'alice@example.com', service: 'VISA_TOURIST' };
    const res = await request(app).post('/api/v1/leads').send(payload).expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.leadId).toBeDefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('dedupes identical lead within window and returns 200', async () => {
    const spy = jest
      .spyOn(mailService, 'sendLeadConfirmation')
      .mockResolvedValue(undefined);
    const payload = { name: 'Bob', email: 'bob@example.com', service: 'VISA_TOURIST' };
    const r1 = await request(app).post('/api/v1/leads').send(payload).expect(201);
    const r2 = await request(app).post('/api/v1/leads').send(payload).expect(200);
    expect(r2.body.data.leadId).toEqual(r1.body.data.leadId);
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  it('rejects invalid payload', async () => {
    const res = await request(app).post('/api/v1/leads').send({ name: 'A' }).expect(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
