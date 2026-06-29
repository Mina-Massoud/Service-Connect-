import { cn } from "@/lib/utils";

interface ChipSelectorProps {
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}

/**
 * Generic chip row selector. When multi=false behaves as a radio group;
 * when multi=true behaves as a checkbox group.
 */
export function ChipSelector({
  options,
  value,
  onChange,
  multi = false,
}: ChipSelectorProps) {
  const selected = multi
    ? (value as string[])
    : value === "" ? [] : [value as string];

  function toggle(opt: string) {
    if (multi) {
      const arr = value as string[];
      onChange(
        arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt],
      );
    } else {
      onChange(opt === value ? "" : opt);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
