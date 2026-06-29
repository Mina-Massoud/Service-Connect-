"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Transient bottom-of-screen toast. Auto-dismisses after a short delay. */
export function useToast(durationMs = 2200) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (text: string) => {
      setMessage(text);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), durationMs);
    },
    [durationMs],
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { message, showToast };
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center px-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 rounded-full bg-foreground/90 px-4 py-2 text-xs font-semibold text-background shadow-lg backdrop-blur">
        {message}
      </div>
    </div>
  );
}
