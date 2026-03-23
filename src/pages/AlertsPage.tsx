import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockAlerts, Alert } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Clock, Activity, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

const severityIcon = { high: AlertTriangle, medium: Bell, low: Activity };
const severityColor = { high: "border-l-destructive", medium: "border-l-warning", low: "border-l-info" };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const resolve = (id: string) => setAlerts(alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a)));

  const unresolved = alerts.filter((a) => !a.resolved);
  const high = unresolved.filter((a) => a.severity === "high").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Monitoring & Alerts</h1>
          <p className="text-muted-foreground text-sm">Anomaly detection and system alerts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Active Alerts" value={unresolved.length} icon={Bell} variant="warning" />
          <StatCard title="High Severity" value={high} icon={AlertTriangle} variant="primary" />
          <StatCard title="Resolved" value={alerts.filter((a) => a.resolved).length} icon={CheckCircle} variant="accent" />
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = severityIcon[alert.severity];
            return (
              <Card key={alert.id} className={cn("border-l-4", severityColor[alert.severity], alert.resolved && "opacity-50")}>
                <CardContent className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="capitalize">{alert.type}</span>
                        <span>{alert.date}</span>
                        <span className="capitalize font-medium">{alert.severity} severity</span>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button variant="outline" size="sm" onClick={() => resolve(alert.id)}>Resolve</Button>
                  )}
                  {alert.resolved && (
                    <span className="text-xs text-accent font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Resolved
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
