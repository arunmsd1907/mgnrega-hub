import { useState, useEffect } from "react";
import { reports as initialReports, Report } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Plus, Loader2, Pencil, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formatBadge: Record<string, string> = {
  PDF: "bg-destructive/10 text-destructive border-destructive/20",
  Excel: "bg-success/10 text-success border-success/20",
  CSV: "bg-info/10 text-info border-info/20",
};

const emptyReport: Report = { id: '', title: '', type: '', generatedDate: new Date().toISOString().split('T')[0], period: '', status: 'generating', format: 'PDF' };

const Reports = () => {
  const [reportList, setReportList] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          toast({ title: "Initializing", description: "Seeding reports history..." });
          Promise.all(initialReports.map(r => 
            fetch('/api/reports', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(r)
            })
          )).then(() => {
            fetch('/api/reports').then(r => r.json()).then(seededData => {
              setReportList(seededData);
              setLoading(false);
            });
          });
        } else {
          setReportList(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast({ title: "Error", description: "Failed to load reports.", variant: "destructive" });
      });
  }, []);

  const handleSave = async () => {
    if (!editReport) return;
    if (isAdding) {
      const uniqueId = `R${Date.now().toString().slice(-6)}`;
      const newReport = { ...editReport, id: uniqueId };
      try {
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReport)
        });
        const saved = await res.json();
        if (!res.ok) throw new Error(saved.message || 'Failed to save');
        setReportList([saved, ...reportList]);
        toast({ title: "Report Created", description: `${saved.title} is being generated.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to create report.", variant: "destructive" });
      }
    } else {
      try {
        const res = await fetch(`/api/reports/${editReport.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editReport)
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.message || 'Failed to update');
        setReportList(reportList.map(r => r.id === updated.id ? updated : r));
        toast({ title: "Report Updated", description: `${updated.title} has been saved.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to update report.", variant: "destructive" });
      }
    }
    setEditReport(null); setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      const r = reportList.find(r => r.id === id);
      setReportList(reportList.filter(r => r.id !== id));
      toast({ title: "Report Deleted", description: `${r?.title} has been removed.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete report.", variant: "destructive" });
    }
  };

  const quickGenerate = (type: string) => {
    setEditReport({ ...emptyReport, title: `${type} Report`, type });
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and download government-ready reports</p>
        </div>
        <Button size="sm" className="bg-primary" onClick={() => { setEditReport({ ...emptyReport }); setIsAdding(true); }}><Plus className="h-4 w-4 mr-1" />Generate Report</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Daily Attendance', 'Weekly Wages', 'Monthly Summary', 'Budget Report'].map((type) => (
          <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow border-dashed" onClick={() => quickGenerate(type)}>
            <CardContent className="pt-4 pb-3 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{type}</p>
              <p className="text-xs text-muted-foreground">Quick Generate</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Generated Reports</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Period</TableHead>
                  <TableHead className="hidden md:table-cell">Generated</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportList.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.type}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{r.period}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.generatedDate}</TableCell>
                    <TableCell><Badge variant="outline" className={formatBadge[r.format]}>{r.format}</Badge></TableCell>
                    <TableCell>
                      {r.status === 'ready' ? <Badge className="bg-success text-success-foreground">Ready</Badge> : r.status === 'generating' ? <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Generating</Badge> : <Badge variant="destructive">Failed</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {r.status === 'ready' && <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditReport({ ...r }); setIsAdding(false); }}><Pencil className="h-3.5 w-3.5" /></Button>
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

      <Dialog open={!!editReport} onOpenChange={() => { setEditReport(null); setIsAdding(false); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{isAdding ? "Generate Report" : "Edit Report"}</DialogTitle></DialogHeader>
          {editReport && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><Label>Title</Label><Input value={editReport.title} onChange={(e) => setEditReport({ ...editReport, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Type</Label><Input value={editReport.type} onChange={(e) => setEditReport({ ...editReport, type: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Period</Label><Input value={editReport.period} onChange={(e) => setEditReport({ ...editReport, period: e.target.value })} placeholder="e.g. Jan 2024" /></div>
              <div className="space-y-1.5">
                <Label>Format</Label>
                <Select value={editReport.format} onValueChange={(v: 'PDF' | 'Excel' | 'CSV') => setEditReport({ ...editReport, format: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editReport.status} onValueChange={(v: 'ready' | 'generating' | 'failed') => setEditReport({ ...editReport, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="generating">Generating</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditReport(null); setIsAdding(false); }}>Cancel</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" />{isAdding ? "Generate" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
