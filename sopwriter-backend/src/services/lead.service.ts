import Lead from '../models/Lead.js';
import { CreateLeadDTO } from '../utils/zodSchemas.js';
import { HistoryAction } from '../constants/index.js';
import { escapeRegex } from '../utils/sanitize.js';

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface CreateLeadResult {
  lead: typeof Lead.prototype;
  isDuplicate: boolean;
}

export async function createLead(payload: CreateLeadDTO): Promise<CreateLeadResult> {
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


export async function getLeadById(id: string) {
  return Lead.findById(id).lean();
}

export async function getPublicLead(id: string) {
  return Lead.findById(id).lean();
}

interface PaginationOptions {
  page: number;
  limit: number;
}

export async function findAllLeads(search?: string, options: PaginationOptions = { page: 1, limit: 100 }) {
  const filter: Record<string, any> = {};

  if (search) {
    const q = escapeRegex(search);
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { email: new RegExp(q, 'i') },
      { service: new RegExp(q, 'i') },
    ];
  }

  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const total = await Lead.countDocuments(filter);
  const items = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}
