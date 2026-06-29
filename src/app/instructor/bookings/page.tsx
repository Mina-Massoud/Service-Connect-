"use client";

import { useState } from "react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { BookingCard } from "@/components/instructor/BookingCard";
import { useInstructorBookings } from "@/lib/store";
import type { BookingLifecycle } from "@/lib/store";

type Filter = "all" | BookingLifecycle;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "escrow_held", label: "Pending" },
  { id: "accepted", label: "Upcoming" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "funds_released", label: "Paid Out" },
  { id: "declined", label: "Declined" },
];

export default function InstructorBookingsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const bookings = useInstructorBookings();

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <Screen
      header={<ScreenHeader title="Bookings" showBack={false} />}
      activeTab="bookings"
      role="instructor"
      tone="muted"
    >
      {/* Horizontally scrollable filter pills */}
      <div className="-mx-5 mb-4 overflow-x-auto no-scrollbar px-5">
        <div className="flex gap-2 pb-1" role="group" aria-label="Filter bookings">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === f.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Booking cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No bookings found.
          </p>
        ) : (
          filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </Screen>
  );
}
