import { cn } from "@/lib/utils";
import type { ReceivedStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  ReceivedStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning-soft text-amber-700",
  },
  accepted: {
    label: "Accepted",
    className: "bg-brand-soft text-primary",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-indigo-50 text-indigo-700",
  },
  completed: {
    label: "Completed",
    className: "bg-success-soft text-success",
  },
};

interface ReceivedStatusBadgeProps {
  status: ReceivedStatus;
  className?: string;
}

export function ReceivedStatusBadge({
  status,
  className,
}: ReceivedStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}
