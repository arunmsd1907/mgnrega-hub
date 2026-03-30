import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, 
  workerId: { type: String, required: true }, // References Worker.id
  workerName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkIn: { type: String, default: '-' },
  checkOut: { type: String, default: '-' },
  status: { type: String, enum: ['present', 'absent', 'half-day'], required: true },
  worksite: { type: String, default: '-' },
  gpsVerified: { type: Boolean, default: false },
  photoVerified: { type: Boolean, default: false },
  village: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
