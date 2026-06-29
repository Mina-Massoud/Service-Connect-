"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { PriceRow } from "@/components/shared/PriceRow";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBooking, useService, useActions } from "@/lib/store";
import { getProvider } from "@/lib/mock-data";

const PAYMENT_METHODS = [
  { id: "visa", brand: "Visa", last4: "4242" },
  { id: "mastercard", brand: "Mastercard", last4: "8210" },
  { id: "amex", brand: "Amex", last4: "0005" },
];

export default function ReviewBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const actions = useActions();

  const [methodId, setMethodId] = useState(PAYMENT_METHODS[0].id);
  const [methodOpen, setMethodOpen] = useState(false);
  const method =
    PAYMENT_METHODS.find((m) => m.id === methodId) ?? PAYMENT_METHODS[0];

  const booking = useBooking(id);
  const service = useService(booking?.serviceId);
  const provider = service ? getProvider(service.providerId) : undefined;

  if (!booking) {
    return (
      <Screen header={<ScreenHeader title="Review Booking" />}>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="font-semibold text-foreground">Booking not found</p>
          <p className="text-sm text-muted-foreground">
            This booking may have expired or does not exist.
          </p>
          <Button variant="outline" onClick={() => router.push("/orders")}>
            View Orders
          </Button>
        </div>
      </Screen>
    );
  }

  const handleConfirmPay = () => {
    actions.payEscrow(id);
    router.push(`/booking/${id}/payment-secured`);
  };

  return (
    <Screen
      header={<ScreenHeader title="Review Booking" />}
      footer={
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={handleConfirmPay}
        >
          Confirm &amp; Pay
        </Button>
      }
    >
      <div className="space-y-4">
        {/* ── Service summary ── */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Selected Service
          </p>
          <div className="flex gap-3">
            {service?.coverImage && (
              <img
                src={service.coverImage}
                alt={service.title}
                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                width={64}
                height={64}
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-semibold leading-snug text-foreground">
                {service?.title ?? "Service"}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                by {provider?.name ?? "Provider"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Appointment details ── */}
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Appointment Details
          </p>
          <div className="flex items-center gap-3 text-sm">
            <CalendarDays className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="text-muted-foreground">Date</span>
            <span className="ml-auto font-medium text-foreground">{booking.date}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="text-muted-foreground">Time</span>
            <span className="ml-auto font-medium text-foreground">{booking.time}</span>
          </div>
          {booking.quantity > 1 && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-muted-foreground">Guests</span>
              <span className="ml-auto font-medium text-foreground">
                {booking.quantity} people
              </span>
            </div>
          )}
        </div>

        {/* ── Price breakdown ── */}
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Price Breakdown
          </p>
          <PriceRow
            label="Service price"
            value={`$${booking.subtotal.toFixed(2)}`}
          />
          <PriceRow
            label="Platform fee"
            value={`$${booking.platformFee.toFixed(2)}`}
            hint="(15%)"
          />
          <div className="border-t border-border pt-3">
            <PriceRow
              label="Total due today"
              value={`$${booking.total.toFixed(2)}`}
              emphasized
            />
          </div>
        </div>

        {/* ── Escrow reassurance banner ── */}
        <div className="rounded-2xl bg-brand-soft p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-accent-foreground">
                Secure escrow payment
              </p>
              <p className="mt-1 text-xs leading-relaxed text-accent-foreground/80">
                Your funds are safely held in escrow and only released once you
                confirm the session is complete. 100% refundable if the provider
                cancels.
              </p>
            </div>
          </div>
        </div>

        {/* ── Payment method ── */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {method.brand} •••• {method.last4}
              </span>
            </div>
            <Dialog open={methodOpen} onOpenChange={setMethodOpen}>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  />
                }
              >
                Change
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment method</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  {PAYMENT_METHODS.map((m) => {
                    const active = m.id === methodId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMethodId(m.id);
                          setMethodOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                          active
                            ? "border-primary bg-brand-soft"
                            : "border-border bg-card hover:bg-muted"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {m.brand} •••• {m.last4}
                          </span>
                        </span>
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Screen>
  );
}
