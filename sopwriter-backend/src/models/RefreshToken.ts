import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
    token: string;
    adminId: mongoose.Types.ObjectId;
    expiresAt: Date;
    revoked: boolean;
    replacingToken?: string; // For rotation: if this token was used to get a new one
    createdAt: Date;
}

const RefreshTokenSchema = new Schema(
    {
        token: { type: String, required: true, index: true },
        adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
        expiresAt: { type: Date, required: true },
        revoked: { type: Boolean, default: false },
        replacingToken: { type: String },
    },
    { timestamps: true }
);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
