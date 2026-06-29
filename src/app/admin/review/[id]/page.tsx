"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BadgeCheck, FileText, Image, ShieldCheck } from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { ReviewChecklist } from "@/components/orders/ReviewChecklist";
import { useService, useActions } from "@/lib/store";
import { getProvider, getCategory } from "@/lib/mock-data";
import type { PricingModel } from "@/lib/types";

function formatPrice(model: PricingModel, price: number): string {
  if (model === "hourly") return `$${price}/hr`;
  if (model === "per_person") return `$${price}/person`;
  return `$${price}`;
}

export default function AdminReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const service = useService(id);
  const actions = useActions();

  if (!service) {
    return (
      <Screen
        header={<ScreenHeader title="Service Review" />}
        tone="muted"
      >
        <p className="py-16 text-center text-sm text-muted-foreground">
          Service not found.
        </p>
        <Button
          variant="outline"
          className="mx-auto mt-4 flex h-10 rounded-xl px-6 text-sm font-semibold"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Screen>
    );
  }

  const provider = getProvider(service.providerId);
  const category = getCategory(service.categoryId);

  const handleApprove = () => {
    actions.approveListing(service.id);
    router.push("/service-published");
  };

  const handleRequestChanges = () => {
    router.back();
  };

  return (
    <Screen
      header={<ScreenHeader title="Service Review" />}
      tone="muted"
      footer={
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={handleApprove}
        >
          Accept &amp; Publish Service
        </Button>
      }
    >
      {/* Admin label */}
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Marketplace Admin
      </p>

      {/* Provider identity card */}
      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {provider?.avatar && (
              <img
                src={provider.avatar}
                alt={provider.name}
                className="h-12 w-12 rounded-full object-cover"
                width={48}
                height={48}
              />
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground">
                  {provider?.name ?? "Unknown"}
                </span>
                {provider?.verified && (
                  <BadgeCheck
                    className="h-4 w-4 text-primary"
                    aria-label="Verified provider"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                ID: PRO-{provider?.id ?? "0000"}
              </p>
            </div>
          </div>
          <Link
            href={`/provider/${service.providerId}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Profile
          </Link>
        </div>

        {provider?.verified && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2">
            <ShieldCheck
              className="h-4 w-4 text-success"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-success">
              ID Verified
            </span>
          </div>
        )}
      </div>

      {/* Service details */}
      <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative">
          <img
            src={service.coverImage}
            alt={service.title}
            className="h-36 w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            Pending Review
          </span>
        </div>

        <div className="p-4">
          <h2 className="mb-1 text-sm font-bold leading-snug text-foreground">
            {service.title}
          </h2>

          <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-xs font-medium text-foreground">
                {category?.name ?? service.categoryId}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pricing</p>
              <p className="text-xs font-medium text-foreground">
                {formatPrice(service.pricingModel, service.price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-xs font-medium text-foreground">
                {service.locationType}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Method</p>
              <p className="text-xs font-medium text-foreground">
                {service.teachingMethod}
              </p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {service.description}
          </p>
        </div>
      </div>

      {/* Evidence & media chips */}
      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Evidence &amp; Media
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: ShieldCheck, label: "License" },
            { icon: Image, label: "Site Photo" },
            { icon: FileText, label: "Insurance" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5"
            >
              <Icon
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review checklist */}
      <div className="mb-4">
        <ReviewChecklist />
      </div>

      {/* Request Changes button */}
      <Button
        variant="outline"
        className="h-10 w-full rounded-xl text-sm font-semibold"
        onClick={handleRequestChanges}
      >
        Request Changes
      </Button>
    </Screen>
  );
}
