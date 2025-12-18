import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createApp } from '../../app.js';
import { config_vars } from '../../config/env.js';
import Admin from '../../models/Admin.js';

let mongod: MongoMemoryServer;
let app: any;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = createApp();
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

describe('Admin transactions endpoints', () => {
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

  it('rejects unauthenticated requests', async () => {
    await request(app).get('/api/admin/transactions').expect(401);
  });

  it('returns empty list initially when authenticated', async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .get('/api/admin/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toBeDefined();
    expect(res.body.data.items).toHaveLength(0);
  });

  it('lists declared transactions', async () => {
    const token = await getAdminToken();
    // create lead + transaction
    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Eve', email: 'e@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-1' })
      .expect(201);

    const res = await request(app)
      .get('/api/admin/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.items.length).toBe(1);
    const item = res.body.data.items[0];
    expect(item.status).toBe('DECLARED');
    expect(item.leadId).toBeDefined();
    expect(item.leadId.name).toBe('Eve');
  });

  it('can fetch transaction detail', async () => {
    const token = await getAdminToken();
    const leadRes = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'Frank', email: 'f@example.com', service: 'VISA_TOURIST' })
      .expect(201);
    const leadId = leadRes.body.data.leadId;
    const txRes = await request(app)
      .post(`/api/v1/leads/${leadId}/transactions`)
      .send({ transactionId: 'TX-2' })
      .expect(201);
    const txId = txRes.body.data.transactionId;
    const res = await request(app)
      .get(`/api/admin/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data._id).toBe(txId);
    expect(res.body.data.status).toBe('DECLARED');
    expect(res.body.data.leadId).toBeDefined();
  });
});
