import Link from "next/link";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryChipProps {
  category: Category;
  href?: string;
}

/** Rounded icon tile + label used in the Home categories row. */
export function CategoryChip({ category, href = "/home" }: CategoryChipProps) {
  return (
    <Link
      href={href}
      className="flex w-16 shrink-0 flex-col items-center gap-2 text-center"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${category.color}1A`, color: category.color }}
      >
        <CategoryIcon name={category.icon} className="h-6 w-6" />
      </span>
      <span className="text-[11px] font-medium leading-tight text-foreground">
        {category.name}
      </span>
    </Link>
  );
}
