"use client";

import Link from "next/link";
import { CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActions, useService } from "@/lib/store";
import type { BookingRecord } from "@/lib/store";

interface PendingBookingCardProps {
  booking: BookingRecord;
}

export function PendingBookingCard({ booking }: PendingBookingCardProps) {
  const actions = useActions();
  const service = useService(booking.serviceId);

  const isAccepted = booking.status === "accepted";
  const isDeclined = booking.status === "declined";

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
      {/* Tappable header → detail */}
      <Link href={`/instructor/bookings/${booking.id}`} className="block">
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
        </div>

        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {booking.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {booking.time}
          </span>
          <span className="ml-auto text-sm font-semibold text-foreground">
            ${booking.payout.toFixed(2)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              payout
            </span>
          </span>
        </div>
      </Link>

      {/* Action area */}
      {isAccepted ? (
        <div
          className="flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2 text-sm font-semibold text-success"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Booking accepted
        </div>
      ) : isDeclined ? (
        <div
          className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm font-medium text-muted-foreground"
          role="status"
        >
          <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Request declined
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 rounded-xl"
            aria-label={`Accept booking from ${booking.studentName}`}
            onClick={() => actions.acceptBooking(booking.id)}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 rounded-xl"
            aria-label={`Decline booking from ${booking.studentName}`}
            onClick={() => actions.declineBooking(booking.id)}
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
