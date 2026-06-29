import { cn } from "@/lib/utils";
import type { BookingLifecycle } from "@/lib/store";

const LABEL: Record<BookingLifecycle, string> = {
  pending_payment: "Pending Payment",
  escrow_held: "Pending",
  accepted: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  funds_released: "Paid Out",
  declined: "Declined",
  disputed: "Disputed",
};

const STYLE: Record<BookingLifecycle, string> = {
  pending_payment: "bg-muted text-muted-foreground",
  escrow_held: "bg-amber-100 text-amber-700",
  accepted: "bg-brand-soft text-primary",
  in_progress: "bg-indigo-50 text-indigo-700",
  completed: "bg-teal-50 text-teal-700",
  funds_released: "bg-success-soft text-success",
  declined: "bg-muted text-muted-foreground",
  disputed: "bg-red-100 text-red-600",
};

interface StatusBadgeProps {
  status: BookingLifecycle;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STYLE[status],
        className,
      )}
    >
      {LABEL[status]}
    </span>
  );
}
