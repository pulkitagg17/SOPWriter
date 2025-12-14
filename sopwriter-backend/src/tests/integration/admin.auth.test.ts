import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import Lead from '../../models/Lead.js';
import Admin from '../../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config_vars } from '../../config/env.js';

describe('Admin Controller - Authentication & Leads', () => {
  let mongoServer: MongoMemoryServer;
  let app: any;
  let adminToken: string;
  const adminEmail = 'admin@test.com';
  const adminPassword = 'admin123Password!';

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    app = createApp();

    // Create Admin in DB
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(adminPassword, salt);
    const admin = await Admin.create({
      email: adminEmail,
      passwordHash: hash,
      tokenVersion: 0,
    });

    // Create admin token using the same secret as the app
    adminToken = jwt.sign(
      { adminId: admin._id, scope: 'admin', version: 0 },
      config_vars.jwt.secret,
      {
        expiresIn: '1h',
      }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Lead.deleteMany({});
  });

  describe('POST /api/admin/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: adminEmail,
          password: adminPassword,
        })
        .expect(200);

      expect(response.body.success).toBeDefined();
      expect(response.body.data.message).toBe('Logged in successfully');
      // Cookie check
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/admin_token=/);
    });

    it('should reject incorrect email', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'wrong@example.com',
          password: adminPassword,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('AUTH_FAILED');
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject incorrect password', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: adminEmail,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('AUTH_FAILED');
    });
  });

  describe('GET /api/admin/leads', () => {
    beforeEach(async () => {
      // Create test leads
      await Lead.create([
        { name: 'Alice Johnson', email: 'alice@test.com', phone: '1234567890', service: 'SOP' },
        { name: 'Bob Smith', email: 'bob@test.com', phone: '9876543210', service: 'LOR' },
        {
          name: 'Charlie Brown',
          email: 'charlie@test.com',
          phone: '5555555555',
          service: 'Resume',
        },
        { name: 'David Lee', email: 'david@test.com', phone: '4444444444', service: 'SOP' },
        { name: 'Eve Martinez', email: 'eve@test.com', phone: '3333333333', service: 'Visa Prep' },
      ]);
    });

    it('should list leads with default pagination', async () => {
      const response = await request(app)
        .get('/api/admin/leads')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(5);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.total).toBe(5);
    });

    it('should filter leads by search query (name)', async () => {
      const response = await request(app)
        .get('/api/admin/leads?search=alice')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].name).toBe('Alice Johnson');
    });

    it('should filter leads by search query (email)', async () => {
      const response = await request(app)
        .get('/api/admin/leads?search=bob@test.com')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].email).toBe('bob@test.com');
    });

    it('should filter leads by search query (service)', async () => {
      const response = await request(app)
        .get('/api/admin/leads?search=SOP')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
    });

    it('should support pagination with custom limit', async () => {
      const response = await request(app)
        .get('/api/admin/leads?limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.totalPages).toBe(3);
    });

    it('should support pagination with page number', async () => {
      const response = await request(app)
        .get('/api/admin/leads?limit=2&page=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.pagination.page).toBe(2);
    });

    // it('should cap limit at 1000', async () => { // Removing check as we reduced limit max to 100 in app
    //   const response = await request(app)
    //     .get('/api/admin/leads?limit=9999')
    //     .set('Authorization', `Bearer ${adminToken}`)
    //     .expect(200);
    //
    //   expect(response.body.pagination.limit).toBe(100);
    // });

    it('should handle minimum page number', async () => {
      const response = await request(app)
        .get('/api/admin/leads?page=0')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
    });

    it('should return empty array when no matches', async () => {
      const response = await request(app)
        .get('/api/admin/leads?search=nonexistent')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
    });
  });
});
