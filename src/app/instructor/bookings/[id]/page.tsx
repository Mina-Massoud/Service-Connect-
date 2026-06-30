"use client";

import { useParams, useRouter } from "next/navigation";
import { CalendarDays, Clock, Package, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { PriceRow } from "@/components/shared";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useBooking, useService, useActions } from "@/lib/store";
import type { BookingLifecycle } from "@/lib/store";

interface BookingFooterProps {
  status: BookingLifecycle;
  onAccept: () => void;
  onDecline: () => void;
  onStart: () => void;
  onComplete: () => void;
}

function BookingFooter({
  status,
  onAccept,
  onDecline,
  onStart,
  onComplete,
}: BookingFooterProps) {
  if (status === "escrow_held") {
    return (
      <div className="flex flex-col gap-2">
        <Button
          data-demo="booking-accept-btn"
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={onAccept}
        >
          Accept Booking
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 flex-1 rounded-xl"
            onClick={onDecline}
          >
            Decline
          </Button>
          <Button
            variant="outline"
            className="h-11 flex-1 rounded-xl"
            asChild
          >
            <Link href="/messages/conv-marco">
              <MessageCircle
                className="mr-1.5 h-4 w-4"
                aria-hidden="true"
              />
              Message Student
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className="flex flex-col gap-2">
        <Button
          data-demo="booking-start-btn"
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={onStart}
        >
          Start Session
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl font-semibold"
          onClick={onComplete}
        >
          Mark as Complete
        </Button>
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <Button
        data-demo="booking-complete-btn"
        className="h-12 w-full rounded-xl text-base font-semibold"
        onClick={onComplete}
      >
        Mark as Complete
      </Button>
    );
  }

  if (status === "funds_released" || status === "completed") {
    return (
      <Button
        disabled
        className="h-12 w-full rounded-xl bg-success text-base font-semibold text-white opacity-100"
      >
        ✓ Session Completed
      </Button>
    );
  }

  return null;
}

export default function ReceivedBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const booking = useBooking(id);
  const service = useService(booking?.serviceId);
  const actions = useActions();

  if (!booking) {
    return (
      <Screen
        role="instructor"
        header={<ScreenHeader title="Booking Request" />}
      >
        <p className="py-16 text-center text-sm text-muted-foreground">
          Booking not found.
        </p>
        <Button
          variant="outline"
          className="mx-auto mt-4 flex h-10 rounded-xl px-6 text-sm font-semibold"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Screen>
    );
  }

  const handleAccept = () => actions.acceptBooking(booking.id);
  const handleDecline = () => actions.declineBooking(booking.id);
  const handleStart = () => actions.startSession(booking.id);
  const handleComplete = () => {
    actions.completeBooking(booking.id);
    router.push(`/orders/${booking.id}/funds-released`);
  };

  const platformFee = booking.platformFee;

  return (
    <Screen
      role="instructor"
      header={<ScreenHeader title="Booking Request" />}
      footer={
        <BookingFooter
          status={booking.status}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onStart={handleStart}
          onComplete={handleComplete}
        />
      }
    >
      {/* Student card */}
      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
        <img
          src={booking.studentAvatar}
          alt={booking.studentName}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">
            {booking.studentName}
          </p>
          {booking.note && (
            <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
              &ldquo;{booking.note}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Service summary */}
      {service && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <img
            src={service.coverImage}
            alt={service.title}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight text-foreground">
              {service.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ${service.price}/hr
            </p>
          </div>
        </div>
      )}

      {/* Schedule */}
      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-bold text-foreground">Schedule</p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays
              className="h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {booking.date}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock
              className="h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {booking.time}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package
              className="h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            Qty: {booking.quantity}
          </div>
        </div>
      </div>

      {/* Payout breakdown */}
      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-bold text-foreground">
          Payout Breakdown
        </p>
        <div className="flex flex-col gap-2.5">
          <PriceRow
            label="Amount Paid by Student"
            value={`$${booking.total.toFixed(2)}`}
          />
          <PriceRow
            label="Platform Fee"
            hint="(15%)"
            value={`-$${platformFee.toFixed(2)}`}
          />
          <div className="border-t border-border pt-2.5">
            <PriceRow
              label="Your Payout"
              value={`$${booking.payout.toFixed(2)}`}
              emphasized
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-2 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Status</p>
        <StatusBadge status={booking.status} />
      </div>

      {/* Message student */}
      <div className="mt-3">
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl font-semibold"
          asChild
        >
          <Link href="/messages/conv-marco">
            <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Message Student
          </Link>
        </Button>
      </div>
    </Screen>
  );
}
