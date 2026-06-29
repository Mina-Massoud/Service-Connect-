"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, DollarSign, Lock, Star, ThumbsUp } from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { useBooking, useService } from "@/lib/store";
import { getProvider } from "@/lib/mock-data";

interface StepItem {
  icon: React.ElementType;
  label: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    icon: Lock,
    label: "Funds Held",
    description: "Your payment is securely held in escrow",
  },
  {
    icon: Star,
    label: "Session Takes Place",
    description: "Attend and enjoy your booked session",
  },
  {
    icon: ThumbsUp,
    label: "You Confirm Completion",
    description: "Tap 'Complete' once the session is done",
  },
  {
    icon: DollarSign,
    label: "Instructor Gets Paid",
    description: "Funds are released to the instructor",
  },
];

export default function PaymentSecuredPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const booking = useBooking(id);
  const service = useService(booking?.serviceId);
  const provider = service ? getProvider(service.providerId) : undefined;

  if (!booking) {
    return (
      <Screen header={<ScreenHeader title="Booking Secured" />}>
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

  return (
    <Screen header={<ScreenHeader title="Booking Secured" />}>
      <div className="space-y-6 py-2">
        {/* ── Success hero ── */}
        <div className="flex flex-col items-center pt-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-soft">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Payment Secured!
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Your funds are safely held in escrow and will only be released once
            you confirm the session is complete.
          </p>
        </div>

        {/* ── Booking summary card ── */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-snug text-foreground">
                {service?.title ?? "Service"}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                by {provider?.name ?? "Provider"}
              </p>
            </div>
            <span className="flex-shrink-0 text-lg font-bold text-primary">
              ${booking.total.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span>{booking.date}</span>
            <span>{booking.time}</span>
          </div>
        </div>

        {/* ── What happens next? ── */}
        <div>
          <p className="mb-3 font-semibold text-foreground">
            What happens next?
          </p>
          <div>
            {STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-soft">
                      <StepIcon className="h-4 w-4 text-primary" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="my-1 h-5 w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4 pt-1">
                    <p className="text-sm font-semibold text-foreground">
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="space-y-3">
          <Button
            className="h-12 w-full rounded-xl text-base font-semibold"
            onClick={() => router.push(`/orders/${id}`)}
          >
            View Booking
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl text-base font-semibold"
            onClick={() => router.push("/messages/conv-marco")}
          >
            Message Instructor
          </Button>
        </div>
      </div>
    </Screen>
  );
}
