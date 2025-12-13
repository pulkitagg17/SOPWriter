import type { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service.js';
import { MailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';

const mail = new MailService({
  from: config_vars.email.from,
  adminEmail: config_vars.email.adminNotify,
});

export async function declareTransactionHandler(req: Request, res: Response) {
  const payload = (req as any).validatedBody;
  const { leadId } = req.params;

  try {
    const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown').toString();
    const tx = await transactionService.declareTransaction(leadId, payload, ip);

    // notify admin (await so tests can spy)
    const lead = (tx as any).leadId || tx.leadId;
    const leadName = typeof lead === 'object' ? lead.name || '' : '';
    const leadEmail = typeof lead === 'object' ? lead.email || '' : '';

    try {
      await mail.sendAdminNotification({
        transactionId: tx.transactionId,
        leadId: tx.leadId.toString(),
        leadName,
        leadEmail,
        appUrl: process.env.APP_BASE_URL || 'http://localhost:5173',
      });
    } catch (emailErr) {
      console.warn(
        'Notice: Admin notification email failed (this is expected if using placeholder credentials). Lead & Transaction saved successfully.'
      );
    }

    return res.json({ success: true, data: { transactionId: tx._id } });
  } catch (err: any) {
    if (err.message === 'LEAD_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        code: 'LEAD_NOT_FOUND',
        message: 'Lead not found',
      });
    }
    console.error('declareTransaction error', err);
    return res.status(500).json({
      success: false,
      code: 'INTERNAL_ERROR',
      message: 'Could not declare transaction',
    });
  }
}
