import mongoose, { Schema, Model } from 'mongoose';

export interface IAuditLog {
    actorId?: string;
    actorEmail?: string;
    action: string;
    targetId?: string;
    status: 'SUCCESS' | 'FAILURE';
    ip?: string;
    userAgent?: string;
    details?: Record<string, any>;
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        actorId: { type: String, index: true },
        actorEmail: { type: String, index: true },
        action: { type: String, required: true, index: true },
        targetId: { type: String, index: true },
        status: {
            type: String,
            enum: ['SUCCESS', 'FAILURE'],
            required: true,
            index: true,
        },
        ip: { type: String },
        userAgent: { type: String },
        details: { type: Schema.Types.Mixed },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for investigations
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
    mongoose.models.AuditLog ||
    mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
