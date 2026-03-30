import mongoose from 'mongoose';

const worksiteSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  village: { type: String, required: true },
  workers: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'upcoming'], default: 'upcoming' },
  type: { type: String, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

export default mongoose.model('Worksite', worksiteSchema);
