import type { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service.js';
import { MailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responses.js';
import { getClientIp } from '../utils/requestHelpers.js';

const mail = MailService.getInstance();

export const declareTransactionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const payload = (req as any).validatedBody;
    const { leadId } = req.params;
    const ip = getClientIp(req);
    const tx = await transactionService.declareTransaction(leadId, payload, ip);

    // notify admin (await so tests can spy)
    const lead = (tx as any).leadId || tx.leadId;
    const leadName = typeof lead === 'object' ? lead.name || '' : '';
    const leadEmail = typeof lead === 'object' ? lead.email || '' : '';

    mail
      .sendAdminNotification({
        transactionId: tx.transactionId,
        leadId: tx.leadId.toString(),
        leadName,
        leadEmail,
        appUrl: config_vars.app.baseUrl,
      })
      .catch(() => {}); // Email notification failure is non-critical

    res.json(successResponse({ transactionId: tx._id }));
  }
);
