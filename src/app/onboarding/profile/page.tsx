"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Camera, User } from "lucide-react";
import { Screen, ScreenHeader } from "@/components/phone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActions } from "@/lib/store";

const ALL_LANGUAGES = [
  "English",
  "Spanish",
  "Arabic",
  "French",
  "Japanese",
] as const;
type Language = (typeof ALL_LANGUAGES)[number];

type Role = "learn" | "teach" | "both";

const ROLES: { value: Role; label: string; icon: string }[] = [
  { value: "learn", label: "I want to Learn", icon: "📚" },
  { value: "teach", label: "I want to Teach", icon: "🎓" },
  { value: "both", label: "Both", icon: "⚡" },
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const a = useActions();

  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([
    "English",
  ]);
  const [role, setRole] = useState<Role | null>(null);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  function toggleLanguage(lang: Language) {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }

  function handleRoleSelect(value: Role) {
    setRole(value);
    // "learn" → learner; "teach" or "both" → instructor
    a.setRole(value === "learn" ? "learner" : "instructor");
  }

  function handleContinue() {
    a.updateProfile({ bio, location, languages: [...selectedLanguages] });
    router.push("/onboarding/verify");
  }

  return (
    <Screen
      header={<ScreenHeader title="Profile Setup" />}
      footer={
        <Button
          data-demo="profile-continue-btn"
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={handleContinue}
        >
          Continue
        </Button>
      }
    >
      <div className="space-y-6 pb-2">
        <h2 className="text-xl font-bold tracking-tight">Tell us About You</h2>

        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted">
              <User
                className="h-12 w-12 text-muted-foreground/50"
                aria-hidden="true"
              />
            </div>
            <button
              type="button"
              aria-label="Upload profile photo"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Profile Photo</p>
            <p className="text-xs text-muted-foreground">
              Upload a clear photo to build trust with clients
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio">Your Bio</Label>
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {bio.length}/50 min chars
            </span>
          </div>
          <Textarea
            id="bio"
            data-demo="profile-bio"
            placeholder="Tell clients about your skills, values, and why they should book you..."
            className="min-h-[96px] resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          {bio.length > 0 && bio.length < 50 && (
            <p className="text-xs text-muted-foreground">
              Short bios are less likely to be booked.
            </p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label htmlFor="location">Where are you based?</Label>
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="location"
              data-demo="profile-location"
              placeholder="City, State"
              className="h-11 pl-9"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoComplete="address-level2"
            />
          </div>
        </div>

        {/* Languages spoken */}
        <div className="space-y-2">
          <Label id="languages-label">Languages Spoken</Label>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-labelledby="languages-label"
          >
            {ALL_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleLanguage(lang)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role selection */}
        <div className="space-y-2">
          <Label id="role-label">Your Role</Label>
          <div
            role="radiogroup"
            aria-labelledby="role-label"
            className="space-y-2"
          >
            {ROLES.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                data-demo={`profile-role-${value}`}
                aria-checked={role === value}
                onClick={() => handleRoleSelect(value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  role === value
                    ? "border-primary bg-brand-soft"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                <span className="text-xl" aria-hidden="true">
                  {icon}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    role === value ? "text-primary" : "text-foreground",
                  )}
                >
                  {label}
                </span>
                {role === value && (
                  <div
                    className="ml-auto h-5 w-5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to ServiceConnect&apos;s professional
          standards and community guidelines.
        </p>
      </div>
    </Screen>
  );
}
