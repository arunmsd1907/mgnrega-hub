export interface Worker {
  id: string;
  name: string;
  jobCardNumber: string;
  aadhaar: string;
  bankAccount: string;
  village: string;
  block: string;
  district: string;
  skillType: string;
  workCategory: string;
  familyMembers: number;
  status: 'active' | 'inactive';
  daysWorked: number;
  totalWages: number;
  pendingPayment: number;
  phone: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'half-day';
  worksite: string;
  gpsVerified: boolean;
  photoVerified: boolean;
  village: string;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  period: string;
  status: 'ready' | 'generating' | 'failed';
  format: 'PDF' | 'Excel' | 'CSV';
}

export const workers: Worker[] = [
  { id: 'W001', name: 'Ramesh Kumar', jobCardNumber: 'JC-2024-001', aadhaar: 'XXXX-XXXX-1234', bankAccount: 'XXXX-XXXX-5678', village: 'Chandpur', block: 'Sadar', district: 'Varanasi', skillType: 'Skilled', workCategory: 'Road Construction', familyMembers: 5, status: 'active', daysWorked: 22, totalWages: 7150, pendingPayment: 0, phone: '9876XXXX01' },
  { id: 'W002', name: 'Sunita Devi', jobCardNumber: 'JC-2024-002', aadhaar: 'XXXX-XXXX-2345', bankAccount: 'XXXX-XXXX-6789', village: 'Rampur', block: 'Sadar', district: 'Varanasi', skillType: 'Unskilled', workCategory: 'Well Digging', familyMembers: 4, status: 'active', daysWorked: 18, totalWages: 5850, pendingPayment: 1950, phone: '9876XXXX02' },
  { id: 'W003', name: 'Mohan Lal', jobCardNumber: 'JC-2024-003', aadhaar: 'XXXX-XXXX-3456', bankAccount: 'XXXX-XXXX-7890', village: 'Shivpur', block: 'Pindra', district: 'Varanasi', skillType: 'Semi-Skilled', workCategory: 'Plantation', familyMembers: 6, status: 'active', daysWorked: 25, totalWages: 8125, pendingPayment: 0, phone: '9876XXXX03' },
  { id: 'W004', name: 'Geeta Kumari', jobCardNumber: 'JC-2024-004', aadhaar: 'XXXX-XXXX-4567', bankAccount: 'XXXX-XXXX-8901', village: 'Chandpur', block: 'Sadar', district: 'Varanasi', skillType: 'Unskilled', workCategory: 'Road Construction', familyMembers: 3, status: 'inactive', daysWorked: 10, totalWages: 3250, pendingPayment: 3250, phone: '9876XXXX04' },
  { id: 'W005', name: 'Anil Yadav', jobCardNumber: 'JC-2024-005', aadhaar: 'XXXX-XXXX-5678', bankAccount: 'XXXX-XXXX-9012', village: 'Lohta', block: 'Kashi Vidyapeeth', district: 'Varanasi', skillType: 'Skilled', workCategory: 'Water Conservation', familyMembers: 4, status: 'active', daysWorked: 20, totalWages: 6500, pendingPayment: 650, phone: '9876XXXX05' },
  { id: 'W006', name: 'Priya Singh', jobCardNumber: 'JC-2024-006', aadhaar: 'XXXX-XXXX-6789', bankAccount: 'XXXX-XXXX-0123', village: 'Rampur', block: 'Sadar', district: 'Varanasi', skillType: 'Unskilled', workCategory: 'Plantation', familyMembers: 5, status: 'active', daysWorked: 15, totalWages: 4875, pendingPayment: 0, phone: '9876XXXX06' },
  { id: 'W007', name: 'Suresh Patel', jobCardNumber: 'JC-2024-007', aadhaar: 'XXXX-XXXX-7890', bankAccount: 'XXXX-XXXX-1234', village: 'Shivpur', block: 'Pindra', district: 'Varanasi', skillType: 'Semi-Skilled', workCategory: 'Road Construction', familyMembers: 7, status: 'active', daysWorked: 24, totalWages: 7800, pendingPayment: 1300, phone: '9876XXXX07' },
  { id: 'W008', name: 'Kavita Devi', jobCardNumber: 'JC-2024-008', aadhaar: 'XXXX-XXXX-8901', bankAccount: 'XXXX-XXXX-2345', village: 'Lohta', block: 'Kashi Vidyapeeth', district: 'Varanasi', skillType: 'Unskilled', workCategory: 'Well Digging', familyMembers: 4, status: 'active', daysWorked: 19, totalWages: 6175, pendingPayment: 0, phone: '9876XXXX08' },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'A001', workerId: 'W001', workerName: 'Ramesh Kumar', date: '2024-01-15', checkIn: '08:00', checkOut: '17:00', status: 'present', worksite: 'NH-7 Road Extension', gpsVerified: true, photoVerified: true, village: 'Chandpur' },
  { id: 'A002', workerId: 'W002', workerName: 'Sunita Devi', date: '2024-01-15', checkIn: '08:15', checkOut: '17:00', status: 'present', worksite: 'Community Well Project', gpsVerified: true, photoVerified: true, village: 'Rampur' },
  { id: 'A003', workerId: 'W003', workerName: 'Mohan Lal', date: '2024-01-15', checkIn: '08:00', checkOut: '12:00', status: 'half-day', worksite: 'Village Plantation Drive', gpsVerified: true, photoVerified: false, village: 'Shivpur' },
  { id: 'A004', workerId: 'W004', workerName: 'Geeta Kumari', date: '2024-01-15', checkIn: '-', checkOut: '-', status: 'absent', worksite: '-', gpsVerified: false, photoVerified: false, village: 'Chandpur' },
  { id: 'A005', workerId: 'W005', workerName: 'Anil Yadav', date: '2024-01-15', checkIn: '07:45', checkOut: '17:00', status: 'present', worksite: 'Water Conservation Site', gpsVerified: true, photoVerified: true, village: 'Lohta' },
  { id: 'A006', workerId: 'W006', workerName: 'Priya Singh', date: '2024-01-15', checkIn: '08:30', checkOut: '17:00', status: 'present', worksite: 'Village Plantation Drive', gpsVerified: true, photoVerified: true, village: 'Rampur' },
  { id: 'A007', workerId: 'W007', workerName: 'Suresh Patel', date: '2024-01-15', checkIn: '08:00', checkOut: '17:00', status: 'present', worksite: 'NH-7 Road Extension', gpsVerified: true, photoVerified: true, village: 'Shivpur' },
  { id: 'A008', workerId: 'W008', workerName: 'Kavita Devi', date: '2024-01-15', checkIn: '08:10', checkOut: '17:00', status: 'present', worksite: 'Community Well Project', gpsVerified: true, photoVerified: false, village: 'Lohta' },
];

export const reports: Report[] = [
  { id: 'R001', title: 'Daily Attendance Report', type: 'Attendance', generatedDate: '2024-01-15', period: 'Jan 15, 2024', status: 'ready', format: 'PDF' },
  { id: 'R002', title: 'Weekly Wage Report', type: 'Wages', generatedDate: '2024-01-14', period: 'Jan 8-14, 2024', status: 'ready', format: 'Excel' },
  { id: 'R003', title: 'Monthly Work Summary', type: 'Summary', generatedDate: '2024-01-01', period: 'December 2023', status: 'ready', format: 'PDF' },
  { id: 'R004', title: 'Village-wise Employment', type: 'Employment', generatedDate: '2024-01-10', period: 'Q4 2023', status: 'ready', format: 'CSV' },
  { id: 'R005', title: 'Budget Utilization Report', type: 'Budget', generatedDate: '2024-01-12', period: 'FY 2023-24', status: 'generating', format: 'PDF' },
  { id: 'R006', title: 'Payment Delay Report', type: 'Payment', generatedDate: '2024-01-13', period: 'Jan 2024', status: 'ready', format: 'Excel' },
];

export const dashboardStats = {
  totalWorkers: 1247,
  activeWorkers: 983,
  totalWagesDisbursed: 4825000,
  pendingPayments: 725000,
  workCompletionRate: 78.5,
  budgetUtilized: 68.2,
  totalBudget: 12500000,
  averageDaysWorked: 18.5,
};

export const villagePerformance = [
  { village: 'Chandpur', workers: 245, completion: 82, wages: 980000 },
  { village: 'Rampur', workers: 198, completion: 75, wages: 792000 },
  { village: 'Shivpur', workers: 312, completion: 85, wages: 1248000 },
  { village: 'Lohta', workers: 167, completion: 70, wages: 668000 },
  { village: 'Sarnath', workers: 145, completion: 90, wages: 580000 },
  { village: 'Ramnagar', workers: 180, completion: 65, wages: 557000 },
];

export const monthlyWageData = [
  { month: 'Aug', wages: 350000, workers: 780 },
  { month: 'Sep', wages: 420000, workers: 850 },
  { month: 'Oct', wages: 580000, workers: 920 },
  { month: 'Nov', wages: 510000, workers: 890 },
  { month: 'Dec', wages: 620000, workers: 950 },
  { month: 'Jan', wages: 490000, workers: 983 },
];

export const workCategoryData = [
  { name: 'Road Construction', value: 35, color: 'hsl(220, 60%, 22%)' },
  { name: 'Well Digging', value: 20, color: 'hsl(30, 80%, 55%)' },
  { name: 'Plantation', value: 18, color: 'hsl(142, 60%, 40%)' },
  { name: 'Water Conservation', value: 15, color: 'hsl(205, 80%, 50%)' },
  { name: 'Others', value: 12, color: 'hsl(215, 15%, 47%)' },
];
