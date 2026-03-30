import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield } from "lucide-react";
const initialLogs = [
  { id: 1, action: "Worker Added", user: "Panchayat Officer", target: "Ramesh Kumar (W001)", timestamp: "2024-01-15 09:12", level: "info" },
  { id: 2, action: "Attendance Approved", user: "Supervisor", target: "Batch #A-0115", timestamp: "2024-01-15 10:45", level: "info" },
  { id: 3, action: "Payment Released", user: "Admin", target: "₹42,500 — 12 workers", timestamp: "2024-01-14 16:30", level: "success" },
  { id: 4, action: "Login Attempt Failed", user: "Unknown", target: "IP 192.168.1.45", timestamp: "2024-01-14 03:22", level: "warning" },
  { id: 5, action: "Report Exported", user: "Panchayat Officer", target: "Monthly Summary Dec 2023", timestamp: "2024-01-13 14:10", level: "info" },
  { id: 6, action: "Worker Record Updated", user: "Supervisor", target: "Geeta Kumari (W004) — Status changed", timestamp: "2024-01-13 11:05", level: "info" },
  { id: 7, action: "Duplicate Job Card Detected", user: "System", target: "JC-2024-009 flagged", timestamp: "2024-01-12 08:00", level: "warning" },
];

const levelStyle: Record<string, string> = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          Promise.all(initialLogs.map(l => 
            fetch('/api/logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(l) })
          )).then(() => {
            fetch('/api/logs').then(r => r.json()).then(setLogs);
          });
        } else {
          setLogs(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
    <div className="flex items-center gap-3">
      <Shield className="h-6 w-6 text-primary" />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">System activity and security trail</p>
      </div>
    </div>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Target</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.action}</TableCell>
                <TableCell className="text-sm">{l.user}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{l.target}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{l.timestamp}</TableCell>
                <TableCell><Badge variant="outline" className={levelStyle[l.level]}>{l.level}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  );
};

export default AuditLogs;
