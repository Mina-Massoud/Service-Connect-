"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Star, FileText } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PriceRow } from "@/components/shared/PriceRow";
import { useBooking, useService, useActions } from "@/lib/store";
import { getProvider } from "@/lib/mock-data";

const SESSION_NOTES = [
  "Covered the full top-to-bottom deep-clean checklist together.",
  "Practiced the streak-free glass and mirror technique.",
  "Recommended eco-friendly products list shared in chat.",
  "Next step: try the 20-minute daily maintenance routine.",
];

export default function ServiceCompletedPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const actions = useActions();
  const booking = useBooking(id);
  const service = useService(booking?.serviceId);
  const provider = service ? getProvider(service.providerId) : undefined;

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");

  function handleSubmitReview() {
    if (rating === 0 || !booking) return;
    actions.saveReview({
      bookingId: id,
      serviceId: booking.serviceId,
      rating,
      body: review.trim(),
    });
    router.push("/orders");
  }

  if (!booking) {
    return (
      <Screen
        header={<ScreenHeader title="Service Completed" />}
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
      header={<ScreenHeader title="Service Completed" />}
      footer={
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          disabled={rating === 0}
          onClick={handleSubmitReview}
        >
          {rating === 0 ? "Rate to leave a review" : "Submit Review"}
        </Button>
      }
      tone="muted"
    >
      {/* Success hero */}
      <div className="mb-4 flex flex-col items-center gap-2 rounded-2xl bg-background py-8 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        </div>
        <p className="mt-1 text-lg font-bold text-foreground">
          Service Completed!
        </p>
        <p className="text-sm text-muted-foreground">
          Total Funds Released{" "}
          <span className="font-semibold text-success">
            ${booking.total.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Payout breakdown */}
      <div className="mb-4 rounded-2xl bg-background p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Payment Summary
        </p>
        <div className="flex flex-col gap-1.5">
          <PriceRow
            label="Service Price"
            value={`$${booking.subtotal.toFixed(2)}`}
          />
          <PriceRow
            label="Platform Fee"
            value={`-$${booking.platformFee.toFixed(2)}`}
          />
          <div className="my-1 border-t border-border" />
          <PriceRow
            label="Net to Provider"
            value={`$${booking.payout.toFixed(2)}`}
            emphasized
          />
        </div>

        {service && provider && (
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <img
              src={provider.avatar}
              alt={provider.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {service.title}
              </p>
              <p className="text-xs text-muted-foreground">{provider.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Leave a review */}
      <div className="rounded-2xl bg-background p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Leave a Review
        </p>

        {/* Star picker */}
        <div className="mb-3 flex items-center gap-1" role="group" aria-label="Rate the instructor">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              aria-pressed={rating === star}
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-border"
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-1 text-xs text-muted-foreground">
              {rating} / 5
            </span>
          )}
        </div>

        <Textarea
          placeholder="Share your experience with the instructor…"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="resize-none rounded-xl text-sm"
          rows={3}
        />
      </div>

      {/* View notes */}
      <div className="mt-3">
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl font-semibold"
                aria-label="View session notes"
              />
            }
          >
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            View Session Notes
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Session notes</DialogTitle>
            </DialogHeader>
            <ul className="flex flex-col gap-2.5">
              {SESSION_NOTES.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {note}
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>
    </Screen>
  );
}
