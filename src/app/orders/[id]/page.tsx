"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageCircle, CalendarDays, Clock } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { OrderPipeline } from "@/components/orders/OrderPipeline";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useBooking, useService } from "@/lib/store";
import { getProvider } from "@/lib/mock-data";
import type { BookingLifecycle } from "@/lib/store";
import type { PipelineStep } from "@/lib/types";

const PIPELINE_STEP_DEFS = [
  {
    label: "Payment Secured",
    description: "Funds are held safely in escrow until completion.",
  },
  {
    label: "Booking Confirmed",
    description: "Your booking has been accepted by the instructor.",
  },
  {
    label: "Session In Progress",
    description: "Your session is underway. Enjoy the lesson!",
  },
  {
    label: "Confirm Completion",
    description: "Confirm the session to release funds to the instructor.",
  },
  {
    label: "Leave a Review",
    description: "Share your experience and rate your instructor.",
  },
] as const;

function buildPipelineSteps(status: BookingLifecycle): PipelineStep[] {
  let activeIdx: number;
  switch (status) {
    case "pending_payment":
      activeIdx = 0;
      break;
    case "escrow_held":
      activeIdx = 1;
      break;
    case "accepted":
      activeIdx = 2;
      break;
    case "in_progress":
      activeIdx = 2;
      break;
    case "completed":
      activeIdx = 3;
      break;
    case "funds_released":
      activeIdx = 4;
      break;
    default:
      activeIdx = 0;
  }

  return PIPELINE_STEP_DEFS.map((step, idx) => ({
    ...step,
    state:
      idx < activeIdx ? "done" : idx === activeIdx ? "active" : "upcoming",
  }));
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const booking = useBooking(id);
  const service = useService(booking?.serviceId);
  const provider = service ? getProvider(service.providerId) : undefined;

  if (!booking) {
    return (
      <Screen header={<ScreenHeader title="Service Status" />} tone="muted">
        <p className="py-16 text-center text-sm text-muted-foreground">
          Booking not found.
        </p>
      </Screen>
    );
  }

  const pipelineSteps = buildPipelineSteps(booking.status);
  const canConfirm =
    booking.status === "in_progress" ||
    booking.status === "accepted" ||
    booking.status === "completed";

  return (
    <Screen
      header={<ScreenHeader title="Service Status" />}
      footer={
        canConfirm ? (
          <Button
            className="h-12 w-full rounded-xl text-base font-semibold"
            asChild
          >
            <Link href={`/orders/${booking.id}/completion`}>
              Confirm Completion
            </Link>
          </Button>
        ) : undefined
      }
      tone="muted"
    >
      {/* Service summary card */}
      <div className="mb-4 rounded-2xl bg-background p-4 shadow-sm">
        <div className="mb-3 flex items-start gap-3">
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
            <p className="text-sm font-bold text-foreground leading-snug">
              {service?.title ?? "Service"}
            </p>
            {provider && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                by {provider.name}
              </p>
            )}
            <StatusBadge status={booking.status} className="mt-2" />
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {booking.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {booking.time}
          </span>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            #{booking.id}
          </span>
        </div>
      </div>

      {/* Pipeline stepper */}
      <div className="rounded-2xl bg-background p-4 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-foreground">
          Service Pipeline
        </p>
        <OrderPipeline steps={pipelineSteps} />
      </div>

      {/* Message instructor */}
      <div className="mt-4">
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl font-semibold"
          asChild
        >
          <Link href="/messages/conv-marco">
            <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Message Instructor
          </Link>
        </Button>
      </div>
    </Screen>
  );
}
