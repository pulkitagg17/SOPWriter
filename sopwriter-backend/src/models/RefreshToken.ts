import mongoose, { Schema, Model } from 'mongoose';

export interface IRefreshToken {
    token: string;
    adminId: mongoose.Types.ObjectId;
    expiresAt: Date;
    revoked: boolean;
    ip?: string;
    userAgent?: string;
    replacedBy?: string;
    createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        revoked: {
            type: Boolean,
            default: false,
        },
        ip: { type: String },
        userAgent: { type: String },
        replacedBy: { type: String },
    },
    { timestamps: true }
);

// Automatically delete expired tokens (best-effort)
RefreshTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export const RefreshToken: Model<IRefreshToken> =
    mongoose.models.RefreshToken ||
    mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
