import mongoose, { Schema, Document, Model } from 'mongoose';
import { ServiceCategory, ServiceCategoryType } from '../constants/index.js';

export interface IService extends Document {
  code: string;
  name: string;
  category: ServiceCategoryType;
  price: number;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    code: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: Object.values(ServiceCategory),
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default Service;
