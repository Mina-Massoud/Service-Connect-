import type { ReactNode } from "react";
import { DollarSign, Clock, Users, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingModel } from "@/lib/types";

interface PricingOption {
  value: PricingModel;
  label: string;
  description: string;
  icon: ReactNode;
}

const OPTIONS: PricingOption[] = [
  {
    value: "fixed",
    label: "Fixed Price",
    description: "Set one total cost",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    value: "hourly",
    label: "Hourly Rate",
    description: "Bill by time spent",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    value: "per_person",
    label: "Per Person",
    description: "Scale with attendees",
    icon: <Users className="h-5 w-5" />,
  },
  {
    value: "custom",
    label: "Custom",
    description: "Bespoke estimation",
    icon: <Sliders className="h-5 w-5" />,
  },
];

interface PricingModelSelectorProps {
  value: PricingModel;
  onChange: (v: PricingModel) => void;
}

export function PricingModelSelector({ value, onChange }: PricingModelSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-all",
              active
                ? "border-primary bg-brand-soft ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <span className={cn("rounded-xl p-1.5", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {opt.icon}
            </span>
            <div>
              <p className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
                {opt.label}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
