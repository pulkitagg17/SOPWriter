import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
    adminId: mongoose.Types.ObjectId; // Potentially null if system action or failed login
    action: string;
    targetId?: string;
    details?: any;
    ip?: string;
    userAgent?: string;
    status: 'SUCCESS' | 'FAILURE';
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
        action: { type: String, required: true, index: true },
        targetId: { type: String },
        details: { type: Schema.Types.Mixed }, // Store as flexible object
        ip: { type: String },
        userAgent: { type: String },
        status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL index to auto-delete logs after 90 days
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const AuditLog: Model<IAuditLog> =
    mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
