import { Users, FolderKanban, Wallet, CalendarCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects, mockAlerts, monthlyProgress, attendanceStats, projectStatusDistribution, wageDistribution } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from "recharts";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of MGNREGA scheme progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Workers" value="2,450" icon={Users} variant="primary" trend={{ value: 8.2, label: "vs last month" }} subtitle="Active in current FY" />
          <StatCard title="Active Projects" value="186" icon={FolderKanban} variant="accent" trend={{ value: 12, label: "new this month" }} subtitle="Across 45 blocks" />
          <StatCard title="Wages Disbursed" value="₹4.2 Cr" icon={Wallet} variant="warning" trend={{ value: 15.3, label: "vs last month" }} subtitle="Current financial year" />
          <StatCard title="Attendance Today" value="89%" icon={CalendarCheck} variant="default" trend={{ value: -2.1, label: "vs yesterday" }} subtitle="1,420 / 1,596 present" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Monthly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="workers" stroke="hsl(215, 65%, 36%)" fill="hsl(215, 65%, 36%)" fillOpacity={0.15} name="Workers" />
                  <Area type="monotone" dataKey="projects" stroke="hsl(152, 55%, 40%)" fill="hsl(152, 55%, 40%)" fillOpacity={0.15} name="Projects" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={attendanceStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="hsl(152, 55%, 40%)" radius={[3, 3, 0, 0]} name="Present" />
                  <Bar dataKey="absent" fill="hsl(0, 72%, 51%)" radius={[3, 3, 0, 0]} name="Absent" />
                  <Bar dataKey="halfDay" fill="hsl(38, 92%, 50%)" radius={[3, 3, 0, 0]} name="Half Day" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Project Status</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={projectStatusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {projectStatusDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Wage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={wageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="workers" fill="hsl(215, 65%, 36%)" radius={[3, 3, 0, 0]} name="Workers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlerts.filter((a) => !a.resolved).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2 text-sm border-l-2 border-l-warning pl-3 py-1">
                    <div>
                      <p className="text-foreground leading-tight">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Project</th>
                    <th className="text-left py-2 font-medium">Location</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Progress</th>
                    <th className="text-right py-2 font-medium">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjects.slice(0, 5).map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2.5 font-medium">{p.name}</td>
                      <td className="py-2.5 text-muted-foreground">{p.location}</td>
                      <td className="py-2.5"><StatusBadge status={p.status} /></td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">₹{(p.budget / 100000).toFixed(1)}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
