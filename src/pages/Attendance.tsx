import { useState, useEffect } from "react";
import { attendanceRecords as initialRecords, AttendanceRecord } from "@/data/mockData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, CheckCircle, XCircle, Pencil, Trash2, Save, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  present: "bg-success text-success-foreground",
  absent: "bg-destructive text-destructive-foreground",
  "half-day": "bg-warning text-warning-foreground",
};

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetch('/api/attendance')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          toast({ title: "Initializing", description: "Seeding attendance data..." });
          Promise.all(initialRecords.map(r => 
            fetch('/api/attendance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(r)
            })
          )).then(() => {
            fetch('/api/attendance').then(res => res.json()).then(seededData => {
              setRecords(seededData);
              setLoading(false);
            });
          });
        } else {
          setRecords(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast({ title: "Error", description: "Failed to load attendance records.", variant: "destructive" });
      });
  }, []);

  const filtered = records.filter((r) => r.workerName.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!editRecord) return;
    if (isAdding) {
      const uniqueId = `A${Date.now().toString().slice(-6)}`;
      const newRec = { ...editRecord, id: uniqueId };
      try {
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRec)
        });
        const saved = await res.json();
        if (!res.ok) throw new Error(saved.message || 'Failed to save');
        setRecords([saved, ...records]);
        toast({ title: "Attendance Recorded", description: `${saved.workerName}'s attendance has been added.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to save record.", variant: "destructive" });
      }
    } else {
      try {
        const res = await fetch(`/api/attendance/${editRecord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editRecord)
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.message || 'Failed to update');
        setRecords(records.map((r) => r.id === updated.id ? updated : r));
        toast({ title: "Attendance Updated", description: `Record for ${updated.workerName} updated.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to update record.", variant: "destructive" });
      }
    }
    setEditRecord(null); setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const r = records.find((r) => r.id === id);
      setRecords(records.filter((r) => r.id !== id));
      toast({ title: "Record Deleted", description: `Attendance for ${r?.workerName} removed.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete record.", variant: "destructive" });
    }
  };

  const emptyRecord: AttendanceRecord = { id: '', workerId: '', workerName: '', date: new Date().toISOString().split('T')[0], checkIn: '08:00', checkOut: '17:00', status: 'present', worksite: '', gpsVerified: false, photoVerified: false, village: '' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">Geo-verified attendance records</p>
        </div>
        <Button size="sm" className="bg-primary" onClick={() => { setEditRecord({ ...emptyRecord }); setIsAdding(true); }}><Plus className="h-4 w-4 mr-1" />Mark Attendance</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-success"><CardContent className="pt-4 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wider">Present</p><p className="text-2xl font-bold text-foreground">{records.filter(r => r.status === 'present').length}</p></CardContent></Card>
        <Card className="border-l-4 border-l-destructive"><CardContent className="pt-4 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wider">Absent</p><p className="text-2xl font-bold text-foreground">{records.filter(r => r.status === 'absent').length}</p></CardContent></Card>
        <Card className="border-l-4 border-l-warning"><CardContent className="pt-4 pb-3"><p className="text-xs text-muted-foreground uppercase tracking-wider">Half Day</p><p className="text-2xl font-bold text-foreground">{records.filter(r => r.status === 'half-day').length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search worker..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Check In/Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Worksite</TableHead>
                  <TableHead className="text-center">GPS</TableHead>
                  <TableHead className="text-center">Photo</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.workerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{r.checkIn} - {r.checkOut}</TableCell>
                    <TableCell><Badge className={statusStyles[r.status]}>{r.status}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{r.worksite}</TableCell>
                    <TableCell className="text-center">{r.gpsVerified ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-destructive mx-auto" />}</TableCell>
                    <TableCell className="text-center">{r.photoVerified ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditRecord({ ...r }); setIsAdding(false); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editRecord} onOpenChange={() => { setEditRecord(null); setIsAdding(false); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{isAdding ? "Mark Attendance" : "Edit Attendance"}</DialogTitle></DialogHeader>
          {editRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Worker Name</Label><Input value={editRecord.workerName} onChange={(e) => setEditRecord({ ...editRecord, workerName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={editRecord.date} onChange={(e) => setEditRecord({ ...editRecord, date: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Check In</Label><Input type="time" value={editRecord.checkIn} onChange={(e) => setEditRecord({ ...editRecord, checkIn: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Check Out</Label><Input type="time" value={editRecord.checkOut} onChange={(e) => setEditRecord({ ...editRecord, checkOut: e.target.value })} /></div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editRecord.status} onValueChange={(v: 'present' | 'absent' | 'half-day') => setEditRecord({ ...editRecord, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Worksite</Label><Input value={editRecord.worksite} onChange={(e) => setEditRecord({ ...editRecord, worksite: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Village</Label><Input value={editRecord.village} onChange={(e) => setEditRecord({ ...editRecord, village: e.target.value })} /></div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between"><Label>GPS Verified</Label><Switch checked={editRecord.gpsVerified} onCheckedChange={(v) => setEditRecord({ ...editRecord, gpsVerified: v })} /></div>
                <div className="flex items-center justify-between"><Label>Photo Verified</Label><Switch checked={editRecord.photoVerified} onCheckedChange={(v) => setEditRecord({ ...editRecord, photoVerified: v })} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditRecord(null); setIsAdding(false); }}>Cancel</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" />{isAdding ? "Record" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
