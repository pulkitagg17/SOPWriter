import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import Service from '../../models/Service.js';
import GlobalSettings from '../../models/GlobalSettings.js';
import jwt from 'jsonwebtoken';

describe('Settings Controller - Admin Settings Management', () => {
  let mongoServer: MongoMemoryServer;
  let adminToken: string;
  let app: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    app = createApp();

    // Create admin token
    const secret = process.env.JWT_SECRET || 'test-secret';
    adminToken = jwt.sign({ sub: 'admin', role: 'admin', email: 'admin@test.com' }, secret, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Service.deleteMany({});
    await GlobalSettings.deleteMany({});
  });

  describe('Service Management', () => {
    describe('GET /api/admin/services', () => {
      it('should require authentication', async () => {
        await request(app).get('/api/admin/services').expect(401);
      });

      it('should return all services when authenticated', async () => {
        await Service.create([
          {
            code: 'SOP',
            name: 'Statement of Purpose',
            category: 'documents',
            price: 3999,
            description: 'Professional SOP',
            active: true,
          },
          {
            code: 'LOR',
            name: 'Letter of Recommendation',
            category: 'documents',
            price: 2499,
            active: false,
          },
        ]);

        const response = await request(app)
          .get('/api/admin/services')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0]).toHaveProperty('code');
        expect(response.body.data[0]).toHaveProperty('name');
        expect(response.body.data[0]).toHaveProperty('price');
      });

      it('should return services sorted by category and name', async () => {
        await Service.create([
          { code: 'VISA', name: 'Z Service', category: 'visa', price: 1000, active: true },
          { code: 'DOC', name: 'A Service', category: 'documents', price: 2000, active: true },
          { code: 'PROF', name: 'B Service', category: 'profile', price: 1500, active: true },
        ]);

        const response = await request(app)
          .get('/api/admin/services')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.data[0].category).toBe('documents');
      });
    });

    describe('POST /api/admin/services', () => {
      it('should require authentication', async () => {
        await request(app)
          .post('/api/admin/services')
          .send({ code: 'TEST', name: 'Test Service', category: 'documents', price: 1000 })
          .expect(401);
      });

      it('should create a new service', async () => {
        const response = await request(app)
          .post('/api/admin/services')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            code: 'NEW_SOP',
            name: 'New Statement of Purpose',
            category: 'documents',
            price: 4999,
            description: 'Updated SOP service',
            active: true,
          })
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.code).toBe('NEW_SOP');
        expect(response.body.data.price).toBe(4999);

        // Verify in database
        const service = await Service.findOne({ code: 'NEW_SOP' });
        expect(service).toBeTruthy();
        expect(service!.name).toBe('New Statement of Purpose');
      });

      it('should set active=true by default', async () => {
        const response = await request(app)
          .post('/api/admin/services')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            code: 'TEST',
            name: 'Test',
            category: 'documents',
            price: 1000,
          })
          .expect(201);

        expect(response.body.data.active).toBe(true);
      });

      it('should reject duplicate service codes', async () => {
        await Service.create({
          code: 'SOP',
          name: 'Original SOP',
          category: 'documents',
          price: 3999,
          active: true,
        });

        const response = await request(app)
          .post('/api/admin/services')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            code: 'SOP',
            name: 'Duplicate SOP',
            category: 'documents',
            price: 5000,
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('DUPLICATE_SERVICE');
      });

      it('should validate category enum', async () => {
        const response = await request(app)
          .post('/api/admin/services')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            code: 'INVALID',
            name: 'Invalid Category',
            category: 'invalid_category',
            price: 1000,
          })
          .expect(400); // Validation errors return 400, not 500

        expect(response.body.success).toBe(false);
      });
    });

    describe('PUT /api/admin/services/:id', () => {
      it('should require authentication', async () => {
        const service = await Service.create({
          code: 'SOP',
          name: 'SOP',
          category: 'documents',
          price: 3999,
          active: true,
        });

        await request(app)
          .put(`/api/admin/services/${service._id}`)
          .send({ price: 5000 })
          .expect(401);
      });

      it('should update service details', async () => {
        const service = await Service.create({
          code: 'SOP',
          name: 'Old Statement of Purpose',
          category: 'documents',
          price: 3999,
          description: 'Old description',
          active: true,
        });

        const response = await request(app)
          .put(`/api/admin/services/${service._id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'New Statement of Purpose',
            category: 'documents',
            price: 4999,
            description: 'Updated description',
            active: false,
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('New Statement of Purpose');
        expect(response.body.data.price).toBe(4999);
        expect(response.body.data.active).toBe(false);
      });

      it('should return 404 for non-existent service', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .put(`/api/admin/services/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ price: 5000 })
          .expect(404);

        expect(response.body.code).toBe('SERVICE_NOT_FOUND');
      });
    });

    describe('DELETE /api/admin/services/:id', () => {
      it('should require authentication', async () => {
        const service = await Service.create({
          code: 'SOP',
          name: 'SOP',
          category: 'documents',
          price: 3999,
          active: true,
        });

        await request(app).delete(`/api/admin/services/${service._id}`).expect(401);
      });

      it('should delete a service', async () => {
        const service = await Service.create({
          code: 'DELETE_ME',
          name: 'Service to Delete',
          category: 'documents',
          price: 1000,
          active: true,
        });

        const response = await request(app)
          .delete(`/api/admin/services/${service._id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);

        // Verify deletion
        const deletedService = await Service.findById(service._id);
        expect(deletedService).toBeNull();
      });

      it('should return 404 for non-existent service', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .delete(`/api/admin/services/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);

        expect(response.body.code).toBe('SERVICE_NOT_FOUND');
      });
    });
  });

  describe('Settings Management', () => {
    describe('GET /api/admin/settings', () => {
      it('should require authentication', async () => {
        await request(app).get('/api/admin/settings').expect(401);
      });

      it('should return all settings', async () => {
        await GlobalSettings.create([
          { key: 'contact_phone', value: '+91 98765 43210', type: 'contact' },
          { key: 'payment_upi_id', value: '919871160227@upi', type: 'payment' },
        ]);

        const response = await request(app)
          .get('/api/admin/settings')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });
    });

    describe('PUT /api/admin/settings/:key', () => {
      it('should require authentication', async () => {
        await request(app)
          .put('/api/admin/settings/contact_phone')
          .send({ value: 'test' })
          .expect(401);
      });

      it('should update existing setting', async () => {
        await GlobalSettings.create({
          key: 'contact_phone',
          value: '+91 11111 11111',
          type: 'contact',
        });

        const response = await request(app)
          .put('/api/admin/settings/contact_phone')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            value: '+91 98765 43210',
            description: 'Updated phone number',
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.value).toBe('+91 98765 43210');
        expect(response.body.data.description).toBe('Updated phone number');
      });

      it('should create new setting if not exists (upsert)', async () => {
        const response = await request(app)
          .put('/api/admin/settings/new_setting')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            value: 'new value',
            description: 'New setting description',
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.key).toBe('new_setting');
        expect(response.body.data.value).toBe('new value');

        // Verify in database
        const setting = await GlobalSettings.findOne({ key: 'new_setting' });
        expect(setting).toBeTruthy();
      });
    });

    describe('DELETE /api/admin/settings/:key', () => {
      it('should require authentication', async () => {
        await request(app).delete('/api/admin/settings/test_key').expect(401);
      });

      it('should delete a setting', async () => {
        await GlobalSettings.create({
          key: 'delete_me',
          value: 'to be deleted',
          type: 'test',
        });

        const response = await request(app)
          .delete('/api/admin/settings/delete_me')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);

        // Verify deletion
        const setting = await GlobalSettings.findOne({ key: 'delete_me' });
        expect(setting).toBeNull();
      });

      it('should return 404 for non-existent setting', async () => {
        const response = await request(app)
          .delete('/api/admin/settings/non_existent')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);

        expect(response.body.code).toBe('SETTING_NOT_FOUND');
      });
    });
  });
});
