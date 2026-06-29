"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
  title?: string;
  /** Where the back button goes. Defaults to router.back(). */
  backHref?: string;
  showBack?: boolean;
  action?: ReactNode;
  className?: string;
  transparent?: boolean;
}

/**
 * Standard top bar with a back chevron, centered title and an optional action.
 */
export function ScreenHeader({
  title,
  backHref,
  showBack = true,
  action,
  className,
  transparent = false,
}: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-2 px-4",
        !transparent && "border-b border-border bg-background",
        className,
      )}
    >
      <div className="flex w-10 items-center">
        {showBack && (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
      </div>
      {title && (
        <h1 className="flex-1 truncate text-center text-base font-semibold">
          {title}
        </h1>
      )}
      <div className="flex w-10 items-center justify-end">{action}</div>
    </header>
  );
}
