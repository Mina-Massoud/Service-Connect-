import type { Category } from "@/lib/types";
import { CategoryIcon } from "@/components/shared/CategoryIcon";

interface CategoryFilterChipProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Button-based category chip used on the Home screen for live filtering.
 * Uses aria-pressed to signal toggle state to assistive technologies.
 */
export function CategoryFilterChip({
  category,
  isActive,
  onClick,
}: CategoryFilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className="flex w-16 shrink-0 flex-col items-center gap-2 text-center"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all"
        style={{
          backgroundColor: `${category.color}${isActive ? "33" : "1A"}`,
          color: category.color,
          ...(isActive
            ? { outline: `2px solid ${category.color}`, outlineOffset: "2px" }
            : {}),
        }}
      >
        <CategoryIcon name={category.icon} className="h-6 w-6" />
      </span>
      <span
        className={`text-[11px] leading-tight text-foreground ${
          isActive ? "font-semibold" : "font-medium"
        }`}
      >
        {category.name}
      </span>
    </button>
  );
}
