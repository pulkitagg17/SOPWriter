import mongoose, { Schema, Model } from 'mongoose';
import {
  TransactionStatus,
  TransactionStatusType,
  TransactionMethod,
  TransactionMethodType,
  HistoryAction
} from '../constants/index.js';

export interface TransactionHistoryEntry {
  action: string;
  by?: string;
  note?: string;
  at?: Date;
}

export interface ITransaction {
  leadId: mongoose.Types.ObjectId;
  transactionId?: string;
  amount?: number;
  method?: TransactionMethodType;
  remark?: string;
  submittedByIp?: string;
  status: TransactionStatusType;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNote?: string;
  history: TransactionHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<TransactionHistoryEntry>(
  {
    action: {
      type: String,
      enum: Object.values(HistoryAction),
      required: true
    },
    by: String,
    note: String,
    at: {
      type: Date,
      default: Date.now
    },
  },
  { _id: false }
);

const TransactionSchema = new Schema<ITransaction>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      index: true,
    },
    amount: {
      type: Number,
      min: 1,
    },
    method: {
      type: String,
      enum: Object.values(TransactionMethod),
    },
    remark: {
      type: String,
      maxlength: 1000,
    },
    submittedByIp: {
      type: String,
      maxlength: 45,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.DECLARED,
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    verifiedAt: {
      type: Date,
    },
    verificationNote: {
      type: String,
      maxlength: 500,
    },
    history: {
      type: [HistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

TransactionSchema.index({ leadId: 1, transactionId: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
