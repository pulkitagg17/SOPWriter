import mongoose, { Schema, Model } from 'mongoose';

export interface IGlobalSetting {
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GlobalSettingsSchema = new Schema<IGlobalSetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const GlobalSettings: Model<IGlobalSetting> =
  mongoose.models.GlobalSettings ||
  mongoose.model<IGlobalSetting>('GlobalSettings', GlobalSettingsSchema);

export default GlobalSettings;
