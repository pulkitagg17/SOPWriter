import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

let mongod: MongoMemoryServer;
let app: any;
let mongooseInstance: typeof mongoose;

beforeAll(async () => {
  jest.resetModules(); // Ensure rateLimiter re-reads env vars
  mongod = await MongoMemoryServer.create();
  process.env.RATE_LIMIT_WINDOW_MS = '60000';
  process.env.RATE_LIMIT_MAX_LEADS = '3';

  // Dynamic import of everything needed after reset
  const mongooseMod = await import('mongoose');
  mongooseInstance = mongooseMod.default;
  await mongooseInstance.connect(mongod.getUri());

  const { createApp } = await import('../../app.js');
  app = createApp();
});

afterAll(async () => {
  if (mongooseInstance) await mongooseInstance.disconnect();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const k in collections) await collections[k].deleteMany({});
});

describe('rate limiting', () => {
  it('limits POST /api/leads after threshold', async () => {
    for (let i = 0; i < 3; i++) {
      // Need to wait slightly to ensure Express rate limit middleware processes requests separately if needed,
      // but typically it's fast enough.
      await request(app)
        .post('/api/v1/leads')
        .send({ name: `R${i}`, email: `r${i}@t.com`, service: 'VISA_TOURIST' })
        .expect(201);
    }
    const res = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'R4', email: 'r4@t.com', service: 'VISA_TOURIST' })
      .expect(429);
    expect(res.body.code).toBe('RATE_LIMIT');
  });
});
