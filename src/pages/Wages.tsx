import { useState, useEffect } from "react";
import { workers as initialWorkers, Worker } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, Clock, Pencil, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Wages = () => {
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editWorker, setEditWorker] = useState<Worker | null>(null);
  const wageRate = 325;

  useEffect(() => {
    fetch('/api/workers')
      .then(res => res.json())
      .then(data => {
        setWorkerList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast({ title: "Error", description: "Failed to load wage data from server.", variant: "destructive" });
      });
  }, []);

  const totalDisbursed = workerList.reduce((a, w) => a + w.totalWages - w.pendingPayment, 0);
  const totalPending = workerList.reduce((a, w) => a + w.pendingPayment, 0);

  const handleSave = async () => {
    if (!editWorker) return;
    try {
      const res = await fetch(`/api/workers/${editWorker.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editWorker)
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || 'Failed to update');
      setWorkerList(workerList.map((w) => w.id === updated.id ? updated : w));
      toast({ title: "Payment Updated", description: `${updated.name}'s wage details saved permanently.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save wage details.", variant: "destructive" });
    }
    setEditWorker(null);
  };

  const handleApprovePayment = async (w: Worker) => {
    try {
      const res = await fetch(`/api/workers/${w.id}/disburse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: w.pendingPayment })
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || 'Failed to disburse');
      setWorkerList(workerList.map((wk) => wk.id === w.id ? updated : wk));
      toast({ title: "Payment Approved", description: `₹${w.pendingPayment.toLocaleString()} released to ${w.name}.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Payment disbursement failed.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wages & Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Current state wage rate: ₹{wageRate}/day</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-success"><CardContent className="pt-4 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Disbursed</p><p className="text-2xl font-bold text-foreground">₹{totalDisbursed.toLocaleString()}</p></CardContent></Card>
        <Card className="border-l-4 border-l-warning"><CardContent className="pt-4 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p><p className="text-2xl font-bold text-foreground">₹{totalPending.toLocaleString()}</p></CardContent></Card>
        <Card className="border-l-4 border-l-info"><CardContent className="pt-4 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Days Worked</p><p className="text-2xl font-bold text-foreground">{(workerList.reduce((a, w) => a + w.daysWorked, 0) / workerList.length).toFixed(1)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Worker Wage Details</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Days Worked</TableHead>
                  <TableHead>Total Wages</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workerList.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.name}</TableCell>
                    <TableCell>{w.daysWorked}</TableCell>
                    <TableCell className="font-semibold">₹{w.totalWages.toLocaleString()}</TableCell>
                    <TableCell className="text-success">₹{(w.totalWages - w.pendingPayment).toLocaleString()}</TableCell>
                    <TableCell className="text-destructive font-medium">₹{w.pendingPayment.toLocaleString()}</TableCell>
                    <TableCell>
                      {w.pendingPayment === 0 ? (
                        <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>
                      ) : (
                        <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditWorker({ ...w })}><Pencil className="h-3.5 w-3.5" /></Button>
                        {w.pendingPayment > 0 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-success" onClick={() => handleApprovePayment(w)} title="Approve Payment"><CheckCircle className="h-3.5 w-3.5" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editWorker} onOpenChange={() => setEditWorker(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Wage Details — {editWorker?.name}</DialogTitle></DialogHeader>
          {editWorker && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Days Worked</Label><Input type="number" value={editWorker.daysWorked} onChange={(e) => setEditWorker({ ...editWorker, daysWorked: parseInt(e.target.value) || 0 })} /></div>
              <div className="space-y-1.5"><Label>Total Wages (₹)</Label><Input type="number" value={editWorker.totalWages} onChange={(e) => setEditWorker({ ...editWorker, totalWages: parseInt(e.target.value) || 0 })} /></div>
              <div className="space-y-1.5"><Label>Pending Payment (₹)</Label><Input type="number" value={editWorker.pendingPayment} onChange={(e) => setEditWorker({ ...editWorker, pendingPayment: parseInt(e.target.value) || 0 })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWorker(null)}>Cancel</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" />Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wages;
