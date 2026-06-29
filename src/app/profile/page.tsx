"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  ChevronRight,
  UserCircle2,
  LayoutList,
  BadgeCheck,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Star,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { StarRating } from "@/components/shared/StarRating";
import { useSession, useActions, useApp } from "@/lib/store";

export default function ProfilePage() {
  const router = useRouter();
  const session = useSession();
  const actions = useActions();
  const { state } = useApp();

  const learner = session.learner;
  const pushNotifications = state.prefs["pushNotifications"] ?? true;

  function handleLogout() {
    actions.logout();
    router.push("/");
  }

  const settingRowBase =
    "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted";

  return (
    <Screen
      header={<ScreenHeader title="Profile" showBack={false} />}
      activeTab="profile"
    >
      {/* ── Profile header card ── */}
      <div className="mb-5 rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
        <div className="relative mx-auto mb-3 h-20 w-20">
          <img
            src={learner.avatar}
            alt={learner.name}
            width={80}
            height={80}
            className="h-full w-full rounded-full object-cover"
          />
          {session.verified && (
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary ring-2 ring-background">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </span>
          )}
        </div>

        <div className="mb-1 flex items-center justify-center gap-1.5">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {learner.name}
          </h2>
          {session.verified && (
            <Badge variant="default" className="text-[10px]">
              Verified
            </Badge>
          )}
        </div>

        {learner.bio && (
          <p className="mb-1 text-sm text-muted-foreground">{learner.bio}</p>
        )}

        {learner.location && (
          <div className="mb-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {learner.location}
          </div>
        )}

        <StarRating
          rating={4.9}
          reviewCount={214}
          size="md"
          className="justify-center"
        />
      </div>

      {/* ── Reputation stats ── */}
      <h3 className="mb-3 text-sm font-semibold text-foreground">Reputation</h3>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-foreground">4.9</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Completion</span>
          </div>
          <p className="text-2xl font-bold text-foreground">98%</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Response</span>
          </div>
          <p className="text-sm font-bold text-foreground">~1 hour</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-accent-foreground" />
            <span className="text-xs text-muted-foreground">Students</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {(480).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Settings list ── */}
      <h3 className="mb-3 text-sm font-semibold text-foreground">Settings</h3>

      <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-card">
        {/* Edit Profile */}
        <button
          type="button"
          onClick={() => router.push("/onboarding/profile")}
          className={`${settingRowBase} w-full border-b border-border`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="flex-1 text-left text-sm font-medium text-foreground">
            Edit Profile
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        {/* My Listings */}
        <Link
          href="/instructor/listings"
          className={`${settingRowBase} border-b border-border`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <LayoutList className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="flex-1 text-sm font-medium text-foreground">
            My Listings
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>

        {/* Identity Verification */}
        <Link
          href="/onboarding/verify"
          className={`${settingRowBase} border-b border-border`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="flex-1 text-sm font-medium text-foreground">
            Identity Verification
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>

        {/* Payment Methods */}
        <Link
          href="/wallet"
          className={`${settingRowBase} border-b border-border`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="flex-1 text-sm font-medium text-foreground">
            Payment Methods
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>

        {/* Notifications — switch row */}
        <div className={`${settingRowBase} border-b border-border`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <label
            htmlFor="pref-push-notifications"
            className="flex-1 cursor-pointer text-sm font-medium text-foreground"
          >
            Notifications
          </label>
          <Switch
            id="pref-push-notifications"
            checked={pushNotifications}
            onCheckedChange={(checked: boolean) =>
              actions.setPref("pushNotifications", checked)
            }
            aria-label="Push notifications"
          />
        </div>

        {/* Help & Support */}
        <Link href="/help" className={`${settingRowBase} border-b border-border`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="flex-1 text-sm font-medium text-foreground">
            Help &amp; Support
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>

        {/* Log Out */}
        <button
          type="button"
          onClick={handleLogout}
          className={`${settingRowBase} w-full border-t border-border`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <LogOut className="h-4 w-4 text-destructive" />
          </div>
          <span className="flex-1 text-left text-sm font-medium text-destructive">
            Log Out
          </span>
        </button>
      </div>

      {/* ── Create listing CTA ── */}
      <Button
        asChild
        className="h-12 w-full rounded-xl text-base font-semibold"
      >
        <Link href="/create-service">
          <Plus className="mr-1.5 h-5 w-5" />
          Create a Listing
        </Link>
      </Button>
    </Screen>
  );
}
