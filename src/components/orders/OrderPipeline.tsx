import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStep } from "@/lib/types";

interface OrderPipelineProps {
  steps: PipelineStep[];
}

export function OrderPipeline({ steps }: OrderPipelineProps) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.label} className="flex gap-3">
            {/* Icon + connector line column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  step.state === "done" && "bg-primary",
                  step.state === "active" &&
                    "border-2 border-primary bg-brand-soft",
                  step.state === "upcoming" &&
                    "border-2 border-border bg-background",
                )}
              >
                {step.state === "done" && (
                  <Check className="h-3.5 w-3.5 text-white" />
                )}
                {step.state === "active" && (
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                )}
                {step.state === "upcoming" && (
                  <span className="h-2 w-2 rounded-full bg-border" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mt-1 min-h-8 w-0.5 flex-1",
                    step.state === "done" ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>

            {/* Text content */}
            <div className={cn("pb-5 pt-0.5", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-semibold",
                  step.state === "upcoming"
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
