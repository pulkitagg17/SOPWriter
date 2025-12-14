import mongoose, { Schema, Document, Model } from 'mongoose';
import { SettingType, SettingTypeType } from '../constants/index.js';

export interface IGlobalSettings extends Document {
  key: string;
  value: string;
  type: SettingTypeType;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>(
  {
    key: { type: String, required: true, unique: true, index: true, trim: true },
    value: { type: String, required: true },
    type: { type: String, default: SettingType.STRING, enum: Object.values(SettingType) },
    description: { type: String },
  },
  { timestamps: true }
);

export const GlobalSettings: Model<IGlobalSettings> =
  mongoose.models.GlobalSettings ||
  mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
export default GlobalSettings;
