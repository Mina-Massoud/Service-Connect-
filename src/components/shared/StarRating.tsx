import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  /** Show the numeric value next to the stars. */
  showValue?: boolean;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({
  rating,
  showValue = true,
  reviewCount,
  size = "sm",
  className,
}: StarRatingProps) {
  const star = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className={cn(star, "fill-amber-400 text-amber-400")} />
      {showValue && (
        <span
          className={cn(
            "font-semibold text-foreground",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span
          className={cn(
            "text-muted-foreground",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
