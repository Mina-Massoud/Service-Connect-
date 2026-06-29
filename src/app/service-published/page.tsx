"use client";

import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/StarRating";
import { Toast, useToast } from "@/components/shared";
import { shareLink } from "@/lib/share";
import { getService } from "@/lib/mock-data";

export default function ServicePublishedPage() {
  const service = getService("deep-cleaning")!;
  const { message, showToast } = useToast();

  async function handleShare() {
    const result = await shareLink({
      title: "Check out my new listing on ServiceConnect",
      path: `/service/${service.id}`,
    });
    showToast(
      result === "shared"
        ? "Shared"
        : result === "copied"
          ? "Link copied to clipboard"
          : "Couldn't share link",
    );
  }

  return (
    <Screen
      header={<ScreenHeader showBack backHref="/home" />}
      tone="muted"
      footer={
        <div className="space-y-2">
          <Button
            asChild
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            <Link href="/service/deep-cleaning">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              View Listing
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-xl text-sm font-semibold"
          >
            <Link href="/home">Back to Home</Link>
          </Button>
        </div>
      }
    >
      {/* Celebratory header */}
      <div className="flex flex-col items-center py-8 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Service Published!
        </h1>
        <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground">
          Your listing is now live and searchable by customers in your area.
        </p>

        {/* Live pill */}
        <div className="mt-4 flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-xs font-semibold text-success">
            Live &amp; Discoverable
          </span>
        </div>
      </div>

      {/* Published service preview card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <img
          src={service.coverImage}
          alt={service.title}
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h2 className="flex-1 text-sm font-bold leading-snug text-foreground">
              {service.title}
            </h2>
            <span className="shrink-0 text-sm font-bold text-primary">
              ${service.price}
              <span className="text-xs font-normal text-muted-foreground">
                /hr
              </span>
            </span>
          </div>

          <StarRating
            rating={service.rating}
            reviewCount={service.reviewCount}
            className="mb-3"
          />

          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {service.description}
          </p>

          {/* Publishing meta */}
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Published on</span>
              <span className="font-medium text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Listing ID</span>
              <span className="font-medium text-foreground">SRV-8821</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boost visibility nudge */}
      <div className="mt-4 rounded-2xl border border-border bg-brand-soft/30 p-4">
        <p className="mb-1 text-sm font-semibold text-foreground">
          Boost your visibility
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Share your listing with your professional network to promote it and
          appear at the top of search results.
        </p>
        <button
          type="button"
          onClick={handleShare}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          Share Listing →
        </button>
      </div>

      <Toast message={message} />
    </Screen>
  );
}
