import type { Request, Response } from 'express';
import { transactionService, mailService } from '../di/container.js';
import { config_vars } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { CreateTransactionDTO } from '../utils/zodSchemas.js';
import { getSafeIp } from '../utils/sanitize.js';

export const declareTransactionHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const payload = req.validatedBody as CreateTransactionDTO;
    const { leadId } = req.params;
    const ip = getSafeIp(req);

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
