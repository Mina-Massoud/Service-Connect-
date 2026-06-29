"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Bell, X, Check, BellOff } from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import {
  SectionHeader,
  ServiceCard,
  ProviderCard,
  Carousel,
} from "@/components/shared";
import { CategoryFilterChip } from "@/components/discovery/CategoryFilterChip";
import { Input } from "@/components/ui/input";
import {
  categories,
  providers,
  getProvider,
  getCategory,
} from "@/lib/mock-data";
import { usePublishedListings, useNotifications, useActions } from "@/lib/store";

const topProviders = [...providers].sort((a, b) => b.rating - a.rating);

const CITIES = [
  "Austin, TX",
  "Brooklyn, NY",
  "San Francisco, CA",
  "Seattle, WA",
  "Remote / Online",
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [city, setCity] = useState(CITIES[0]);
  const published = usePublishedListings();
  const notifications = useNotifications();
  const actions = useActions();
  const unreadCount = notifications.filter((n) => !n.read).length;

  function openNotifications() {
    setNotifOpen(true);
    actions.markNotificationsRead();
  }

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return published.filter((svc) => {
      const matchSearch =
        !query ||
        svc.title.toLowerCase().includes(query) ||
        (getCategory(svc.categoryId)?.name.toLowerCase().includes(query) ??
          false) ||
        (getProvider(svc.providerId)?.name.toLowerCase().includes(query) ??
          false);
      const matchCategory =
        !activeCategoryId || svc.categoryId === activeCategoryId;
      return matchSearch && matchCategory;
    });
  }, [published, search, activeCategoryId]);

  const featuredServices = useMemo(
    () => filtered.filter((s) => s.featured),
    [filtered],
  );

  const nearbyServices = useMemo(
    () => filtered.filter((s) => s.distanceKm != null),
    [filtered],
  );

  function handleCategoryClick(id: string) {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  }

  return (
    <Screen activeTab="home">
      {/* ── Top row: greeting + notification + location ── */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Good morning 👋
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            onClick={openNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-muted"
          >
            <Bell className="h-4.5 w-4.5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setLocOpen(true)}
            className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {city}
          </button>
        </div>
      </div>
      {/* ── Heading (full width) ── */}
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
        What do you need today?
      </h1>

      {/* ── Search bar ── */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <label htmlFor="home-search" className="sr-only">
          Search services
        </label>
        <Input
          id="home-search"
          aria-label="Search services, skills, or providers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services, skills…"
          className="h-12 w-full rounded-full border-border bg-card pl-11 pr-4 text-sm shadow-sm"
        />
      </div>

      {/* ── Categories ── */}
      <SectionHeader title="Categories" />
      <Carousel gap="gap-4" className="-mx-5 mb-5 px-5 pb-1" label="Categories">
        {categories.map((cat) => (
          <CategoryFilterChip
            key={cat.id}
            category={cat}
            isActive={activeCategoryId === cat.id}
            onClick={() => handleCategoryClick(cat.id)}
          />
        ))}
      </Carousel>

      {/* ── Featured Services ── */}
      <SectionHeader title="Featured Services" />
      {featuredServices.length === 0 ? (
        <p className="mb-5 rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          No featured services found.
        </p>
      ) : (
        <Carousel
          gap="gap-3"
          className="-mx-5 mb-5 px-5 pb-1"
          label="Featured services"
        >
          {featuredServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} variant="featured" />
          ))}
        </Carousel>
      )}

      {/* ── Top Rated Providers ── */}
      <SectionHeader title="Top Rated Providers" />
      <Carousel
        gap="gap-3"
        className="-mx-5 mb-5 px-5 pb-1"
        label="Top rated providers"
      >
        {topProviders.map((p) => (
          <ProviderCard key={p.id} provider={p} href={`/provider/${p.id}`} />
        ))}
      </Carousel>

      {/* ── Nearby Services ── */}
      <SectionHeader title="Nearby Services" />
      {nearbyServices.length === 0 ? (
        <p className="pb-6 rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          No nearby services found.
        </p>
      ) : (
        <div className="space-y-3 pb-6">
          {nearbyServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} variant="list" />
          ))}
        </div>
      )}

      {/* ── Notifications panel ── */}
      {notifOpen && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setNotifOpen(false)}
            className="absolute inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
          />
          <div className="absolute inset-x-0 top-0 z-50 max-h-[75%] overflow-y-auto rounded-b-3xl border-b border-border bg-background shadow-xl no-scrollbar">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-bold text-foreground">
                Notifications
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setNotifOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                <BellOff className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href ?? "/home"}
                      onClick={() => setNotifOpen(false)}
                      className="flex gap-3 px-5 py-3.5 transition-colors hover:bg-muted"
                    >
                      <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="text-sm text-foreground">{n.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* ── Location picker ── */}
      {locOpen && (
        <>
          <button
            type="button"
            aria-label="Close location picker"
            onClick={() => setLocOpen(false)}
            className="absolute inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
          />
          <div className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border bg-background p-5 shadow-xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <h2 className="mb-3 text-base font-bold text-foreground">
              Choose location
            </h2>
            <ul className="flex flex-col gap-1">
              {CITIES.map((c) => {
                const active = c === city;
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setLocOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand-soft text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span className="flex-1">{c}</span>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </Screen>
  );
}
