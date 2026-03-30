import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. W001
  name: { type: String, required: true },
  jobCardNumber: { type: String, required: true },
  aadhaar: { type: String, required: true },
  bankAccount: { type: String, required: true },
  village: { type: String, required: true },
  block: { type: String, required: true },
  district: { type: String, required: true },
  skillType: { type: String, required: true }, // Skilled, Semi-Skilled, Unskilled
  workCategory: { type: String, required: true }, 
  familyMembers: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  daysWorked: { type: Number, default: 0 },
  totalWages: { type: Number, default: 0 },
  pendingPayment: { type: Number, default: 0 },
  phone: { type: String },
}, { timestamps: true });

export default mongoose.model('Worker', workerSchema);
