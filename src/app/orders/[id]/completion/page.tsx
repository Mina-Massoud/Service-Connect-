"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Shield, HelpCircle } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/orders/CountdownTimer";
import { PriceRow } from "@/components/shared/PriceRow";
import { useBooking, useService, useActions } from "@/lib/store";
import { getProvider } from "@/lib/mock-data";

export default function ServiceCompletionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const booking = useBooking(id);
  const service = useService(booking?.serviceId);
  const provider = service ? getProvider(service.providerId) : undefined;
  const actions = useActions();

  if (!booking) {
    return (
      <Screen
        header={<ScreenHeader title="Service Completion" />}
        tone="muted"
      >
        <p className="py-16 text-center text-sm text-muted-foreground">
          Booking not found.
        </p>
      </Screen>
    );
  }

  const handleConfirm = () => {
    actions.completeBooking(booking.id);
    router.push(`/orders/${booking.id}/completed`);
  };

  return (
    <Screen header={<ScreenHeader title="Service Completion" />} tone="muted">
      {/* Countdown timer */}
      <CountdownTimer />

      {/* Service summary */}
      <div className="mt-4 rounded-2xl bg-background p-4 shadow-sm">
        <div className="flex gap-3">
          {service?.coverImage && (
            <img
              src={service.coverImage}
              alt={service.title}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {service?.title ?? "Service"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              by {provider?.name ?? "Instructor"}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              #{booking.id}
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold text-foreground">
            Completed
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
          <PriceRow
            label="Service Subtotal"
            value={`$${booking.subtotal.toFixed(2)}`}
          />
          <PriceRow
            label="Platform Fee"
            value={`$${booking.platformFee.toFixed(2)}`}
          />
          <PriceRow
            label="Total Escrow Amount"
            value={`$${booking.total.toFixed(2)}`}
            emphasized
          />
        </div>
      </div>

      {/* Primary CTA */}
      <div className="mt-4">
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={handleConfirm}
        >
          <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
          Confirm Completion
        </Button>
      </div>

      {/* Dispute link */}
      <div className="mt-3">
        <Button
          variant="ghost"
          className="h-11 w-full rounded-xl font-semibold text-destructive hover:bg-red-50 hover:text-destructive"
          asChild
        >
          <Link href={`/dispute/${booking.id}`}>
            <HelpCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Raise a Dispute
          </Link>
        </Button>
      </div>

      {/* Escrow info */}
      <div className="mt-3 rounded-2xl border border-border bg-brand-soft p-4">
        <div className="flex gap-2">
          <Shield
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold text-foreground">
              How Escrow Works
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Confirming completion releases the escrowed funds to the
              instructor. If you don&apos;t confirm, funds auto-release after 24
              hours.
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
