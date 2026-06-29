import { Star } from "lucide-react";
import type { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.authorAvatar}
          alt={review.authorName}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground truncate">
              {review.authorName}
            </p>
            <span className="text-xs text-muted-foreground shrink-0">{review.date}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-border text-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {review.body}
      </p>
    </div>
  );
}
