"use client";

import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useService } from "@/lib/store";
import type { BookingRecord } from "@/lib/store";

interface BookingCardProps {
  booking: BookingRecord;
}

export function BookingCard({ booking }: BookingCardProps) {
  const service = useService(booking.serviceId);

  return (
    <Link href={`/instructor/bookings/${booking.id}`} data-demo="booking-card">
      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
        {/* Student row */}
        <div className="mb-3 flex items-center gap-3">
          <img
            src={booking.studentAvatar}
            alt={booking.studentName}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {booking.studentName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {service?.title ?? booking.serviceId}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Date/time + payout row */}
        <div className="flex items-center justify-between border-t border-border pt-2.5">
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
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              ${booking.payout.toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">payout</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
