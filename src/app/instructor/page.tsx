"use client";

import Link from "next/link";
import { ShieldCheck, Plus } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared";
import { PendingBookingCard } from "@/components/instructor/PendingBookingCard";
import {
  useSession,
  useInstructorBookings,
  useInstructorListings,
  useWallet,
} from "@/lib/store";
import { instructorStats } from "@/lib/mock-data";
import type { ListingState } from "@/lib/types";

const LISTING_BADGE: Record<ListingState, { label: string; className: string }> = {
  published: { label: "Published", className: "bg-success-soft text-success" },
  pending_review: { label: "Pending Review", className: "bg-warning-soft text-amber-700" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
};

interface StatInlineProps {
  label: string;
  value: string | number;
  unit: string;
}

function StatInline({ label, value, unit }: StatInlineProps) {
  return (
    <div className="flex-1 rounded-xl bg-white/15 px-2 py-2 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/75">{unit}</p>
      <p className="mt-0.5 text-[10px] text-white/60">{label}</p>
    </div>
  );
}

export default function InstructorDashboardPage() {
  const session = useSession();
  const bookings = useInstructorBookings();
  const listings = useInstructorListings();
  const wallet = useWallet();

  const pendingBookings = bookings.filter((b) => b.status === "escrow_held");
  const completedCount = bookings.filter(
    (b) => b.status === "funds_released" || b.status === "completed",
  ).length;
  const instructorName = session.instructor.name.split(" ")[0];

  return (
    <Screen
      header={<ScreenHeader title="Dashboard" showBack={false} />}
      activeTab="dashboard"
      role="instructor"
      tone="muted"
    >
      {/* Greeting */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            Welcome back
          </p>
          <p className="truncate text-lg font-bold tracking-tight text-foreground">
            {instructorName} 👋
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Verified
        </span>
      </div>

      {/* Earnings hero card */}
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#E61E4D] via-[#E31C5F] to-[#FF385C] p-5 text-white shadow-md">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/70">
          This Month&apos;s Earnings
        </p>
        <p className="mb-4 text-4xl font-bold tracking-tight">
          $
          {wallet.pending.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>
        <div className="flex gap-2">
          <StatInline
            label="Pending"
            value={pendingBookings.length}
            unit="requests"
          />
          <StatInline
            label="Rating"
            value={`${instructorStats.rating}★`}
            unit="avg score"
          />
          <StatInline
            label="Completed"
            value={completedCount}
            unit="sessions"
          />
        </div>
      </div>

      {/* Pending Requests */}
      <SectionHeader
        title="Pending Requests"
        actionLabel="See all"
        actionHref="/instructor/bookings"
      />
      <div className="mb-5 flex flex-col gap-3">
        {pendingBookings.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No pending requests
          </p>
        ) : (
          pendingBookings.map((booking) => (
            <PendingBookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>

      {/* My Listings mini-section */}
      <SectionHeader
        title="My Listings"
        actionLabel="See all"
        actionHref="/instructor/listings"
      />
      <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {listings.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No listings yet.
          </p>
        ) : (
          listings.map((service, idx) => (
            <Link key={service.id} href="/instructor/listings">
              <div
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 ${
                  idx < listings.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <img
                  src={service.coverImage}
                  alt={service.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {service.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                    {service.categoryId.replace(/-/g, " ")}
                  </p>
                </div>
                {(() => {
                  const state = service.status ?? "published";
                  const cfg = LISTING_BADGE[state];
                  return (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${cfg.className}`}
                    >
                      {cfg.label}
                    </span>
                  );
                })()}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create New Listing CTA */}
      <Button
        asChild
        className="h-12 w-full rounded-xl text-base font-semibold"
      >
        <Link href="/create-service">
          <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
          Create New Listing
        </Link>
      </Button>
    </Screen>
  );
}
