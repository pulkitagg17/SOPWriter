import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Service from '../../models/Service.js';

describe('Service Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Service.deleteMany({});
  });

  describe('Model Validation', () => {
    it('should create a valid service', async () => {
      const serviceData = {
        code: 'SOP',
        name: 'Statement of Purpose',
        category: 'documents',
        price: 3999,
        description: 'Professional SOP writing service',
        active: true,
      };

      const service = await Service.create(serviceData);

      expect(service.code).toBe('SOP');
      expect(service.name).toBe('Statement of Purpose');
      expect(service.category).toBe('documents');
      expect(service.price).toBe(3999);
      expect(service.description).toBe('Professional SOP writing service');
      expect(service.active).toBe(true);
      expect(service.createdAt).toBeDefined();
      expect(service.updatedAt).toBeDefined();
    });

    it('should require code field', async () => {
      const serviceData = {
        name: 'Test Service',
        category: 'documents',
        price: 1000,
      };

      await expect(Service.create(serviceData)).rejects.toThrow();
    });

    it('should require name field', async () => {
      const serviceData = {
        code: 'TEST',
        category: 'documents',
        price: 1000,
      };

      await expect(Service.create(serviceData)).rejects.toThrow();
    });

    it('should require category field', async () => {
      const serviceData = {
        code: 'TEST',
        name: 'Test Service',
        price: 1000,
      };

      await expect(Service.create(serviceData)).rejects.toThrow();
    });

    it('should require price field', async () => {
      const serviceData = {
        code: 'TEST',
        name: 'Test Service',
        category: 'documents',
      };

      await expect(Service.create(serviceData)).rejects.toThrow();
    });

    it('should enforce unique code constraint', async () => {
      // Ensure index is created (MongoDB memory server doesn't auto-create)
      await Service.init();

      const serviceData = {
        code: 'SOP',
        name: 'SOP Service',
        category: 'documents',
        price: 3999,
      };

      await Service.create(serviceData);

      // Try to create another service with same code
      await expect(
        Service.create({
          code: 'SOP',
          name: 'Another SOP',
          category: 'documents',
          price: 5000,
        })
      ).rejects.toThrow();
    });

    it('should only accept valid category enum values', async () => {
      const serviceData = {
        code: 'TEST',
        name: 'Test',
        category: 'invalid_category',
        price: 1000,
      };

      await expect(Service.create(serviceData)).rejects.toThrow();
    });

    it('should accept valid category: documents', async () => {
      const service = await Service.create({
        code: 'DOC',
        name: 'Document',
        category: 'documents',
        price: 1000,
      });

      expect(service.category).toBe('documents');
    });

    it('should accept valid category: profile', async () => {
      const service = await Service.create({
        code: 'PROF',
        name: 'Profile',
        category: 'profile',
        price: 1000,
      });

      expect(service.category).toBe('profile');
    });

    it('should accept valid category: visa', async () => {
      const service = await Service.create({
        code: 'VISA',
        name: 'Visa',
        category: 'visa',
        price: 1000,
      });

      expect(service.category).toBe('visa');
    });

    it('should default active to true', async () => {
      const service = await Service.create({
        code: 'TEST',
        name: 'Test',
        category: 'documents',
        price: 1000,
      });

      expect(service.active).toBe(true);
    });

    it('should allow setting active to false', async () => {
      const service = await Service.create({
        code: 'TEST',
        name: 'Test',
        category: 'documents',
        price: 1000,
        active: false,
      });

      expect(service.active).toBe(false);
    });

    it('should trim code and name fields', async () => {
      const service = await Service.create({
        code: '  SOP  ',
        name: '  Statement of Purpose  ',
        category: 'documents',
        price: 3999,
      });

      expect(service.code).toBe('SOP');
      expect(service.name).toBe('Statement of Purpose');
    });

    it('should accept price as number', async () => {
      const service = await Service.create({
        code: 'TEST',
        name: 'Test',
        category: 'documents',
        price: 3999.99,
      });

      expect(typeof service.price).toBe('number');
      expect(service.price).toBe(3999.99);
    });

    it('should reject negative price', async () => {
      await expect(
        Service.create({
          code: 'TEST',
          name: 'Test',
          category: 'documents',
          price: -100,
        })
      ).rejects.toThrow();
    });

    it('should allow updating service fields', async () => {
      const service = await Service.create({
        code: 'SOP',
        name: 'Old SOP',
        category: 'documents',
        price: 3000,
      });

      service.name = 'New SOP';
      service.price = 4000;
      service.description = 'Updated description';
      await service.save();

      const updated = await Service.findById(service._id);
      expect(updated!.name).toBe('New SOP');
      expect(updated!.price).toBe(4000);
      expect(updated!.description).toBe('Updated description');
    });

    it('should have timestamps', async () => {
      const service = await Service.create({
        code: 'TEST',
        name: 'Test',
        category: 'documents',
        price: 1000,
      });

      expect(service.createdAt).toBeInstanceOf(Date);
      expect(service.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Querying Services', () => {
    beforeEach(async () => {
      await Service.create([
        {
          code: 'SOP',
          name: 'Statement of Purpose',
          category: 'documents',
          price: 3999,
          active: true,
        },
        {
          code: 'LOR',
          name: 'Letter of Recommendation',
          category: 'documents',
          price: 2499,
          active: true,
        },
        { code: 'RESUME', name: 'Resume Building', category: 'profile', price: 1999, active: true },
        {
          code: 'INACTIVE',
          name: 'Inactive Service',
          category: 'visa',
          price: 1000,
          active: false,
        },
      ]);
    });

    it('should find services by category', async () => {
      const services = await Service.find({ category: 'documents' });
      expect(services).toHaveLength(2);
    });

    it('should find only active services', async () => {
      const services = await Service.find({ active: true });
      expect(services).toHaveLength(3);
    });

    it('should find service by code', async () => {
      const service = await Service.findOne({ code: 'SOP' });
      expect(service).toBeTruthy();
      expect(service!.name).toBe('Statement of Purpose');
    });

    it('should sort services by price', async () => {
      const services = await Service.find({ active: true }).sort({ price: 1 });
      expect(services[0].price).toBe(1999);
      expect(services[2].price).toBe(3999);
    });
  });
});
