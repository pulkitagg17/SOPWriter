import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Lead from '../../models/Lead.js';
import Transaction from '../../models/Transaction.js';
import { TransactionService } from '../../services/transaction.service.js';

let mongod: MongoMemoryServer;
const transactionService = new TransactionService();

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Transaction.deleteMany({});
  await Lead.deleteMany({});
});

describe('transaction.service', () => {
  it('declares transaction and updates lead', async () => {
    const lead = await new Lead({
      name: 'T1',
      email: 't1@example.com',
      service: 'VISA_TOURIST',
    }).save();
    const tx = await transactionService.declareTransaction(
      lead._id.toString(),
      { transactionId: 'TT1' } as any,
      '1.2.3.4'
    );
    expect(tx._id).toBeDefined();
    const freshLead = await Lead.findById(lead._id).exec();
    expect(freshLead?.status).toBe('PAYMENT_DECLARED');
    expect(freshLead?.history?.some((h: any) => h.action === 'PAYMENT_DECLARED')).toBeTruthy();
  });

  it('verifyTransaction sets status and updates lead', async () => {
    const lead = await new Lead({
      name: 'T2',
      email: 't2@example.com',
      service: 'VISA_TOURIST',
    }).save();
    const tx = await transactionService.declareTransaction(
      lead._id.toString(),
      { transactionId: 'TT2' } as any,
      '1.2.3.4'
    );
    const res = await transactionService.verifyTransaction(
      tx._id.toString(),
      { id: new mongoose.Types.ObjectId().toString(), email: 'a@test' },
      'VERIFY',
      'ok'
    );
    expect(res.tx.status).toBe('VERIFIED');
    const freshLead = await Lead.findById(lead._id).exec();
    expect(freshLead?.status).toBe('VERIFIED');
  });
});
