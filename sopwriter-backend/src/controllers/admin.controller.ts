import type { Request, Response } from 'express';
import Transaction from '../models/Transaction.js';
import Lead from '../models/Lead.js';
import * as transactionService from '../services/transaction.service.js';
import { MailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';
import jwt from 'jsonwebtoken';

const mail = new MailService({
  from: config_vars.email.from,
  adminEmail: config_vars.email.adminNotify,
});

export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  const validEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const validPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === validEmail && password === validPass) {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: 'admin', role: 'admin', email }, secret, { expiresIn: '7d' });
    return res.json({ success: true, token });
  }

  return res
    .status(401)
    .json({ success: false, code: 'AUTH_FAILED', message: 'Invalid credentials' });
}

export async function listLeads(req: Request, res: Response) {
  const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 1000); // Allow retrieving more leads for export
  const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.search) {
    const search = req.query.search as string;
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { service: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Lead.countDocuments(filter);
  const data = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return res.json({
    success: true,
    data: {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}

export async function listTransactions(req: Request, res: Response) {
  const status = (req.query.status as string) || undefined;
  const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 200);
  const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (status) filter.status = status;
  if (req.query.leadId) filter.leadId = req.query.leadId;

  const docs = await Transaction.find(filter)
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  // Fetch lead basics in batch
  const leadIds = [...new Set(docs.map((d: any) => d.leadId.toString()))];
  const leads = await Lead.find({ _id: { $in: leadIds } })
    .lean()
    .exec();
  const leadMap = new Map(leads.map((l: any) => [l._id.toString(), l]));

  const items = docs.map((d: any) => {
    const lead = leadMap.get(d.leadId.toString()) as any;
    return {
      ...d,
      lead: lead
        ? {
            _id: lead._id,
            name: lead.name,
            email: lead.email,
            service: lead.service,
          }
        : null,
    };
  });

  return res.json({ success: true, data: { items, page, limit } });
}

export async function getTransactionDetail(req: Request, res: Response) {
  const { id } = req.params;
  const tx = await Transaction.findById(id).populate('leadId').lean().exec();

  if (!tx) {
    return res.status(404).json({
      success: false,
      code: 'TRANSACTION_NOT_FOUND',
      message: 'Transaction not found',
    });
  }

  return res.json({ success: true, data: tx });
}

export async function verifyTransactionHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { action, note } = req.body;

  if (!['VERIFY', 'REJECT'].includes(action)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_ACTION',
      message: 'Action must be VERIFY or REJECT',
    });
  }

  try {
    const admin = (req as any).admin || { id: 'unknown' };
    const result = await transactionService.verifyTransaction(
      id,
      { id: admin.sub || admin.id, email: admin.email },
      action as 'VERIFY' | 'REJECT',
      note
    );

    // Notify user (lead)
    if (result.lead) {
      // Fire-and-forget email to prevent blocking the response
      mail
        .sendUserVerification(result.lead.email, {
          name: result.lead.name,
          leadId: result.lead._id.toString(),
          status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
          note,
          appUrl: process.env.APP_BASE_URL || 'http://localhost:4000',
        })
        .catch((emailErr) => {
          console.warn('Background email failed:', emailErr);
        });
    }

    return res.json({
      success: true,
      data: {
        transactionId: id,
        status: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
      },
    });
  } catch (err: any) {
    if (err.message === 'TRANSACTION_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        code: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found',
      });
    }
    console.error('verifyTransaction error', err);
    return res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      message: 'Could not verify transaction',
    });
  }
}
