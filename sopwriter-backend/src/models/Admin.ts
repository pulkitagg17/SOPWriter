import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  loginAttempts: number;
  lockUntil: Date | null;
  otpHash: string | null;
  otpExpires: Date | null;
  otpAttempts: number;
  lastOtpRequest: Date | null;
  otpRequestCount1h: number;
  otpRequestWindowStart: Date | null;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    otpHash: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    lastOtpRequest: {
      type: Date,
      default: null,
    },
    otpRequestCount1h: {
      type: Number,
      default: 0,
    },
    otpRequestWindowStart: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
