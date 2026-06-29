"use client";

import Link from "next/link";
import { Eye, Inbox, Edit2, ExternalLink } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared";
import { useInstructorListings, useInstructorBookings } from "@/lib/store";
import type { ListingState } from "@/lib/types";

const STATUS_CONFIG: Record<
  ListingState,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "bg-success-soft text-success",
  },
  pending_review: {
    label: "Pending Review",
    className: "bg-warning-soft text-amber-700",
  },
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
};

export default function InstructorListingsPage() {
  const listings = useInstructorListings();
  const allBookings = useInstructorBookings();

  return (
    <Screen
      header={<ScreenHeader title="My Listings" showBack={false} />}
      activeTab="dashboard"
      role="instructor"
      tone="muted"
      footer={
        <Button
          asChild
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          <Link href="/create-service">+ Create New Listing</Link>
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {listings.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No listings yet. Create your first listing!
          </p>
        )}

        {listings.map((service) => {
          const state: ListingState = service.status ?? "published";
          const cfg = STATUS_CONFIG[state];
          const bookingCount = allBookings.filter(
            (b) => b.serviceId === service.id,
          ).length;

          return (
            <div
              key={service.id}
              className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
            >
              {/* Cover image */}
              <img
                src={service.coverImage}
                alt={service.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                {/* Title + status badge */}
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="flex-1 text-sm font-bold leading-tight text-foreground">
                    {service.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.className}`}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Category + price */}
                <p className="mb-3 text-xs capitalize text-muted-foreground">
                  {service.categoryId.replace(/-/g, " ")} · ${service.price}/hr
                </p>

                {/* Stats row */}
                <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    — views
                  </span>
                  <span className="flex items-center gap-1">
                    <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
                    {bookingCount} bookings
                  </span>
                  <StarRating
                    rating={service.rating}
                    showValue
                    reviewCount={service.reviewCount}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl text-xs"
                    asChild
                  >
                    <Link href={`/service/${service.id}`}>
                      <ExternalLink
                        className="mr-1 h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      View public page
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl px-4"
                    aria-label={`Edit listing: ${service.title}`}
                    asChild
                  >
                    <Link href={`/create-service?edit=${service.id}`}>
                      <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
