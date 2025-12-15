import mongoose, { Schema, Document, Model } from 'mongoose';
import { LeadStatus, LeadStatusType } from '../constants/index.js';

export interface IHistoryEntry {
  action: string;
  note?: string;
  by?: string;
  at?: Date;
}

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  service: string;
  notes?: string;
  status: LeadStatusType;
  history: IHistoryEntry[];
  accessToken?: string; // For public viewing authorization
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<IHistoryEntry>(
  {
    action: { type: String, required: true },
    note: { type: String },
    by: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^\+?[\d\s\-()]+$/.test(v);
        },
        message: 'Invalid phone format',
      },
    },
    service: { type: String, required: true, trim: true },
    notes: { type: String },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    accessToken: { type: String, select: false }, // Hidden by default
    history: { type: [HistorySchema], default: [] },
  },
  { timestamps: true }
);

// index on createdAt for sorting queries
LeadSchema.index({ createdAt: -1 });

export const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
