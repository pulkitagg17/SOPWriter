import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import GlobalSettings from '../../models/GlobalSettings.js';
import { SettingType } from '../../constants/index.js';

describe('GlobalSettings Model', () => {
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
    await GlobalSettings.deleteMany({});
  });

  describe('Model Validation', () => {
    it('should create a valid setting', async () => {
      const settingData = {
        key: 'contact_phone',
        value: '+91 98765 43210',
        type: SettingType.STRING,
        description: 'Primary contact phone number',
      };

      const setting = await GlobalSettings.create(settingData);

      expect(setting.key).toBe('contact_phone');
      expect(setting.value).toBe('+91 98765 43210');
      expect(setting.type).toBe(SettingType.STRING);
      expect(setting.description).toBe('Primary contact phone number');
      expect(setting.createdAt).toBeDefined();
      expect(setting.updatedAt).toBeDefined();
    });

    it('should require key field', async () => {
      const settingData = {
        value: 'test value',
        type: SettingType.STRING,
      };

      await expect(GlobalSettings.create(settingData)).rejects.toThrow();
    });

    it('should require value field', async () => {
      const settingData = {
        key: 'test_key',
        type: SettingType.STRING,
      };

      await expect(GlobalSettings.create(settingData)).rejects.toThrow();
    });

    it('should enforce unique key constraint', async () => {
      await GlobalSettings.create({
        key: 'unique_key',
        value: 'value 1',
        type: SettingType.STRING,
      });

      await expect(
        GlobalSettings.create({
          key: 'unique_key',
          value: 'value 2',
          type: SettingType.STRING,
        })
      ).rejects.toThrow();
    });

    it('should use default type value of string', async () => {
      const setting = await GlobalSettings.create({
        key: 'no_type',
        value: 'test',
      });

      expect(setting.type).toBe('string');
    });

    it('should allow description to be optional', async () => {
      const setting = await GlobalSettings.create({
        key: 'no_description',
        value: 'test',
        type: SettingType.STRING,
      });

      expect(setting.description).toBeUndefined();
    });

    it('should trim key field', async () => {
      const setting = await GlobalSettings.create({
        key: '  trimmed_key  ',
        value: 'value',
        type: SettingType.STRING,
      });

      expect(setting.key).toBe('trimmed_key');
    });
  });

  describe('CRUD Operations', () => {
    it('should create contact settings', async () => {
      await GlobalSettings.create([
        { key: 'contact_phone', value: '+91 98765 43210', type: SettingType.STRING },
        { key: 'contact_email', value: 'info@example.com', type: SettingType.STRING },
        { key: 'contact_whatsapp', value: '919871160227', type: SettingType.STRING },
      ]);

      const contactSettings = await GlobalSettings.find({ key: /^contact_/ });
      expect(contactSettings).toHaveLength(3);
    });

    it('should create payment settings', async () => {
      await GlobalSettings.create([
        { key: 'payment_upi_id', value: '919871160227@upi', type: SettingType.STRING },
        { key: 'payment_qr_image', value: '/uploads/qr.jpg', type: SettingType.STRING },
      ]);

      const paymentSettings = await GlobalSettings.find({ key: /^payment_/ });
      expect(paymentSettings).toHaveLength(2);
    });

    it('should update setting value', async () => {
      const setting = await GlobalSettings.create({
        key: 'contact_phone',
        value: '+91 11111 11111',
        type: SettingType.STRING,
      });

      setting.value = '+91 98765 43210';
      setting.description = 'Updated phone number';
      await setting.save();

      const updated = await GlobalSettings.findById(setting._id);
      expect(updated!.value).toBe('+91 98765 43210');
      expect(updated!.description).toBe('Updated phone number');
    });

    it('should delete a setting', async () => {
      const setting = await GlobalSettings.create({
        key: 'delete_me',
        value: 'to be deleted',
        type: SettingType.STRING,
      });

      await GlobalSettings.deleteOne({ _id: setting._id });

      const deleted = await GlobalSettings.findById(setting._id);
      expect(deleted).toBeNull();
    });

    it('should upsert (update or insert) settings', async () => {
      // First upsert - should insert
      await GlobalSettings.findOneAndUpdate(
        { key: 'upsert_key' },
        { value: 'first value', type: SettingType.STRING },
        { upsert: true, new: true }
      );

      let setting = await GlobalSettings.findOne({ key: 'upsert_key' });
      expect(setting!.value).toBe('first value');

      // Second upsert - should update
      await GlobalSettings.findOneAndUpdate(
        { key: 'upsert_key' },
        { value: 'updated value', description: 'Updated' },
        { upsert: true, new: true }
      );

      setting = await GlobalSettings.findOne({ key: 'upsert_key' });
      expect(setting!.value).toBe('updated value');
      expect(setting!.description).toBe('Updated');
    });
  });

  describe('Querying Settings', () => {
    beforeEach(async () => {
      await GlobalSettings.create([
        { key: 'contact_phone', value: '+91 98765 43210', type: SettingType.STRING },
        { key: 'contact_email', value: 'info@example.com', type: SettingType.STRING },
        { key: 'support_email', value: 'support@example.com', type: SettingType.STRING },
        { key: 'payment_upi_id', value: '919871160227@upi', type: SettingType.STRING },
        { key: 'payment_qr_image', value: '/uploads/qr.jpg', type: SettingType.STRING },
      ]);
    });

    it('should find settings by key pattern', async () => {
      const contactSettings = await GlobalSettings.find({ key: /^contact_/ });
      expect(contactSettings).toHaveLength(2);

      const paymentSettings = await GlobalSettings.find({ key: /^payment_/ });
      expect(paymentSettings).toHaveLength(2);
    });

    it('should find setting by key', async () => {
      const setting = await GlobalSettings.findOne({ key: 'contact_phone' });
      expect(setting).toBeTruthy();
      expect(setting!.value).toBe('+91 98765 43210');
    });

    it('should count total settings', async () => {
      const count = await GlobalSettings.countDocuments();
      expect(count).toBe(5);
    });

    it('should find settings matching regex pattern', async () => {
      const contactSettings = await GlobalSettings.find({ key: /^contact_/ });
      expect(contactSettings).toHaveLength(2); // contact_phone, contact_email
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      const setting = await GlobalSettings.create({
        key: 'test_key',
        value: 'test value',
        type: SettingType.STRING,
      });

      expect(setting.createdAt).toBeInstanceOf(Date);
      expect(setting.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const setting = await GlobalSettings.create({
        key: 'test_key',
        value: 'initial value',
        type: SettingType.STRING,
      });

      const initialUpdatedAt = setting.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      setting.value = 'updated value';
      await setting.save();

      expect(setting.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });
});
