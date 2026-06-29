import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { Provider } from "@/lib/types";
import { StarRating } from "./StarRating";

interface ProviderCardProps {
  provider: Provider;
  href?: string;
}

/** Compact mentor card used in the "Top Rated Providers" row. */
export function ProviderCard({ provider, href = "/home" }: ProviderCardProps) {
  return (
    <Link
      href={href}
      className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={provider.avatar}
          alt={provider.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        {provider.verified && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5">
            <BadgeCheck className="h-4 w-4 text-primary" fill="currentColor" />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {provider.name}
        </p>
        <p className="line-clamp-1 text-[11px] text-muted-foreground">
          {provider.headline}
        </p>
      </div>
      <StarRating rating={provider.rating} reviewCount={provider.reviewCount} />
    </Link>
  );
}
