import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import Worker from './models/Worker.js';
import Attendance from './models/Attendance.js';
import Worksite from './models/Worksite.js';
import Report from './models/Report.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected. Clearing old data...");

    // Clear existing data
    await Worker.deleteMany({});
    await Attendance.deleteMany({});
    await Worksite.deleteMany({});
    await Report.deleteMany({});

    console.log("Inserting 6+ Sample Workers...");
    const workers = [
      { id: 'W001', name: 'Ramesh Kumar', jobCardNumber: 'JC-2024-001', aadhaar: 'XXXX-XXXX-1234', bankAccount: 'SBI-000123', village: 'Chandpur', block: 'Sadar', district: 'Varanasi', skillType: 'Skilled', workCategory: 'Road Construction', familyMembers: 5, status: 'active', daysWorked: 22, totalWages: 7150, pendingPayment: 0, phone: '9876543201' },
      { id: 'W002', name: 'Sunita Devi', jobCardNumber: 'JC-2024-002', aadhaar: 'XXXX-XXXX-2345', bankAccount: 'HDFC-000456', village: 'Rampur', block: 'Sadar', district: 'Varanasi', skillType: 'Unskilled', workCategory: 'Well Digging', familyMembers: 4, status: 'active', daysWorked: 18, totalWages: 5850, pendingPayment: 1950, phone: '9876543202' },
      { id: 'W003', name: 'Mohan Lal', jobCardNumber: 'JC-2024-003', aadhaar: 'XXXX-XXXX-3456', bankAccount: 'BOI-000789', village: 'Shivpur', block: 'Pindra', district: 'Varanasi', skillType: 'Semi-Skilled', workCategory: 'Plantation', familyMembers: 6, status: 'active', daysWorked: 25, totalWages: 8125, pendingPayment: 0, phone: '9876543203' },
      { id: 'W004', name: 'Geeta Kumari', jobCardNumber: 'JC-2024-004', aadhaar: 'XXXX-XXXX-4567', bankAccount: 'PNB-000112', village: 'Chandpur', block: 'Sadar', district: 'Varanasi', skillType: 'Unskilled', workCategory: 'Road Construction', familyMembers: 3, status: 'inactive', daysWorked: 10, totalWages: 3250, pendingPayment: 3250, phone: '9876543204' },
      { id: 'W005', name: 'Anil Yadav', jobCardNumber: 'JC-2024-005', aadhaar: 'XXXX-XXXX-5678', bankAccount: 'AXIS-000334', village: 'Lohta', block: 'Kashi Vidyapeeth', district: 'Varanasi', skillType: 'Skilled', workCategory: 'Water Conservation', familyMembers: 4, status: 'active', daysWorked: 20, totalWages: 6500, pendingPayment: 650, phone: '9876543205' },
      { id: 'W006', name: 'Priya Singh', jobCardNumber: 'JC-2024-006', aadhaar: 'XXXX-XXXX-6789', bankAccount: 'ICICI-000556', village: 'Rampur', block: 'Sadar', district: 'Varanasi', skillType: 'Unskilled', workCategory: 'Plantation', familyMembers: 5, status: 'active', daysWorked: 15, totalWages: 4875, pendingPayment: 0, phone: '9876543206' }
    ];
    await Worker.insertMany(workers);

    console.log("Inserting Sample Attendance...");
    const attendance = [
      { id: 'A001', workerId: 'W001', workerName: 'Ramesh Kumar', date: new Date().toISOString().split('T')[0], checkIn: '08:00', checkOut: '17:00', status: 'present', worksite: 'NH-7 Road Extension', gpsVerified: true, photoVerified: true, village: 'Chandpur' },
      { id: 'A002', workerId: 'W002', workerName: 'Sunita Devi', date: new Date().toISOString().split('T')[0], checkIn: '08:15', checkOut: '17:00', status: 'present', worksite: 'Community Well Project', gpsVerified: true, photoVerified: true, village: 'Rampur' },
      { id: 'A003', workerId: 'W003', workerName: 'Mohan Lal', date: new Date().toISOString().split('T')[0], checkIn: '08:00', checkOut: '12:00', status: 'half-day', worksite: 'Village Plantation Drive', gpsVerified: true, photoVerified: false, village: 'Shivpur' },
      { id: 'A004', workerId: 'W004', workerName: 'Geeta Kumari', date: new Date().toISOString().split('T')[0], checkIn: '-', checkOut: '-', status: 'absent', worksite: '-', gpsVerified: false, photoVerified: false, village: 'Chandpur' },
      { id: 'A005', workerId: 'W005', workerName: 'Anil Yadav', date: new Date().toISOString().split('T')[0], checkIn: '07:45', checkOut: '17:00', status: 'present', worksite: 'Water Conservation Site', gpsVerified: true, photoVerified: true, village: 'Lohta' },
      { id: 'A006', workerId: 'W006', workerName: 'Priya Singh', date: new Date().toISOString().split('T')[0], checkIn: '08:30', checkOut: '17:00', status: 'present', worksite: 'Village Plantation Drive', gpsVerified: true, photoVerified: true, village: 'Rampur' }
    ];
    await Attendance.insertMany(attendance);

    console.log("Inserting Sample Worksites...");
    const worksites = [
      { id: 101, name: "NH-7 Road Extension", village: "Chandpur", workers: 45, status: "active", type: "Road Construction", progress: 72 },
      { id: 102, name: "Community Well Project", village: "Rampur", workers: 28, status: "active", type: "Well Digging", progress: 55 },
      { id: 103, name: "Village Plantation Drive", village: "Shivpur", workers: 35, status: "active", type: "Plantation", progress: 88 },
      { id: 104, name: "Water Conservation Site", village: "Lohta", workers: 22, status: "completed", type: "Water Conservation", progress: 100 },
      { id: 105, name: "School Boundary Wall", village: "Sarnath", workers: 18, status: "upcoming", type: "Construction", progress: 0 },
      { id: 106, name: "Panchayat Bhavan Renovation", village: "Ramnagar", workers: 12, status: "active", type: "Construction", progress: 30 }
    ];
    await Worksite.insertMany(worksites);

    console.log("Inserting Sample Reports...");
    const reports = [
      { id: 'R001', title: 'Daily Attendance Report', type: 'Attendance', generatedDate: new Date().toISOString().split('T')[0], period: 'Today', status: 'ready', format: 'PDF' },
      { id: 'R002', title: 'Weekly Wage Report', type: 'Wages', generatedDate: new Date().toISOString().split('T')[0], period: 'This Week', status: 'ready', format: 'Excel' },
      { id: 'R003', title: 'Monthly Work Summary', type: 'Summary', generatedDate: '2024-01-01', period: 'Last Month', status: 'ready', format: 'PDF' },
      { id: 'R004', title: 'Village-wise Employment', type: 'Employment', generatedDate: '2024-01-10', period: 'Q4 2023', status: 'ready', format: 'CSV' },
      { id: 'R005', title: 'Budget Utilization Report', type: 'Budget', generatedDate: '2024-01-12', period: 'FY 2023-24', status: 'generating', format: 'PDF' },
      { id: 'R006', title: 'Payment Delay Report', type: 'Payment', generatedDate: '2024-01-13', period: 'Jan 2024', status: 'ready', format: 'Excel' }
    ];
    await Report.insertMany(reports);

    console.log("SUCCESS: Database fully seeded with 6 sample items in all categories!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
