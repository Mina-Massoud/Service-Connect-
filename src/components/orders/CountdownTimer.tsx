"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

// Initial: 23 hours 54 minutes 12 seconds
const INITIAL_SECONDS = 23 * 3600 + 54 * 60 + 12;

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function CountdownTimer() {
  const [remaining, setRemaining] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const expired = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-brand-soft px-6 py-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/30 bg-background shadow-sm">
        <Clock className="h-8 w-8 text-primary" />
      </div>
      <p
        className="text-4xl font-bold tabular-nums tracking-tight text-foreground"
        aria-live="polite"
        aria-label={`Time remaining: ${formatTime(remaining)}`}
      >
        {formatTime(remaining)}
      </p>
      <p className="text-sm font-medium text-muted-foreground">
        {expired ? "Service Ended" : "Remaining"}
      </p>
      <p className="text-center text-xs text-muted-foreground">
        {expired
          ? "The scheduled time has passed. Please confirm completion to release the payment."
          : "Auto-confirms in this time if no action is taken."}
      </p>
    </div>
  );
}
