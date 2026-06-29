import { CheckCircle2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  { id: "identity", label: "Identity verified" },
  { id: "listing", label: "Listing quality" },
  { id: "pricing", label: "Pricing reviewed" },
  { id: "content", label: "Content approved" },
  { id: "documents", label: "Documents validated" },
] as const;

export function ReviewChecklist() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Review Checklist
      </h3>
      <ul className="space-y-3">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
            <span className="text-sm text-foreground">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
