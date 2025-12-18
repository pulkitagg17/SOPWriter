import type { Request, Response } from 'express';
import { leadService } from '../di/container.js';
import { NotFoundError } from '../utils/errors.js';

export const createLeadHandler = async (req: Request, res: Response) => {
  const payload = req.body;

  const { lead, isDuplicate } = await leadService.createLeadWithConfirmation(payload, req.requestId);

  res.status(isDuplicate ? 200 : 201).json({
    success: true,
    data: {
      leadId: lead._id.toString(),
      isDuplicate,
    }
  });
};

export const getLeadPublic = async (req: Request, res: Response) => {
  const { leadId } = req.params;

  const lead = await leadService.getLeadById(leadId);
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
