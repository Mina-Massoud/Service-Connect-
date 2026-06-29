"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { PriceRow } from "@/components/shared/PriceRow";
import { useBooking, useService } from "@/lib/store";
import { getProvider } from "@/lib/mock-data";

const TRANSACTION_ID = "TXN-UZP0X9B60";
const TRANSACTION_DATE = "Oct 24, 2023 · 09:00 AM";

export default function FundsReleasedPage() {
  const { id } = useParams<{ id: string }>();
  const booking = useBooking(id);
  const service = useService(booking?.serviceId);
  const provider = service ? getProvider(service.providerId) : undefined;

  if (!booking) {
    return (
      <Screen
        header={<ScreenHeader title="Funds Released" />}
        tone="muted"
      >
        <p className="py-16 text-center text-sm text-muted-foreground">
          Booking not found.
        </p>
      </Screen>
    );
  }

  return (
    <Screen
      header={<ScreenHeader title="Funds Released" />}
      footer={
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          asChild
        >
          <Link href="/wallet">View Wallet</Link>
        </Button>
      }
      tone="muted"
    >
      {/* Hero */}
      <div className="mb-4 flex flex-col items-center gap-2 rounded-2xl bg-background py-8 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        </div>
        <p className="mt-1 text-lg font-bold text-foreground">Funds Released</p>
        <p className="text-sm text-muted-foreground">Transaction Successful</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight text-foreground">
          ${booking.payout.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">Net amount to provider</p>
      </div>

      {/* Service details */}
      {service && provider && (
        <div className="mb-4 rounded-2xl bg-background p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Service Details
          </p>
          <div className="flex items-center gap-3">
            <img
              src={provider.avatar}
              alt={provider.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {service.title}
              </p>
              <p className="text-xs text-muted-foreground">{provider.name}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="font-mono">#{booking.id}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {booking.date}
            </span>
          </div>
        </div>
      )}

      {/* Payment summary */}
      <div className="mb-4 rounded-2xl bg-background p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Payment Summary
        </p>
        <div className="flex flex-col gap-1.5">
          <PriceRow
            label="Service Price"
            value={`$${booking.subtotal.toFixed(2)}`}
          />
          <PriceRow
            label="Platform Fee (15%)"
            value={`-$${booking.platformFee.toFixed(2)}`}
          />
          <div className="my-1 border-t border-border" />
          <PriceRow
            label="Net to Provider"
            value={`$${booking.payout.toFixed(2)}`}
            emphasized
          />
        </div>
      </div>

      {/* Transaction metadata */}
      <div className="rounded-2xl bg-background p-4 shadow-sm">
        <div className="flex items-start gap-2">
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-success"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold text-foreground">
              Transaction Finalized
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Funds were automatically released upon service completion
              confirmation. Allow up to 24 hours for the balance to reflect in
              your bank account if initiating a transfer.
            </p>
          </div>
        </div>
        <div className="mt-3 border-t border-border pt-3">
          <p className="font-mono text-xs text-muted-foreground">
            # {TRANSACTION_ID}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {TRANSACTION_DATE}
          </p>
        </div>
      </div>
    </Screen>
  );
}
