import Lead, { ILead } from '../models/Lead.js';
import { CreateLeadDTO } from '../utils/zodSchemas.js';
import { DEDUPE, HistoryAction } from '../constants/index.js';
import crypto from 'crypto';

export async function createLead(payload: CreateLeadDTO): Promise<ILead> {
  // Dedupe: same name + email + service within window
  const since = new Date(Date.now() - DEDUPE.WINDOW_MS);
  const existing = await Lead.findOne({
    name: payload.name,
    email: payload.email,
    service: payload.service,
    createdAt: { $gte: since },
  }).exec();

  if (existing) {
    // append history about duplicate attempt
    existing.history.push({
      action: HistoryAction.DUPLICATE_ATTEMPT,
      note: 'Duplicate lead within 24h',
      by: 'public',
    });
    await existing.save();
    // Return existing lead but we won't return the token for security (unless we regenerate it, but let's assume dedupe means they lost it)
    // Actually, for UX, if they are retrying, they might need the link again.
    // Let's ensure the existing lead has a token, if not (legacy), generate one.
    if (!existing.accessToken) {
      const token = crypto.randomBytes(32).toString('hex');
      existing.accessToken = token;
      await existing.save();
      // Temporarily attach token to result for the controller to send back
      (existing as any)._tempAccessToken = token;
    } else {
      // If it exists, we might not want to expose it again easily to prevent enumeration,
      // but since this requires matching name+email+service+time, it's somewhat authenticated.
      (existing as any)._tempAccessToken = existing.accessToken;
    }
    return existing;
  }

  const accessToken = crypto.randomBytes(32).toString('hex');
  const lead = new Lead({
    ...payload,
    accessToken,
    history: [{ action: HistoryAction.CREATED, by: 'public' }]
  });

  await lead.save();
  // Attach token for controller
  (lead as any)._tempAccessToken = accessToken;

  return lead;
}

export async function getLeadById(id: string) {
  return Lead.findById(id).lean().exec();
}

/**
 * Verify if the public user has the correct token to view this lead
 */
export async function getPublicLead(id: string, token: string) {
  const lead = await Lead.findById(id).select('+accessToken').lean().exec();
  if (!lead || !lead.accessToken) return null;

  // Constant time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(lead.accessToken),
    Buffer.from(token.length === lead.accessToken.length ? token : lead.accessToken)
  ) && token.length === lead.accessToken.length;

  if (!isValid) return null;

  const { accessToken, ...safeLead } = lead;
  return safeLead;
}
