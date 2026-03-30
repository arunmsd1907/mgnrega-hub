import { useState, useEffect } from "react";
import { Users, UserCheck, IndianRupee, Clock, TrendingUp, Target } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, villagePerformance, monthlyWageData, workCategoryData } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWorkers: dashboardStats.totalWorkers,
    activeWorkers: dashboardStats.activeWorkers,
    totalWagesDisbursed: dashboardStats.totalWagesDisbursed,
    pendingPayments: dashboardStats.pendingPayments,
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({
          ...prev,
          totalWorkers: data.totalWorkers || prev.totalWorkers,
          activeWorkers: data.activeWorkers || prev.activeWorkers,
          pendingPayments: data.pendingPayments !== undefined ? data.pendingPayments : prev.pendingPayments,
          totalWagesDisbursed: data.totalWagesDisbursed !== undefined ? data.totalWagesDisbursed : prev.totalWagesDisbursed,
        }));
      })
      .catch(err => console.error("Failed to fetch dashboard stats", err));
  }, []);

  const formatCurrency = (val: number) =>
    `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          MGNREGA Monitoring — Varanasi District • FY 2023-24
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Workers" value={stats.totalWorkers.toLocaleString()} icon={Users} gradient="stat-card-gradient" trend={{ value: 5.2, positive: true }} />
        <StatCard title="Active Workers" value={stats.activeWorkers.toLocaleString()} icon={UserCheck} gradient="saffron-gradient" subtitle={`${((stats.activeWorkers / stats.totalWorkers) * 100).toFixed(1)}% active rate`} />
        <StatCard title="Wages Disbursed" value={formatCurrency(stats.totalWagesDisbursed)} icon={IndianRupee} gradient="success-gradient" trend={{ value: 12.3, positive: true }} />
        <StatCard title="Pending Payments" value={formatCurrency(stats.pendingPayments)} icon={Clock} gradient="warning-gradient" subtitle="Updates live from API" />
        <StatCard title="Completion Rate" value={`${dashboardStats.workCompletionRate}%`} icon={TrendingUp} gradient="info-gradient" trend={{ value: 3.1, positive: true }} />
        <StatCard title="Budget Utilized" value={`${dashboardStats.budgetUtilized}%`} icon={Target} gradient="stat-card-gradient" subtitle={`of ₹1.25Cr`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Wage Disbursement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyWageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Wages']} />
                <Bar dataKey="wages" fill="hsl(220, 60%, 22%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Work Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={workCategoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value}%)`}>
                  {workCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Village Performance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Village-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {villagePerformance.map((v) => (
              <div key={v.village} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-foreground">{v.village}</span>
                <div className="flex-1">
                  <Progress value={v.completion} className="h-2" />
                </div>
                <span className="text-sm font-semibold text-foreground w-12 text-right">{v.completion}%</span>
                <Badge variant="secondary" className="text-xs w-20 justify-center">
                  {v.workers} workers
                </Badge>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  ₹{(v.wages / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
