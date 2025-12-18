import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as leadService from '../../services/lead.service.js';
import Lead from '../../models/Lead.js';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Lead.deleteMany({});
});

describe('lead.service', () => {
  it('creates a lead and dedupes within window', async () => {
    const payload = { name: 'Dup', email: 'dup@example.com', service: 'VISA_TOURIST' };
    const a = await leadService.createLead(payload as any);
    expect(a.lead._id).toBeDefined();

    // second call — should return same lead
    const b = await leadService.createLead(payload as any);
    expect(b.lead._id.toString()).toBe(a.lead._id.toString());

    const fresh = await Lead.findOne({ email: 'dup@example.com' }).exec();
    expect(fresh?.history?.some((h: any) => h.action === 'DUPLICATE_ATTEMPT')).toBeTruthy();
  });
});
