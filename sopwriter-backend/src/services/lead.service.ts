import Lead from '../models/Lead.js';
import { CreateLeadDTO } from '../utils/zodSchemas.js';
import { HistoryAction } from '../constants/index.js';
import { escapeRegex } from '../utils/sanitize.js';
import { MailService } from './mail.service.js';
import { getLoggerWithContext } from '../config/logger.js';
import { config_vars } from '../config/env.js';
import { buildPaginationMeta } from '../utils/pagination.js';

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface CreateLeadResult {
  lead: typeof Lead.prototype;
  isDuplicate: boolean;
}

class LeadService {
  constructor(private mailService: MailService) { }

  async createLead(payload: CreateLeadDTO): Promise<CreateLeadResult> {
    const since = new Date(Date.now() - DEDUPE_WINDOW_MS);

    const existing = await Lead.findOne({
      name: payload.name,
      email: payload.email,
      service: payload.service,
      createdAt: { $gte: since },
    });

    if (existing) {
      existing.history.push({
        action: HistoryAction.DUPLICATE_ATTEMPT,
        by: 'public',
        at: new Date(),
      });

      await existing.save();

      return { lead: existing, isDuplicate: true };
    }

    const lead = await Lead.create({
      ...payload,
      history: [
        {
          action: HistoryAction.CREATED,
          by: 'public',
          at: new Date(),
        }
      ],
    });

    return { lead, isDuplicate: false };
  }

  async createLeadWithConfirmation(payload: CreateLeadDTO, requestId: string): Promise<CreateLeadResult> {
    const { lead, isDuplicate } = await this.createLead(payload);

    if (lead && !isDuplicate) {
      await this.mailService.sendLeadConfirmation(lead.email, {
        name: lead.name,
        leadId: lead._id.toString(),
        service: lead.service,
        appUrl: config_vars.app.baseUrl,
      }).catch(err => {
        const log = getLoggerWithContext(requestId);
        log.warn({ err, leadId: lead._id }, 'Failed to send confirmation email');
      });
    }

    return { lead, isDuplicate };
  }

  async getLeadById(id: string) {
    return Lead.findById(id).lean();
  }

  async findAllLeads(options: { search?: string; page: number; limit: number }) {
    const { search, page, limit } = options;
    const filter: Record<string, any> = {};

    if (search) {
      const q = escapeRegex(search);
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { service: new RegExp(q, 'i') },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Lead.countDocuments(filter);
    const items = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      items,
      pagination: buildPaginationMeta({ page, limit }, total)
    };
  }
}

export { LeadService };
