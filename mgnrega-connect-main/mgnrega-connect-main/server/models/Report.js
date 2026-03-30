import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  generatedDate: { type: String, required: true }, // Format: YYYY-MM-DD
  period: { type: String }, // e.g. "Jan 2024"
  status: { type: String, enum: ['ready', 'generating', 'failed'], default: 'generating' },
  format: { type: String, enum: ['PDF', 'Excel', 'CSV'], default: 'PDF' },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
