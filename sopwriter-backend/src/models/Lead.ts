import mongoose, { Schema, Model } from 'mongoose';
import { LeadStatus, LeadStatusType, HistoryAction } from '../constants/index.js';

export interface LeadHistoryEntry {
  action: string;
  note?: string;
  by?: string;
  at?: Date;
}

export interface ILead {
  name: string;
  email: string;
  phone?: string;
  service: string;
  notes?: string;
  status: LeadStatusType;
  history: LeadHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<LeadHistoryEntry>(
  {
    action: {
      type: String,
      enum: Object.values(HistoryAction),
      required: true
    },
    note: String,
    by: String,
    at: {
      type: Date,
      default: Date.now
    },
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      trim: true,
      match: /^\+?[0-9\s\-()]{7,20}$/,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
      index: true
    },
    history: {
      type: [HistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
