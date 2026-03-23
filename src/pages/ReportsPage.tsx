import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText } from "lucide-react";
import { monthlyProgress, attendanceStats, projectStatusDistribution, wageDistribution } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

export default function ReportsPage() {
  const exportCSV = () => {
    const headers = "Month,Workers,Projects,Wages\n";
    const rows = monthlyProgress.map((r) => `${r.month},${r.workers},${r.projects},${r.wages}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mgnrega_report.csv";
    a.click();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground text-sm">Generate and export scheme reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />Export CSV
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />Generate PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-medium">Wage Trends (Monthly)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="wages" stroke="hsl(215, 65%, 36%)" strokeWidth={2} dot={{ r: 4 }} name="Wages (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-medium">Worker Engagement</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="workers" fill="hsl(152, 55%, 40%)" radius={[4, 4, 0, 0]} name="Active Workers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-medium">Project Distribution</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={projectStatusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {projectStatusDistribution.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-medium">Wage Range Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={wageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="workers" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Workers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="py-4">
            <h3 className="font-medium text-sm mb-2">Summary Statistics (Current FY)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">Total Workers</p><p className="font-bold text-lg">2,450</p></div>
              <div><p className="text-muted-foreground">Active Projects</p><p className="font-bold text-lg">186</p></div>
              <div><p className="text-muted-foreground">Total Man-days</p><p className="font-bold text-lg">1,42,800</p></div>
              <div><p className="text-muted-foreground">Wages Paid</p><p className="font-bold text-lg">₹4.2 Cr</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
