import type { Request, Response } from 'express';
import * as leadService from '../services/lead.service.js';
import type { IHistoryEntry } from '../models/Lead.js';
import { MailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';
import { NotFoundError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responses.js';
import { HistoryAction } from '../constants/index.js';

const mail = MailService.getInstance();

export const createLeadHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const payload = (req as any).validatedBody;
    const lead = await leadService.createLead(payload);

    // Extract the temp access token attached by service
    const accessToken = (lead as any)._tempAccessToken;

    // send confirmation email (fire-and-forget)
    mail
      .sendLeadConfirmation(lead.email, {
        name: lead.name,
        leadId: lead._id.toString(),
        service: lead.service,
        adminEmail: mail.adminEmail,
        appUrl: config_vars.app.baseUrl,
      })
      .catch(() => { }); // Email failure is non-critical

    // If this was a dedupe (history last item might be DUPLICATE_ATTEMPT), return 200 and note it
    const isDuplicate =
      lead.history &&
      lead.history.some((h: IHistoryEntry) => h.action === HistoryAction.DUPLICATE_ATTEMPT);
    const statusCode = isDuplicate ? 200 : 201;

    res.status(statusCode).json(successResponse({ leadId: lead._id, token: accessToken }));
  }
);

export const getLeadPublic = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { leadId } = req.params;
  const token = (req.query.token as string) || (req.headers['x-access-token'] as string);

  // Token check removed to support ID-based tracking
  // if (!token) {
  //   throw new NotFoundError('Lead', leadId);
  // }

  const lead = await leadService.getPublicLead(leadId, token);

  if (!lead) throw new NotFoundError('Lead', leadId);

  const lite = {
    _id: lead._id,
    name: lead.name,
    email: lead.email,
    service: lead.service,
    status: lead.status,
    createdAt: lead.createdAt,
    // Return token so frontend can persist it if needed (optional)
  };
  res.json(successResponse(lite));
});
