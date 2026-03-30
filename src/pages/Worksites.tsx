import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, CheckCircle, Pencil, Trash2, Plus, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Worksite {
  id: number; name: string; village: string; workers: number; status: string; type: string; progress: number;
}

const initialWorksites: Worksite[] = [
  { id: 1, name: "NH-7 Road Extension", village: "Chandpur", workers: 45, status: "active", type: "Road Construction", progress: 72 },
  { id: 2, name: "Community Well Project", village: "Rampur", workers: 28, status: "active", type: "Well Digging", progress: 55 },
  { id: 3, name: "Village Plantation Drive", village: "Shivpur", workers: 35, status: "active", type: "Plantation", progress: 88 },
  { id: 4, name: "Water Conservation Site", village: "Lohta", workers: 22, status: "completed", type: "Water Conservation", progress: 100 },
  { id: 5, name: "School Boundary Wall", village: "Sarnath", workers: 18, status: "upcoming", type: "Construction", progress: 0 },
];

const emptyWorksite: Worksite = { id: 0, name: '', village: '', workers: 0, status: 'upcoming', type: '', progress: 0 };

const Worksites = () => {
  const [sites, setSites] = useState<Worksite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSite, setEditSite] = useState<Worksite | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetch('/api/worksites')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          toast({ title: "Initializing", description: "Seeding worksites data..." });
          Promise.all(initialWorksites.map(s => 
            fetch('/api/worksites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(s)
            })
          )).then(() => {
            fetch('/api/worksites').then(r => r.json()).then(seededData => {
              setSites(seededData);
              setLoading(false);
            });
          });
        } else {
          setSites(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast({ title: "Error", description: "Failed to load worksites.", variant: "destructive" });
      });
  }, []);

  const handleSave = async () => {
    if (!editSite) return;
    if (isAdding) {
      const uniqueId = parseInt(Date.now().toString().slice(-6));
      const newSite = { ...editSite, id: uniqueId };
      try {
        const res = await fetch('/api/worksites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSite)
        });
        const saved = await res.json();
        if (!res.ok) throw new Error(saved.message || 'Failed to save');
        setSites([...sites, saved]);
        toast({ title: "Worksite Added", description: `${saved.name} has been created.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to save worksite.", variant: "destructive" });
      }
    } else {
      try {
        const res = await fetch(`/api/worksites/${editSite.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editSite)
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.message || 'Failed to update');
        setSites(sites.map(s => s.id === updated.id ? updated : s));
        toast({ title: "Worksite Updated", description: `${updated.name} has been saved.` });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to update worksite.", variant: "destructive" });
      }
    }
    setEditSite(null); setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/worksites/${id}`, { method: 'DELETE' });
      const s = sites.find(s => s.id === id);
      setSites(sites.filter(s => s.id !== id));
      toast({ title: "Worksite Removed", description: `${s?.name} has been deleted.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete worksite.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Worksites</h1>
          <p className="text-sm text-muted-foreground mt-1">Active and planned MGNREGA worksites</p>
        </div>
        <Button size="sm" className="bg-primary" onClick={() => { setEditSite({ ...emptyWorksite }); setIsAdding(true); }}><Plus className="h-4 w-4 mr-1" />Add Worksite</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <Card key={site.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-semibold">{site.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Badge className={site.status === "active" ? "bg-success text-success-foreground" : site.status === "completed" ? "bg-info text-info-foreground" : "bg-muted text-muted-foreground"}>{site.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{site.village}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-3.5 w-3.5" />{site.workers} workers</div>
              <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-3.5 w-3.5" />{site.type}</div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1"><span>Progress</span><span className="font-semibold">{site.progress}%</span></div>
                <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${site.progress}%` }} /></div>
              </div>
              <div className="flex gap-1 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditSite({ ...site }); setIsAdding(false); }}><Pencil className="h-3.5 w-3.5 mr-1" />Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(site.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editSite} onOpenChange={() => { setEditSite(null); setIsAdding(false); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{isAdding ? "Add Worksite" : "Edit Worksite"}</DialogTitle></DialogHeader>
          {editSite && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><Label>Site Name</Label><Input value={editSite.name} onChange={(e) => setEditSite({ ...editSite, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Village</Label><Input value={editSite.village} onChange={(e) => setEditSite({ ...editSite, village: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Workers</Label><Input type="number" value={editSite.workers} onChange={(e) => setEditSite({ ...editSite, workers: parseInt(e.target.value) || 0 })} /></div>
              <div className="space-y-1.5"><Label>Type</Label><Input value={editSite.type} onChange={(e) => setEditSite({ ...editSite, type: e.target.value })} /></div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editSite.status} onValueChange={(v) => setEditSite({ ...editSite, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5"><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={editSite.progress} onChange={(e) => setEditSite({ ...editSite, progress: Math.min(100, parseInt(e.target.value) || 0) })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditSite(null); setIsAdding(false); }}>Cancel</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" />{isAdding ? "Add" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Worksites;
