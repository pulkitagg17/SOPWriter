import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  TransactionStatus,
  TransactionStatusType,
  TransactionMethod,
  TransactionMethodType,
} from '../constants/index.js';

export interface ITransHistoryEntry {
  action: string;
  by?: string;
  note?: string;
  at?: Date;
}

export interface ITransaction extends Document {
  leadId: mongoose.Types.ObjectId;
  transactionId?: string;
  amount?: number;
  method?: TransactionMethodType;
  remark?: string;
  submittedAt: Date;
  submittedByIp?: string;
  status: TransactionStatusType;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNote?: string;
  history: ITransHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const TransHistorySchema = new Schema<ITransHistoryEntry>(
  {
    action: { type: String, required: true },
    by: { type: String },
    note: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TransactionSchema = new Schema<ITransaction>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    transactionId: { type: String, index: true },
    amount: { type: Number, min: [0, 'Amount must be positive'] },
    method: { type: String, enum: Object.values(TransactionMethod) },
    remark: { type: String },
    submittedAt: { type: Date, default: Date.now },
    submittedByIp: { type: String },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.DECLARED,
      index: true,
    },
    verifiedBy: { type: String },
    verifiedAt: { type: Date },
    verificationNote: { type: String },
    history: { type: [TransHistorySchema], default: [] },
  },
  { timestamps: true }
);

// Compound index to quickly find declared transactions by lead and transactionId
TransactionSchema.index({ leadId: 1, transactionId: 1 });
TransactionSchema.index({ status: 1, submittedAt: -1 });

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;
