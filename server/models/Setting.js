import mongoose from 'mongoose';

// A single-document schema to store app settings
const settingSchema = new mongoose.Schema({
  isConfigured: { type: Boolean, default: true, unique: true }, // Ensure singleton
  district: { type: String, default: 'Varanasi' },
  block: { type: String, default: 'Sadar' },
  wageRate: { type: Number, default: 325 },
  language: { type: String, default: 'en' },
  smsAlerts: { type: Boolean, default: true },
  emailSummary: { type: Boolean, default: false },
  anomalyAlerts: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
