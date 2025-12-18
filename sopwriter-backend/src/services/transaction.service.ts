import Transaction from '../models/Transaction.js';
import Lead from '../models/Lead.js';
import { CreateTransactionDTO } from '../utils/zodSchemas.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  HistoryAction,
  LeadStatus,
  TransactionStatus,
} from '../constants/index.js';

export class TransactionService {
  constructor() { }

  async declareTransaction(
    leadId: string,
    payload: CreateTransactionDTO,
    submittedByIp?: string
  ) {
    const lead = await Lead.findById(leadId);
    if (!lead) throw new NotFoundError('Lead', leadId);

    // Idempotency: one declared transaction per lead
    const existing = await Transaction.findOne({
      leadId: lead._id,
      status: TransactionStatus.DECLARED,
    });

    if (existing) return existing;

    const now = new Date();

    const tx = await Transaction.create({
      leadId: lead._id,
      transactionId: payload.transactionId,
      amount: payload.amount,
      method: payload.method,
      remark: payload.remark,
      submittedByIp,
      status: TransactionStatus.DECLARED,
      history: [
        {
          action: HistoryAction.DECLARED,
          by: 'public',
          note: payload.remark,
          at: now,
        },
      ],
    });

    lead.status = LeadStatus.PAYMENT_DECLARED;
    lead.history.push({
      action: HistoryAction.PAYMENT_DECLARED,
      by: 'public',
      note: `Transaction ${tx._id.toString()} declared`,
      at: now,
    });

    await lead.save();

    return tx;
  }

  async verifyTransaction(
    transactionId: string,
    admin: { id: string; email?: string },
    action: 'VERIFY' | 'REJECT',
    note?: string,
  ) {
    const tx = await Transaction.findById(transactionId);
    if (!tx) throw new NotFoundError('Transaction', transactionId);

    if (tx.status !== TransactionStatus.DECLARED) {
      throw new ValidationError(`Transaction already ${tx.status.toLowerCase()}`);
    }

    const lead = await Lead.findById(tx.leadId);
    if (!lead) throw new NotFoundError('Lead', tx.leadId.toString());

    const now = new Date();

    if (action === 'VERIFY') {
      tx.status = TransactionStatus.VERIFIED;
      tx.history.push({
        action: HistoryAction.VERIFIED,
        by: `admin:${admin.id}`,
        note,
        at: now,
      });

      lead.status = LeadStatus.VERIFIED;
      lead.history.push({
        action: HistoryAction.PAYMENT_VERIFIED,
        by: `admin:${admin.id}`,
        note,
        at: now,
      });
    } else {
      tx.status = TransactionStatus.REJECTED;
      tx.history.push({
        action: HistoryAction.REJECTED,
        by: `admin:${admin.id}`,
        note,
        at: now,
      });

      lead.status = LeadStatus.REJECTED;
      lead.history.push({
        action: HistoryAction.PAYMENT_REJECTED,
        by: `admin:${admin.id}`,
        note,
        at: now,
      });
    }

    tx.verifiedBy = admin.id;
    tx.verifiedAt = now;
    tx.verificationNote = note;

    await tx.save();
    await lead.save();

    return { tx, lead };
  }

  async findAllTransactions(filter: { status?: string; leadId?: string }) {
    const query: Record<string, any> = {};

    if (filter.status) query.status = filter.status;
    if (filter.leadId) query.leadId = filter.leadId;

    return Transaction.find(query)
      .populate('leadId', '_id name email service')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getTransactionById(id: string) {
    return Transaction.findById(id).populate('leadId');
  }
}
