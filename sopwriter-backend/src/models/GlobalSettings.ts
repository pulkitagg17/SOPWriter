import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGlobalSettings extends Document {
  key: string; // e.g., 'contact_email', 'upi_id'
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>(
  {
    key: { type: String, required: true, unique: true, index: true, trim: true },
    value: { type: String, required: true },
    type: { type: String, default: 'string' },
    description: { type: String },
  },
  { timestamps: true }
);

export const GlobalSettings: Model<IGlobalSettings> =
  mongoose.models.GlobalSettings ||
  mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
export default GlobalSettings;
