import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  action: { type: String, required: true },
  user: { type: String, required: true },
  target: { type: String },
  timestamp: { type: String, required: true }, // e.g. '2024-01-15 09:12'
  level: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
