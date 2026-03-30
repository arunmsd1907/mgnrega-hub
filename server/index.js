import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Worker from './models/Worker.js';
import Attendance from './models/Attendance.js';
import Worksite from './models/Worksite.js';
import Report from './models/Report.js';
import AuditLog from './models/AuditLog.js';
import Setting from './models/Setting.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: Missing MONGODB_URI in .env file");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Backend is running and connected to DB' 
  });
});

const handleError = (res, err) => {
  console.error("API Error:", err);
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => `Missing ${val.path}`);
    return res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate ID error. Please try again.' });
  }
  res.status(400).json({ message: err.message || 'An error occurred' });
};

// === Worker Routes ===

// Get all workers
app.get('/api/workers', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new worker
app.post('/api/workers', async (req, res) => {
  try {
    const newWorker = new Worker(req.body);
    const savedWorker = await newWorker.save();
    res.status(201).json(savedWorker);
  } catch (err) {
    handleError(res, err);
  }
});

// Update worker
app.put('/api/workers/:id', async (req, res) => {
  try {
    const updatedWorker = await Worker.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true, runValidators: true }
    );
    res.json(updatedWorker);
  } catch (err) {
    handleError(res, err);
  }
});

// Delete worker
app.delete('/api/workers/:id', async (req, res) => {
  try {
    await Worker.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Worker deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Attendance Routes ===

// Get all attendance
app.get('/api/attendance', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new attendance record
app.post('/api/attendance', async (req, res) => {
  try {
    const newRecord = new Attendance(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    handleError(res, err);
  }
});

// Update attendance record
app.put('/api/attendance/:id', async (req, res) => {
  try {
    const updatedRecord = await Attendance.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true, runValidators: true }
    );
    res.json(updatedRecord);
  } catch (err) {
    handleError(res, err);
  }
});

// Delete attendance record
app.delete('/api/attendance/:id', async (req, res) => {
  try {
    await Attendance.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// === Wages & Stats Routes ===

// Disburse wages for a worker
app.post('/api/workers/:id/disburse', async (req, res) => {
  try {
    const { amount } = req.body;
    const worker = await Worker.findOne({ id: req.params.id });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    
    // Deduct pending payment
    worker.pendingPayment = Math.max(0, worker.pendingPayment - amount);
    await worker.save();
    
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const activeWorkers = await Worker.countDocuments({ status: 'active' });
    
    // Calculate total pending payments and wages
    const workers = await Worker.find({}, 'pendingPayment totalWages');
    const pendingPayments = workers.reduce((sum, w) => sum + (w.pendingPayment || 0), 0);
    const totalWages = workers.reduce((sum, w) => sum + (w.totalWages || 0), 0);
    const totalWagesDisbursed = totalWages - pendingPayments;
    
    res.json({
      totalWorkers,
      activeWorkers,
      pendingPayments,
      totalWagesDisbursed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Worksite Routes ===
app.get('/api/worksites', async (req, res) => {
  try {
    const sites = await Worksite.find().sort({ id: 1 });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/worksites', async (req, res) => {
  try {
    const newSite = new Worksite(req.body);
    const saved = await newSite.save();
    res.status(201).json(saved);
  } catch (err) {
    handleError(res, err);
  }
});
app.put('/api/worksites/:id', async (req, res) => {
  try {
    const updated = await Worksite.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
});
app.delete('/api/worksites/:id', async (req, res) => {
  try {
    await Worksite.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Worksite deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Report Routes ===
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/reports', async (req, res) => {
  try {
    const newReport = new Report(req.body);
    const saved = await newReport.save();
    res.status(201).json(saved);
  } catch (err) {
    handleError(res, err);
  }
});
app.put('/api/reports/:id', async (req, res) => {
  try {
    const updated = await Report.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
});
app.delete('/api/reports/:id', async (req, res) => {
  try {
    await Report.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Audit Log Routes ===
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ id: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/logs', async (req, res) => {
  try {
    const newLog = new AuditLog(req.body);
    const saved = await newLog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// === Settings Routes ===
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Setting.findOne({ isConfigured: true });
    if (!settings) {
      settings = await Setting.create({ isConfigured: true }); // Create initial default settings
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/api/settings', async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate({ isConfigured: true }, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
