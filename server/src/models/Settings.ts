import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  whatsappNumber: string;
}

const SettingsSchema: Schema = new Schema(
  {
    whatsappNumber: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
