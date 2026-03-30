import { useState, useEffect } from "react";
import { workers as initialWorkers, Worker } from "@/data/mockData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Download, Eye, Pencil, Trash2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const emptyWorker: Worker = {
  id: '', name: '', jobCardNumber: '', aadhaar: '', bankAccount: '', village: '', block: '', district: '', skillType: 'Unskilled', workCategory: 'Road Construction', familyMembers: 0, status: 'active', daysWorked: 0, totalWages: 0, pendingPayment: 0, phone: '',
};

const Workers = () => {
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [villageFilter, setVillageFilter] = useState("all");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [editWorker, setEditWorker] = useState<Worker | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetch('/api/workers')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          toast({ title: "Initializing", description: "Setting up database first time..." });
          Promise.all(initialWorkers.map(w => 
            fetch('/api/workers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(w)
            })
          )).then(() => {
            fetch('/api/workers').then(r => r.json()).then(seededData => {
              setWorkerList(seededData);
              setLoading(false);
              toast({ title: "Ready", description: "Database loaded with initial records." });
            });
          });
        } else {
          setWorkerList(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast({ title: "Connection Error", description: "Failed to load workers from server.", variant: "destructive" });
      });
  }, []);

  const villages = [...new Set(workerList.map((w) => w.village))];
  const filtered = workerList.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.jobCardNumber.toLowerCase().includes(search.toLowerCase());
    const matchVillage = villageFilter === "all" || w.village === villageFilter;
    return matchSearch && matchVillage;
  });

  const handleSave = async () => {
    if (!editWorker) return;
    if (isAdding) {
      const uniqueId = `W${Date.now().toString().slice(-6)}`;
      const newWorker = { ...editWorker, id: uniqueId };
      try {
        const res = await fetch('/api/workers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWorker)
        });
        const saved = await res.json();
        if (!res.ok) throw new Error(saved.message || 'Failed to save');
        setWorkerList([saved, ...workerList]);
        toast({ title: "Worker Added", description: `${saved.name} has been registered permanently.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to save to database.", variant: "destructive" });
      }
    } else {
      try {
        const res = await fetch(`/api/workers/${editWorker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editWorker)
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.message || 'Failed to update');
        setWorkerList(workerList.map((w) => w.id === updated.id ? updated : w));
        toast({ title: "Worker Updated", description: `${updated.name}'s details saved to database.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to update database.", variant: "destructive" });
      }
    }
    setEditWorker(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/workers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const w = workerList.find((w) => w.id === id);
      setWorkerList(workerList.filter((w) => w.id !== id));
      setSelectedWorker(null);
      toast({ title: "Worker Removed", description: `${w?.name} has been permanently deleted.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete from database.", variant: "destructive" });
    }
  };

  const updateField = (field: keyof Worker, value: string | number) => {
    if (editWorker) setEditWorker({ ...editWorker, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Worker Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{workerList.length} registered workers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
          <Button size="sm" className="bg-primary" onClick={() => { setEditWorker({ ...emptyWorker }); setIsAdding(true); }}><Plus className="h-4 w-4 mr-1" />Add Worker</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or job card..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={villageFilter} onValueChange={setVillageFilter}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Villages" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Villages</SelectItem>
                {villages.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Card</TableHead>
                  <TableHead className="hidden md:table-cell">Village</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{w.jobCardNumber}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{w.village}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{w.workCategory}</TableCell>
                    <TableCell className="font-semibold">{w.daysWorked}</TableCell>
                    <TableCell>
                      <Badge variant={w.status === 'active' ? 'default' : 'secondary'} className={w.status === 'active' ? 'bg-success text-success-foreground' : ''}>{w.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedWorker(w)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditWorker({ ...w }); setIsAdding(false); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(w.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{selectedWorker?.name}</DialogTitle></DialogHeader>
          {selectedWorker && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground text-xs">Job Card</p><p className="font-medium">{selectedWorker.jobCardNumber}</p></div>
              <div><p className="text-muted-foreground text-xs">Aadhaar</p><p className="font-medium">{selectedWorker.aadhaar}</p></div>
              <div><p className="text-muted-foreground text-xs">Bank Account</p><p className="font-medium">{selectedWorker.bankAccount}</p></div>
              <div><p className="text-muted-foreground text-xs">Village / Block</p><p className="font-medium">{selectedWorker.village} / {selectedWorker.block}</p></div>
              <div><p className="text-muted-foreground text-xs">District</p><p className="font-medium">{selectedWorker.district}</p></div>
              <div><p className="text-muted-foreground text-xs">Skill Type</p><p className="font-medium">{selectedWorker.skillType}</p></div>
              <div><p className="text-muted-foreground text-xs">Work Category</p><p className="font-medium">{selectedWorker.workCategory}</p></div>
              <div><p className="text-muted-foreground text-xs">Family Members</p><p className="font-medium">{selectedWorker.familyMembers}</p></div>
              <div><p className="text-muted-foreground text-xs">Days Worked</p><p className="font-semibold">{selectedWorker.daysWorked}</p></div>
              <div><p className="text-muted-foreground text-xs">Total Wages</p><p className="font-semibold">₹{selectedWorker.totalWages.toLocaleString()}</p></div>
              <div><p className="text-muted-foreground text-xs">Pending Payment</p><p className="font-semibold text-destructive">₹{selectedWorker.pendingPayment.toLocaleString()}</p></div>
              <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{selectedWorker.phone}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditWorker({ ...selectedWorker! }); setSelectedWorker(null); setIsAdding(false); }}><Pencil className="h-4 w-4 mr-1" />Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Dialog */}
      <Dialog open={!!editWorker} onOpenChange={() => { setEditWorker(null); setIsAdding(false); }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isAdding ? "Add New Worker" : "Edit Worker"}</DialogTitle></DialogHeader>
          {editWorker && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Name</Label><Input value={editWorker.name} onChange={(e) => updateField('name', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Job Card No.</Label><Input value={editWorker.jobCardNumber} onChange={(e) => updateField('jobCardNumber', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Aadhaar (Masked)</Label><Input value={editWorker.aadhaar} onChange={(e) => updateField('aadhaar', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Bank Account</Label><Input value={editWorker.bankAccount} onChange={(e) => updateField('bankAccount', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Village</Label><Input value={editWorker.village} onChange={(e) => updateField('village', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Block</Label><Input value={editWorker.block} onChange={(e) => updateField('block', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>District</Label><Input value={editWorker.district} onChange={(e) => updateField('district', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={editWorker.phone} onChange={(e) => updateField('phone', e.target.value)} /></div>
              <div className="space-y-1.5">
                <Label>Skill Type</Label>
                <Select value={editWorker.skillType} onValueChange={(v) => updateField('skillType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Skilled">Skilled</SelectItem>
                    <SelectItem value="Semi-Skilled">Semi-Skilled</SelectItem>
                    <SelectItem value="Unskilled">Unskilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Work Category</Label>
                <Select value={editWorker.workCategory} onValueChange={(v) => updateField('workCategory', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Road Construction">Road Construction</SelectItem>
                    <SelectItem value="Well Digging">Well Digging</SelectItem>
                    <SelectItem value="Plantation">Plantation</SelectItem>
                    <SelectItem value="Water Conservation">Water Conservation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Family Members</Label><Input type="number" value={editWorker.familyMembers} onChange={(e) => updateField('familyMembers', parseInt(e.target.value) || 0)} /></div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editWorker.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditWorker(null); setIsAdding(false); }}>Cancel</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" />{isAdding ? "Add Worker" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workers;
