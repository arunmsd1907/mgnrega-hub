import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProjects, Project } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FolderKanban, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", location: "", budget: "", startDate: "", endDate: "" });

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const p: Project = {
      id: `P${String(projects.length + 1).padStart(3, "0")}`,
      name: newProject.name,
      location: newProject.location,
      status: "pending",
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      budget: Number(newProject.budget) || 0,
      spent: 0,
      workersAssigned: 0,
      progress: 0,
    };
    setProjects([...projects, p]);
    setNewProject({ name: "", location: "", budget: "", startDate: "", endDate: "" });
    setDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Project Management</h1>
            <p className="text-muted-foreground text-sm">Track and manage MGNREGA projects</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1"><Label>Project Name</Label><Input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} /></div>
                <div className="space-y-1"><Label>Location</Label><Input value={newProject.location} onChange={(e) => setNewProject({ ...newProject, location: e.target.value })} /></div>
                <div className="space-y-1"><Label>Budget (₹)</Label><Input type="number" value={newProject.budget} onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Start Date</Label><Input type="date" value={newProject.startDate} onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} /></div>
                  <div className="space-y-1"><Label>End Date</Label><Input type="date" value={newProject.endDate} onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })} /></div>
                </div>
                <Button onClick={addProject} className="w-full">Create Project</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Projects" value={projects.length} icon={FolderKanban} variant="primary" />
          <StatCard title="Completed" value={projects.filter((p) => p.status === "completed").length} icon={CheckCircle} variant="accent" />
          <StatCard title="Pending" value={projects.filter((p) => p.status === "pending").length} icon={Clock} variant="warning" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{p.name}</h3>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{p.location}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">₹{(p.budget / 100000).toFixed(1)}L Budget</p>
                      <p className="text-muted-foreground">₹{(p.spent / 100000).toFixed(1)}L Spent</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={p.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-muted-foreground w-10 text-right">{p.progress}%</span>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>{p.workersAssigned} workers</span>
                    <span>{p.startDate} → {p.endDate}</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No projects found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
