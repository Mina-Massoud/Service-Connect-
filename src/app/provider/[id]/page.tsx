"use client";

import { useParams, useRouter } from "next/navigation";
import {
  BadgeCheck,
  MapPin,
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { StarRating, ServiceCard } from "@/components/shared";
import { getProvider } from "@/lib/mock-data";
import { usePublishedListings } from "@/lib/store";

interface ProfileStat {
  icon: typeof Briefcase;
  label: string;
  value: string;
}

export default function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const provider = getProvider(id);
  const listings = usePublishedListings();

  if (!provider) {
    return (
      <Screen header={<ScreenHeader title="Provider" />} tone="muted">
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <p className="text-base font-semibold text-foreground">
            Provider not found
          </p>
          <p className="text-sm text-muted-foreground">
            This profile may have been removed or never existed.
          </p>
          <Button
            className="mt-2 h-10 rounded-xl px-6 text-sm font-semibold"
            onClick={() => router.push("/home")}
          >
            Back to Home
          </Button>
        </div>
      </Screen>
    );
  }

  const providerListings = listings.filter((s) => s.providerId === id);

  const stats: ProfileStat[] = [
    {
      icon: Briefcase,
      label: "Experience",
      value: `${provider.yearsExperience} yrs`,
    },
    {
      icon: Users,
      label: "Students",
      value: provider.studentCount.toLocaleString(),
    },
    {
      icon: Clock,
      label: "Responds",
      value: provider.responseTime,
    },
    {
      icon: CheckCircle2,
      label: "Completion",
      value: `${provider.completionRate}%`,
    },
  ];

  return (
    <Screen header={<ScreenHeader title="Provider" />} tone="muted">
      {/* Identity */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={provider.avatar}
            alt={provider.name}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-brand-soft"
          />
          <div className="mt-3 flex items-center gap-1.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {provider.name}
            </h2>
            {provider.verified && (
              <BadgeCheck
                className="h-5 w-5 text-primary"
                fill="currentColor"
                aria-label="Verified provider"
              />
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-muted-foreground">
            {provider.headline}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{provider.location}</span>
          </div>
          <StarRating
            rating={provider.rating}
            reviewCount={provider.reviewCount}
            size="md"
            className="mt-2"
          />
        </div>
      </section>

      {/* Stats grid */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Languages */}
      {provider.languages.length > 0 && (
        <section className="mt-4">
          <p className="mb-2 text-sm font-bold text-foreground">Languages</p>
          <div className="flex flex-wrap gap-2">
            {provider.languages.map((lang) => (
              <span
                key={lang}
                className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-primary"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Bio */}
      <section className="mt-4">
        <p className="mb-1.5 text-sm font-bold text-foreground">About</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {provider.bio}
        </p>
      </section>

      {/* Services */}
      <section className="mt-5">
        <p className="mb-3 text-sm font-bold text-foreground">
          Services by {provider.name}
        </p>
        {providerListings.length > 0 ? (
          <div className="space-y-3">
            {providerListings.map((service) => (
              <ServiceCard key={service.id} service={service} variant="list" />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card p-4 text-center text-sm text-muted-foreground">
            No published services yet.
          </p>
        )}
      </section>
    </Screen>
  );
}
