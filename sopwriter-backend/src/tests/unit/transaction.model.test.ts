import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Transaction from '../../models/Transaction.js';
import Lead from '../../models/Lead.js';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Transaction.deleteMany({});
  await Lead.deleteMany({});
});

describe('Transaction model', () => {
  it('should default status to DECLARED and require leadId', async () => {
    // create a lead first
    const lead = await new Lead({
      name: 'Test',
      email: 't@example.com',
      service: 'VISA_TOURIST',
    }).save();

    const tx = new Transaction({ leadId: lead._id, transactionId: 'TX123' });
    const saved = await tx.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('DECLARED');
    expect(saved.createdAt).toBeDefined();
  });

  it('should fail when leadId is missing', async () => {
    let err: any;
    try {
      const tx = new Transaction({ transactionId: 'TXNOLEAD' } as any);
      await tx.save();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
  });
});
