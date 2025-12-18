import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;

  // Login security
  loginAttempts: number;
  lockUntil: Date | null;

  passwordChangedAt: Date | null;

  // OTP / password reset
  otpHash: string | null;
  otpExpires: Date | null;
  otpAttempts: number;
  lastOtpRequest: Date | null;
  otpRequestCount1h: number;
  otpRequestWindowStart: Date | null;

  // Session invalidation
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

    // Login brute-force protection
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    // OTP-based password reset
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

    // Increment to invalidate all existing JWTs
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
