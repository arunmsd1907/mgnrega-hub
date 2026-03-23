import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { mockWorkers, Worker } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, UserCheck, UserX } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Users } from "lucide-react";

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: "", village: "", jobCardNo: "", aadhaar: "", phone: "" });

  const filtered = workers.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) || w.village.toLowerCase().includes(search.toLowerCase()) || w.jobCardNo.toLowerCase().includes(search.toLowerCase())
  );

  const addWorker = () => {
    if (!newWorker.name.trim()) return;
    const w: Worker = {
      id: `W${String(workers.length + 1).padStart(3, "0")}`,
      ...newWorker,
      status: "active",
      totalDaysWorked: 0,
      totalEarnings: 0,
    };
    setWorkers([...workers, w]);
    setNewWorker({ name: "", village: "", jobCardNo: "", aadhaar: "", phone: "" });
    setDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    setWorkers(workers.map((w) => (w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w)));
  };

  const active = workers.filter((w) => w.status === "active").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Worker Management</h1>
            <p className="text-muted-foreground text-sm">Manage registered MGNREGA workers</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Worker</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Register New Worker</DialogTitle></DialogHeader>
              <div className="space-y-3">
                {(["name", "village", "jobCardNo", "aadhaar", "phone"] as const).map((f) => (
                  <div key={f} className="space-y-1">
                    <Label className="capitalize">{f === "jobCardNo" ? "Job Card No." : f === "aadhaar" ? "Aadhaar No." : f}</Label>
                    <Input value={newWorker[f]} onChange={(e) => setNewWorker({ ...newWorker, [f]: e.target.value })} />
                  </div>
                ))}
                <Button onClick={addWorker} className="w-full">Register Worker</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Workers" value={workers.length} icon={Users} variant="primary" />
          <StatCard title="Active" value={active} icon={UserCheck} variant="accent" />
          <StatCard title="Inactive" value={workers.length - active} icon={UserX} variant="warning" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, village, or job card..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">ID</th>
                    <th className="text-left py-2 font-medium">Name</th>
                    <th className="text-left py-2 font-medium">Village</th>
                    <th className="text-left py-2 font-medium">Job Card</th>
                    <th className="text-left py-2 font-medium">Aadhaar</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">Days</th>
                    <th className="text-right py-2 font-medium">Earnings</th>
                    <th className="text-right py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((w) => (
                    <tr key={w.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 text-muted-foreground">{w.id}</td>
                      <td className="py-2.5 font-medium">{w.name}</td>
                      <td className="py-2.5 text-muted-foreground">{w.village}</td>
                      <td className="py-2.5">{w.jobCardNo}</td>
                      <td className="py-2.5 text-muted-foreground">{w.aadhaar}</td>
                      <td className="py-2.5"><StatusBadge status={w.status} /></td>
                      <td className="py-2.5 text-right">{w.totalDaysWorked}</td>
                      <td className="py-2.5 text-right">₹{w.totalEarnings.toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        <Button variant="ghost" size="sm" onClick={() => toggleStatus(w.id)}>
                          {w.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No workers found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
