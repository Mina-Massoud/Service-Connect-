"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Share2,
  Heart,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { STATUS_BAR_HEIGHT } from "@/components/phone/StatusBar";
import { PriceRow } from "@/components/shared/PriceRow";
import { Button } from "@/components/ui/button";
import {
  ControlledDateTimePicker,
  buildTodayString,
  TIME_SLOTS,
} from "@/components/discovery/ControlledDateTimePicker";
import { QuantityStepper } from "@/components/discovery/QuantityStepper";
import { ReviewCard } from "@/components/discovery/ReviewCard";
import { StatsStrip } from "@/components/discovery/StatsStrip";
import { Carousel, Toast, useToast } from "@/components/shared";
import { getProvider, getCategory, reviews } from "@/lib/mock-data";
import { shareLink } from "@/lib/share";
import { useService, useActions, useIsSaved } from "@/lib/store";

const PLATFORM_RATE = 0.15;

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const actions = useActions();

  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(buildTodayString);
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[1]); // "10:00 AM"
  const [lightbox, setLightbox] = useState<string | null>(null);

  const service = useService(id);
  const saved = useIsSaved(id);
  const { message, showToast } = useToast();

  if (!service) {
    return (
      <Screen>
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <p className="text-base font-semibold text-foreground">
            Service not found
          </p>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="text-sm font-medium text-primary"
          >
            Back to Home
          </button>
        </div>
      </Screen>
    );
  }

  const svc = service; // narrowed (non-undefined) reference for closures below
  const provider = getProvider(service.providerId);
  const category = getCategory(service.categoryId);
  const subtotal = service.price * quantity;
  const platformFee = Math.round(subtotal * PLATFORM_RATE * 100) / 100;
  const total = subtotal + platformFee;

  function handleBookNow() {
    const bookingId = actions.createBooking({
      serviceId: id,
      date: selectedDate,
      time: selectedTime,
      quantity,
    });
    router.push(`/booking/${bookingId}/review`);
  }

  function handleChat() {
    const convId = actions.openConversationForProvider({
      providerId: svc.providerId,
      serviceTitle: svc.title,
    });
    router.push(`/messages/${convId}`);
  }

  async function handleShare() {
    const result = await shareLink({
      title: svc.title,
      text: "Check out this service on ServiceConnect",
      path: `/service/${id}`,
    });
    showToast(
      result === "shared"
        ? "Shared"
        : result === "copied"
          ? "Link copied to clipboard"
          : "Couldn't share link",
    );
  }

  function handleToggleSave() {
    actions.toggleSaved(id);
    showToast(saved ? "Removed from saved" : "Saved to your wishlist");
  }

  return (
    <Screen
      padded={false}
      footer={
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">Estimated Total</p>
            <p className="text-lg font-bold text-foreground">
              ${total.toFixed(2)}
            </p>
          </div>
          <Button
            onClick={handleBookNow}
            className="h-12 flex-1 rounded-xl text-base font-semibold"
          >
            Book Now
          </Button>
        </div>
      }
    >
      {/* Safe-area spacer so the cover starts below the transparent status bar */}
      <div
        aria-hidden
        className="shrink-0 bg-background"
        style={{ height: STATUS_BAR_HEIGHT }}
      />
      {/* ── Cover image ── */}
      <div className="relative h-56 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.coverImage}
          alt={service.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <button
          type="button"
          aria-label="Go back"
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-sm"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            aria-label="Share"
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-sm transition-colors hover:bg-background"
          >
            <Share2 className="h-4 w-4 text-foreground" />
          </button>
          <button
            type="button"
            aria-label={saved ? "Remove from saved" : "Save"}
            aria-pressed={saved}
            onClick={handleToggleSave}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-sm transition-colors hover:bg-background"
          >
            <Heart
              className={
                saved
                  ? "h-4 w-4 fill-destructive text-destructive"
                  : "h-4 w-4 text-foreground"
              }
            />
          </button>
        </div>
        {category && (
          <span className="absolute bottom-3 left-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow">
            {category.name}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="space-y-5 px-5 py-5">
        <h1 className="text-xl font-bold leading-snug tracking-tight text-foreground">
          {service.title}
        </h1>

        {/* Provider row */}
        {provider && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={provider.avatar}
              alt={provider.name}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {provider.name}
                </span>
                {provider.verified && (
                  <BadgeCheck
                    className="h-4 w-4 text-primary"
                    fill="currentColor"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {provider.headline}
              </p>
            </div>
            <button
              type="button"
              onClick={handleChat}
              className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Chat
            </button>
          </div>
        )}

        <StatsStrip service={service} />

        {/* Description */}
        <div>
          <p className="mb-1.5 text-sm font-bold text-foreground">
            Description
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>

        {/* Date & Time */}
        <div>
          <p className="mb-3 text-sm font-bold text-foreground">
            Select Date &amp; Time
          </p>
          <ControlledDateTimePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Quantity</p>
            <p className="text-xs text-muted-foreground">
              Number of sessions
            </p>
          </div>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </div>

        {/* Price breakdown */}
        <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
          <PriceRow
            label="Service price"
            value={`$${service.price.toFixed(2)}`}
          />
          <PriceRow label="Quantity" value={`× ${quantity}`} />
          <PriceRow
            label="Platform fee"
            value={`$${platformFee.toFixed(2)}`}
            hint="(15%)"
          />
          <div className="border-t border-border pt-2">
            <PriceRow
              label="Estimated Total"
              value={`$${total.toFixed(2)}`}
              emphasized
            />
          </div>
        </div>

        {/* Requirements */}
        {service.requirements.length > 0 && (
          <div>
            <p className="mb-2.5 text-sm font-bold text-foreground">
              Service Requirements
            </p>
            <ul className="space-y-2">
              {service.requirements.map((req) => (
                <li
                  key={req}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning Outcomes */}
        {service.learningOutcomes.length > 0 && (
          <div>
            <p className="mb-2.5 text-sm font-bold text-foreground">
              What You&apos;ll Learn
            </p>
            <ul className="space-y-2">
              {service.learningOutcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gallery */}
        {service.gallery.length > 0 && (
          <div>
            <p className="mb-2.5 text-sm font-bold text-foreground">Gallery</p>
            <Carousel gap="gap-2" className="-mx-5 px-5" label="Service gallery">
              {service.gallery.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightbox(img)}
                  aria-label={`View gallery image ${i + 1}`}
                  className="block overflow-hidden rounded-xl transition-transform hover:scale-[1.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${service.title} gallery ${i + 1}`}
                    className="h-24 w-24 object-cover"
                  />
                </button>
              ))}
            </Carousel>
          </div>
        )}

        {/* Escrow reassurance */}
        <div className="flex items-start gap-3 rounded-2xl bg-brand-soft p-3.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-accent-foreground">
            <span className="font-semibold">Secure escrow payment.</span>{" "}
            Funds are held safely and only released once you confirm the session
            is complete.
          </p>
        </div>

        {/* Reviews */}
        <div>
          <p className="mb-3 text-sm font-bold text-foreground">
            Reviews{" "}
            <span className="font-normal text-muted-foreground">
              ({service.reviewCount})
            </span>
          </p>
          <div className="space-y-3">
            {reviews.slice(0, 2).map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </div>

      <Toast message={message} />

      {lightbox && (
        <button
          type="button"
          aria-label="Close image"
          onClick={() => setLightbox(null)}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Gallery preview"
            className="max-h-[80%] w-auto rounded-2xl object-contain shadow-2xl"
          />
        </button>
      )}
    </Screen>
  );
}
