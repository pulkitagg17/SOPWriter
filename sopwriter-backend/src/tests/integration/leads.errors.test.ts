import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import Lead from '../../models/Lead.js';

describe('Leads Controller - Additional Coverage', () => {
  let mongoServer: MongoMemoryServer;
  let app: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    app = createApp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Lead.deleteMany({});
  });

  describe('POST /api/leads - Error Handling', () => {
    it('should handle email sending failure gracefully', async () => {
      // Even if email fails, lead should be created
      const response = await request(app)
        .post('/api/v1/leads')
        .send({
          name: 'Test User',
          email: 'invalid-email-that-might-fail@test.com',
          phone: '1234567890',
          service: 'SOP',
          category: 'documents',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.leadId).toBeDefined();
    });

    it('should return 200 for duplicate lead attempt', async () => {
      // Create initial lead
      await Lead.create({
        name: 'Existing User',
        email: 'existing@test.com',
        phone: '1234567890',
        service: 'SOP',
      });

      // Try to create duplicate (within 24 hours)
      const response = await request(app).post('/api/v1/leads').send({
        name: 'Existing User',
        email: 'existing@test.com',
        phone: '1234567890',
        service: 'SOP',
        category: 'documents',
      });

      // Should return existing lead (200) not create new (201)
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/leads/:leadId', () => {
    it('should return lead details for valid ID', async () => {
      const accessToken = 'valid_test_token_123';
      const lead = await Lead.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        service: 'VISA_TOURIST',
        status: 'NEW', // Use correct enum value
      });
      const response = await request(app)
        .get(`/api/v1/leads/${lead._id}?token=${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(lead._id.toString());
      expect(response.body.data.name).toBe('Test User');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.status).toBe('NEW');
      // Should only return limited fields
      expect(response.body.data.phone).toBeUndefined();
    });

    it('should return lead details for valid ID without token', async () => {
      const lead = await Lead.create({
        name: 'Public User',
        email: 'public@example.com',
        phone: '1234567890',
        service: 'SOP',
        status: 'NEW',
      });

      const response = await request(app)
        .get(`/api/v1/leads/${lead._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(lead._id.toString());
      expect(response.body.data.name).toBe('Public User');
    });

    it('should return 404 for non-existent lead', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/v1/leads/${fakeId}`).expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('LEAD_NOT_FOUND');
      expect(response.body.message).toContain('Lead'); // Custom error includes ID in message
    });

    it('should return 500 for invalid lead ID format', async () => {
      const response = await request(app)
        .get('/api/v1/leads/invalid-id-format?token=dummy_token')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/leads/:leadId - Edge Cases', () => {
    it('should handle database errors gracefully', async () => {
      // Disconnect to simulate database error
      await mongoose.disconnect();

      const response = await request(app)
        .get(`/api/v1/leads/${new mongoose.Types.ObjectId()}?token=dummy_token`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INTERNAL_ERROR');

      // Reconnect for other tests
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    });
  });
});
