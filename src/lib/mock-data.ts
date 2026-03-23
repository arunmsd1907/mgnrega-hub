export type UserRole = "admin" | "officer" | "worker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Worker {
  id: string;
  name: string;
  village: string;
  jobCardNo: string;
  aadhaar: string;
  phone: string;
  status: "active" | "inactive";
  totalDaysWorked: number;
  totalEarnings: number;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: "pending" | "ongoing" | "completed";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  workersAssigned: number;
  progress: number;
  lat?: number;
  lng?: number;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  date: string;
  status: "present" | "absent" | "half-day";
  projectId: string;
  projectName: string;
  verifiedBy: string;
}

export interface Payment {
  id: string;
  workerId: string;
  workerName: string;
  amount: number;
  status: "paid" | "pending" | "processing";
  date: string;
  daysWorked: number;
  projectName: string;
}

export interface Alert {
  id: string;
  type: "anomaly" | "delay" | "inactive";
  message: string;
  severity: "high" | "medium" | "low";
  date: string;
  resolved: boolean;
}

export const mockUser: User = { id: "1", name: "Rajesh Kumar", email: "admin@mgnrega.gov.in", role: "admin" };

export const mockWorkers: Worker[] = [
  { id: "W001", name: "Ramesh Yadav", village: "Sundarpur", jobCardNo: "JC-2024-001", aadhaar: "XXXX-XXXX-1234", phone: "98765XXXXX", status: "active", totalDaysWorked: 85, totalEarnings: 25500 },
  { id: "W002", name: "Sita Devi", village: "Rampur", jobCardNo: "JC-2024-002", aadhaar: "XXXX-XXXX-5678", phone: "98765XXXXX", status: "active", totalDaysWorked: 72, totalEarnings: 21600 },
  { id: "W003", name: "Mohan Lal", village: "Krishnapur", jobCardNo: "JC-2024-003", aadhaar: "XXXX-XXXX-9012", phone: "98765XXXXX", status: "active", totalDaysWorked: 90, totalEarnings: 27000 },
  { id: "W004", name: "Geeta Sharma", village: "Sundarpur", jobCardNo: "JC-2024-004", aadhaar: "XXXX-XXXX-3456", phone: "98765XXXXX", status: "inactive", totalDaysWorked: 45, totalEarnings: 13500 },
  { id: "W005", name: "Lakshmi Prasad", village: "Gopalpur", jobCardNo: "JC-2024-005", aadhaar: "XXXX-XXXX-7890", phone: "98765XXXXX", status: "active", totalDaysWorked: 68, totalEarnings: 20400 },
  { id: "W006", name: "Bhola Nath", village: "Rampur", jobCardNo: "JC-2024-006", aadhaar: "XXXX-XXXX-2345", phone: "98765XXXXX", status: "active", totalDaysWorked: 55, totalEarnings: 16500 },
  { id: "W007", name: "Meena Kumari", village: "Krishnapur", jobCardNo: "JC-2024-007", aadhaar: "XXXX-XXXX-6789", phone: "98765XXXXX", status: "active", totalDaysWorked: 78, totalEarnings: 23400 },
  { id: "W008", name: "Suresh Patel", village: "Gopalpur", jobCardNo: "JC-2024-008", aadhaar: "XXXX-XXXX-0123", phone: "98765XXXXX", status: "active", totalDaysWorked: 62, totalEarnings: 18600 },
];

export const mockProjects: Project[] = [
  { id: "P001", name: "Village Road Construction", location: "Sundarpur, Block-A", status: "ongoing", startDate: "2024-01-15", endDate: "2024-06-30", budget: 500000, spent: 320000, workersAssigned: 25, progress: 64 },
  { id: "P002", name: "Pond Renovation", location: "Rampur, Block-B", status: "completed", startDate: "2024-02-01", endDate: "2024-05-15", budget: 300000, spent: 285000, workersAssigned: 15, progress: 100 },
  { id: "P003", name: "School Boundary Wall", location: "Krishnapur, Block-A", status: "ongoing", startDate: "2024-03-10", endDate: "2024-08-20", budget: 200000, spent: 95000, workersAssigned: 12, progress: 47 },
  { id: "P004", name: "Canal Desilting Work", location: "Gopalpur, Block-C", status: "pending", startDate: "2024-07-01", endDate: "2024-10-30", budget: 450000, spent: 0, workersAssigned: 0, progress: 0 },
  { id: "P005", name: "Plantation Drive", location: "Sundarpur, Block-A", status: "ongoing", startDate: "2024-04-01", endDate: "2024-09-30", budget: 150000, spent: 78000, workersAssigned: 20, progress: 52 },
  { id: "P006", name: "Community Hall Repair", location: "Rampur, Block-B", status: "completed", startDate: "2024-01-01", endDate: "2024-04-15", budget: 350000, spent: 340000, workersAssigned: 18, progress: 100 },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "A001", workerId: "W001", workerName: "Ramesh Yadav", date: "2024-06-10", status: "present", projectId: "P001", projectName: "Village Road Construction", verifiedBy: "Officer Sharma" },
  { id: "A002", workerId: "W002", workerName: "Sita Devi", date: "2024-06-10", status: "present", projectId: "P001", projectName: "Village Road Construction", verifiedBy: "Officer Sharma" },
  { id: "A003", workerId: "W003", workerName: "Mohan Lal", date: "2024-06-10", status: "absent", projectId: "P003", projectName: "School Boundary Wall", verifiedBy: "Officer Gupta" },
  { id: "A004", workerId: "W005", workerName: "Lakshmi Prasad", date: "2024-06-10", status: "half-day", projectId: "P005", projectName: "Plantation Drive", verifiedBy: "Officer Singh" },
  { id: "A005", workerId: "W006", workerName: "Bhola Nath", date: "2024-06-10", status: "present", projectId: "P001", projectName: "Village Road Construction", verifiedBy: "Officer Sharma" },
  { id: "A006", workerId: "W007", workerName: "Meena Kumari", date: "2024-06-10", status: "present", projectId: "P003", projectName: "School Boundary Wall", verifiedBy: "Officer Gupta" },
  { id: "A007", workerId: "W008", workerName: "Suresh Patel", date: "2024-06-10", status: "present", projectId: "P005", projectName: "Plantation Drive", verifiedBy: "Officer Singh" },
];

export const mockPayments: Payment[] = [
  { id: "PAY001", workerId: "W001", workerName: "Ramesh Yadav", amount: 8500, status: "paid", date: "2024-06-01", daysWorked: 28, projectName: "Village Road Construction" },
  { id: "PAY002", workerId: "W002", workerName: "Sita Devi", amount: 7200, status: "paid", date: "2024-06-01", daysWorked: 24, projectName: "Village Road Construction" },
  { id: "PAY003", workerId: "W003", workerName: "Mohan Lal", amount: 9000, status: "pending", date: "2024-06-01", daysWorked: 30, projectName: "School Boundary Wall" },
  { id: "PAY004", workerId: "W005", workerName: "Lakshmi Prasad", amount: 6800, status: "processing", date: "2024-06-01", daysWorked: 22, projectName: "Plantation Drive" },
  { id: "PAY005", workerId: "W006", workerName: "Bhola Nath", amount: 5500, status: "paid", date: "2024-06-01", daysWorked: 18, projectName: "Village Road Construction" },
  { id: "PAY006", workerId: "W007", workerName: "Meena Kumari", amount: 7800, status: "pending", date: "2024-06-01", daysWorked: 26, projectName: "School Boundary Wall" },
  { id: "PAY007", workerId: "W008", workerName: "Suresh Patel", amount: 6200, status: "processing", date: "2024-06-01", daysWorked: 20, projectName: "Plantation Drive" },
];

export const mockAlerts: Alert[] = [
  { id: "AL001", type: "anomaly", message: "Duplicate attendance detected for Worker W004 on 2024-06-08", severity: "high", date: "2024-06-09", resolved: false },
  { id: "AL002", type: "delay", message: "Payment pending for 15+ days for 3 workers in Project P003", severity: "medium", date: "2024-06-10", resolved: false },
  { id: "AL003", type: "inactive", message: "Project P004 has no activity for 30 days", severity: "low", date: "2024-06-05", resolved: false },
  { id: "AL004", type: "anomaly", message: "Unusual attendance pattern: 100% attendance for all workers in P001 for 14 consecutive days", severity: "medium", date: "2024-06-08", resolved: true },
];

export const monthlyProgress = [
  { month: "Jan", workers: 45, projects: 4, wages: 180000 },
  { month: "Feb", workers: 52, projects: 5, wages: 210000 },
  { month: "Mar", workers: 60, projects: 6, wages: 245000 },
  { month: "Apr", workers: 58, projects: 6, wages: 235000 },
  { month: "May", workers: 65, projects: 5, wages: 268000 },
  { month: "Jun", workers: 70, projects: 6, wages: 290000 },
];

export const attendanceStats = [
  { day: "Mon", present: 58, absent: 8, halfDay: 4 },
  { day: "Tue", present: 62, absent: 5, halfDay: 3 },
  { day: "Wed", present: 55, absent: 10, halfDay: 5 },
  { day: "Thu", present: 60, absent: 7, halfDay: 3 },
  { day: "Fri", present: 64, absent: 4, halfDay: 2 },
  { day: "Sat", present: 50, absent: 15, halfDay: 5 },
];

export const projectStatusDistribution = [
  { name: "Completed", value: 2, fill: "hsl(152, 55%, 40%)" },
  { name: "Ongoing", value: 3, fill: "hsl(200, 80%, 50%)" },
  { name: "Pending", value: 1, fill: "hsl(38, 92%, 50%)" },
];

export const wageDistribution = [
  { range: "₹0-5k", workers: 5 },
  { range: "₹5k-10k", workers: 18 },
  { range: "₹10k-15k", workers: 25 },
  { range: "₹15k-20k", workers: 15 },
  { range: "₹20k-25k", workers: 8 },
  { range: "₹25k+", workers: 4 },
];
