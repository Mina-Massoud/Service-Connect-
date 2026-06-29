"use client";

import { cn } from "@/lib/utils";
import { Carousel } from "@/components/shared";

interface DatePill {
  key: number;
  dayLabel: string;
  date: number;
  monthLabel: string;
  dateString: string;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"];

function buildDatePills(): DatePill[] {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayLabel = DAY_LABELS[d.getDay()];
    const monthLabel = MONTH_LABELS[d.getMonth()];
    const date = d.getDate();
    return {
      key: i,
      dayLabel,
      date,
      monthLabel,
      dateString: `${dayLabel}, ${monthLabel} ${date}`,
    };
  });
}

export function buildTodayString(): string {
  const now = new Date();
  return `${DAY_LABELS[now.getDay()]}, ${MONTH_LABELS[now.getMonth()]} ${now.getDate()}`;
}

const DATE_PILLS = buildDatePills();

interface ControlledDateTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (dateString: string) => void;
  onTimeChange: (time: string) => void;
}

export function ControlledDateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: ControlledDateTimePickerProps) {
  return (
    <div className="space-y-3">
      {/* Date pills */}
      <Carousel gap="gap-2" className="-mx-5 px-5" label="Select a date">
        {DATE_PILLS.map((p) => {
          const isSelected = selectedDate === p.dateString;
          return (
            <button
              key={p.key}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onDateChange(p.dateString)}
              className={cn(
                "flex w-14 flex-col items-center rounded-2xl border py-2 transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              <span className="text-[10px] font-medium opacity-70">{p.dayLabel}</span>
              <span className="text-base font-bold leading-tight">{p.date}</span>
              <span className="text-[10px] font-medium opacity-70">{p.monthLabel}</span>
            </button>
          );
        })}
      </Carousel>

      {/* Time slots */}
      <div className="flex flex-wrap gap-2">
        {TIME_SLOTS.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={selectedTime === t}
            onClick={() => onTimeChange(t)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              selectedTime === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
