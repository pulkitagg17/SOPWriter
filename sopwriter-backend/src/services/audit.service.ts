import AuditLog from '../models/AuditLog.js';
import type { AuditActionType } from '../constants/index.js';

type AuditInput = {
    actorId?: string;
    actorEmail?: string;
    action: AuditActionType;
    targetId?: string;
    status: 'SUCCESS' | 'FAILURE';
    ip?: string;
    userAgent?: string;
    details?: Record<string, any>;
};

export async function logAudit(input: AuditInput) {
    try {
        await AuditLog.create(input);
    } catch (err) {
        // Never throw from audit logging
        console.error('[AUDIT_LOG_FAILED]', err);
    }
}
