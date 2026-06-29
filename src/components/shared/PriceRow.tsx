import { cn } from "@/lib/utils";

interface PriceRowProps {
  label: string;
  value: string;
  /** Render as the emphasized total row. */
  emphasized?: boolean;
  hint?: string;
}

export function PriceRow({ label, value, emphasized, hint }: PriceRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        emphasized ? "text-base font-bold text-foreground" : "text-sm",
      )}
    >
      <span className={cn(!emphasized && "text-muted-foreground")}>
        {label}
        {hint && (
          <span className="ml-1 text-xs text-muted-foreground">{hint}</span>
        )}
      </span>
      <span className={cn(emphasized ? "text-primary" : "font-medium text-foreground")}>
        {value}
      </span>
    </div>
  );
}
