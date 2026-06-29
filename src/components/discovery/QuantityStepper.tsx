import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors disabled:opacity-40 hover:bg-muted"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-base font-bold tabular-nums text-foreground">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-brand-soft text-primary transition-colors disabled:opacity-40 hover:bg-primary/10"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
