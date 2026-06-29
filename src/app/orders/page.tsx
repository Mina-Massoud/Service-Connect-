"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useLearnerBookings, useAllListings } from "@/lib/store";
import type { BookingLifecycle } from "@/lib/store";

type Filter = "active" | "completed";

const ACTIVE_STATUSES: BookingLifecycle[] = [
  "pending_payment",
  "escrow_held",
  "accepted",
  "in_progress",
  "disputed",
];
const COMPLETED_STATUSES: BookingLifecycle[] = [
  "completed",
  "funds_released",
  "declined",
];

export default function OrdersPage() {
  const [filter, setFilter] = useState<Filter>("active");
  const bookings = useLearnerBookings();
  const allListings = useAllListings();

  const filtered = bookings.filter((b) =>
    filter === "active"
      ? ACTIVE_STATUSES.includes(b.status)
      : COMPLETED_STATUSES.includes(b.status),
  );

  return (
    <Screen
      header={<ScreenHeader title="My Orders" showBack={false} />}
      activeTab="orders"
      tone="muted"
    >
      {/* Segmented filter */}
      <div className="mb-4 flex rounded-xl bg-muted p-1" role="tablist">
        {(["active", "completed"] as Filter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={filter === tab}
            aria-pressed={filter === tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all ${
              filter === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No {filter} orders.
          </p>
        )}

        {filtered.map((booking) => {
          const service = allListings.find((l) => l.id === booking.serviceId);

          return (
            <Link key={booking.id} href={`/orders/${booking.id}`}>
              <div className="flex flex-col gap-3 rounded-2xl bg-background p-4 shadow-sm">
                {/* Thumbnail + title row */}
                <div className="flex gap-3">
                  {service?.coverImage && (
                    <img
                      src={service.coverImage}
                      alt={service.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {service?.title ?? "Service"}
                    </p>
                    <StatusBadge status={booking.status} className="mt-1.5" />
                  </div>
                </div>

                {/* Date / time / amount row */}
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {booking.time}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    ${booking.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Screen>
  );
}
