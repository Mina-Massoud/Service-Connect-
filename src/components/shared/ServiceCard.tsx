import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";
import type { Service } from "@/lib/types";
import { getProvider } from "@/lib/mock-data/providers";
import { getCategory } from "@/lib/mock-data/categories";
import { StarRating } from "./StarRating";

interface ServiceCardProps {
  service: Service;
  variant?: "featured" | "list";
}

const priceSuffix: Record<Service["pricingModel"], string> = {
  fixed: "",
  hourly: "/hr",
  per_person: "/person",
  custom: "",
};

export function ServiceCard({ service, variant = "list" }: ServiceCardProps) {
  const provider = getProvider(service.providerId);
  const category = getCategory(service.categoryId);
  const href = `/service/${service.id}`;

  if (variant === "featured") {
    return (
      <Link
        href={href}
        className="block w-[260px] shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative h-32 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.coverImage}
            alt={service.title}
            className="h-full w-full object-cover"
          />
          {category && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur">
              {category.name}
            </span>
          )}
        </div>
        <div className="space-y-2 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {service.title}
          </h3>
          <div className="flex items-center justify-between">
            <StarRating rating={service.rating} reviewCount={service.reviewCount} />
            <span className="text-sm font-bold text-foreground">
              ${service.price}
              <span className="text-xs font-normal text-muted-foreground">
                {priceSuffix[service.pricingModel]}
              </span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={service.coverImage}
        alt={service.title}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {service.title}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="truncate">{provider?.name}</span>
            {provider?.verified && (
              <BadgeCheck className="h-3.5 w-3.5 text-primary" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <StarRating rating={service.rating} reviewCount={service.reviewCount} />
          {service.distanceKm !== undefined ? (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {service.distanceKm} km
            </span>
          ) : (
            <span className="text-sm font-bold text-foreground">
              ${service.price}
              <span className="text-xs font-normal text-muted-foreground">
                {priceSuffix[service.pricingModel]}
              </span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
