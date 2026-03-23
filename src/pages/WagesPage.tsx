import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { mockPayments } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, CheckCircle, Clock, Loader2, Search } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function WagesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockPayments.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSearch = p.workerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPaid = mockPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = mockPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalProcessing = mockPayments.filter((p) => p.status === "processing").reduce((s, p) => s + p.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Wage Management</h1>
          <p className="text-muted-foreground text-sm">Track wage calculation and payment status</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Total Disbursed" value={`₹${totalPaid.toLocaleString()}`} icon={Wallet} variant="primary" />
          <StatCard title="Paid" value={mockPayments.filter((p) => p.status === "paid").length} icon={CheckCircle} variant="accent" />
          <StatCard title="Pending" value={mockPayments.filter((p) => p.status === "pending").length} icon={Clock} variant="warning" />
          <StatCard title="Processing" value={mockPayments.filter((p) => p.status === "processing").length} icon={Loader2} variant="default" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search worker..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">ID</th>
                    <th className="text-left py-2 font-medium">Worker</th>
                    <th className="text-left py-2 font-medium">Project</th>
                    <th className="text-right py-2 font-medium">Days</th>
                    <th className="text-right py-2 font-medium">Amount</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 text-muted-foreground">{p.id}</td>
                      <td className="py-2.5 font-medium">{p.workerName}</td>
                      <td className="py-2.5 text-muted-foreground">{p.projectName}</td>
                      <td className="py-2.5 text-right">{p.daysWorked}</td>
                      <td className="py-2.5 text-right font-medium">₹{p.amount.toLocaleString()}</td>
                      <td className="py-2.5"><StatusBadge status={p.status} /></td>
                      <td className="py-2.5 text-muted-foreground">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardContent className="py-4">
            <p className="text-sm"><strong>Wage Rate:</strong> ₹300/day (Standard MGNREGA rate)</p>
            <p className="text-xs text-muted-foreground mt-1">Half-day attendance is calculated at 50% of daily rate. Wages are processed weekly.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
