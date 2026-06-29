import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeader({
  title,
  actionLabel = "See all",
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {actionHref && (
        <Link
          href={actionHref}
          className="text-xs font-semibold text-primary"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
