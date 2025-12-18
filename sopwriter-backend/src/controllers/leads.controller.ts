import type { Request, Response } from 'express';
import { createLead, getLeadById } from '../services/lead.service.js';
import { NotFoundError } from '../utils/errors.js';

import { mailService } from '../services/mail.service.js';
import { config_vars } from '../config/env.js';

export const createLeadHandler = async (req: Request, res: Response) => {
  const payload = req.body;

  const { lead, isDuplicate } = await createLead(payload);

  if (lead) {
    try {
      await mailService.sendLeadConfirmation(lead.email, {
        name: lead.name,
        leadId: lead._id.toString(),
        service: lead.service,
        appUrl: config_vars.app.baseUrl,
      });
    } catch (error) {
      // Log error but don't fail the request
      // logger.error({ err: error }, 'Failed to send lead confirmation email');
    }
  }

  res.status(isDuplicate ? 200 : 201).json({
    success: true,
    data: {
      leadId: lead._id.toString(),
      isDuplicate,
    }
  });
}

export const getLeadPublic = async (req: Request, res: Response) => {
  const { leadId } = req.params;

  const lead = await getLeadById(leadId);
  if (!lead) {
    throw new NotFoundError('Lead', leadId);
  }

  res.json({
    success: true,
    data: {
      _id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      service: lead.service,
      status: lead.status,
      createdAt: lead.createdAt,
    }
  });
}
