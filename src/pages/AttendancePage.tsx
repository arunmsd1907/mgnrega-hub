import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { mockAttendance, mockWorkers, mockProjects, AttendanceRecord } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, UserCheck, UserX, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedDate, setSelectedDate] = useState("2024-06-10");
  const [selectedProject, setSelectedProject] = useState("all");

  const filtered = attendance.filter((a) => {
    const matchDate = a.date === selectedDate;
    const matchProject = selectedProject === "all" || a.projectId === selectedProject;
    return matchDate && matchProject;
  });

  const present = filtered.filter((a) => a.status === "present").length;
  const absent = filtered.filter((a) => a.status === "absent").length;
  const halfDay = filtered.filter((a) => a.status === "half-day").length;

  const markAttendance = (id: string, status: "present" | "absent" | "half-day") => {
    setAttendance(attendance.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Attendance Tracking</h1>
          <p className="text-muted-foreground text-sm">Daily worker attendance management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Total Marked" value={filtered.length} icon={CalendarCheck} variant="primary" />
          <StatCard title="Present" value={present} icon={UserCheck} variant="accent" />
          <StatCard title="Absent" value={absent} icon={UserX} variant="warning" />
          <StatCard title="Half Day" value={halfDay} icon={Clock} variant="default" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-[180px]" />
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[220px]"><SelectValue placeholder="All Projects" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {mockProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Worker</th>
                    <th className="text-left py-2 font-medium">Project</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Verified By</th>
                    <th className="text-right py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{a.workerName}</td>
                      <td className="py-2.5 text-muted-foreground">{a.projectName}</td>
                      <td className="py-2.5"><StatusBadge status={a.status} /></td>
                      <td className="py-2.5 text-muted-foreground">{a.verifiedBy}</td>
                      <td className="py-2.5 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant={a.status === "present" ? "default" : "outline"} size="sm" onClick={() => markAttendance(a.id, "present")} className="text-xs h-7">P</Button>
                          <Button variant={a.status === "absent" ? "destructive" : "outline"} size="sm" onClick={() => markAttendance(a.id, "absent")} className="text-xs h-7">A</Button>
                          <Button variant={a.status === "half-day" ? "secondary" : "outline"} size="sm" onClick={() => markAttendance(a.id, "half-day")} className="text-xs h-7">H</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No attendance records for selected filters</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
