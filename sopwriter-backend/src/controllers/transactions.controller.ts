import type { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service.js';
import { mailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { CreateTransactionDTO } from '../utils/zodSchemas.js';

export const declareTransactionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const payload = req.validatedBody as CreateTransactionDTO;
    const { leadId } = req.params;
    const ip = req.ip;

    const tx = await transactionService.declareTransaction(
      leadId,
      payload,
      ip
    );

    mailService.sendAdminNotification({
      transactionId: tx.transactionId,
      leadId: tx.leadId.toString(),
      appUrl: config_vars.app.baseUrl,
    }).catch(() => { });

    res.status(201).json({
      success: true,
      data: {
        transactionId: tx._id,
      }
    });
  }
);
