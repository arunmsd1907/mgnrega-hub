import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    pending: "badge-status-pending",
    ongoing: "badge-status-ongoing",
    completed: "badge-status-completed",
    active: "bg-accent/15 text-accent border-accent/30",
    inactive: "bg-destructive/15 text-destructive border-destructive/30",
    present: "bg-accent/15 text-accent border-accent/30",
    absent: "bg-destructive/15 text-destructive border-destructive/30",
    "half-day": "bg-warning/15 text-warning border-warning/30",
    paid: "bg-accent/15 text-accent border-accent/30",
    processing: "bg-info/15 text-info border-info/30",
  };

  return (
    <Badge variant="outline" className={cn("capitalize text-xs", statusStyles[status] || "", className)}>
      {status}
    </Badge>
  );
}
