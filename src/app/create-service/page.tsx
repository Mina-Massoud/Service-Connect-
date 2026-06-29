"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PricingModelSelector } from "@/components/discovery/PricingModelSelector";
import { ChipSelector } from "@/components/discovery/ChipSelector";
import { categories } from "@/lib/mock-data";
import type {
  PricingModel,
  SkillLevel,
  TeachingMethod,
  LocationType,
} from "@/lib/types";
import { useActions, useService } from "@/lib/store";

const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"];
const TEACHING_METHODS: TeachingMethod[] = [
  "One-to-one",
  "Small group",
  "Workshop",
];
const LOCATION_TYPES: LocationType[] = ["Online", "Offline", "Hybrid"];
const WEEKDAY_KEYS = ["S-0", "M-1", "T-2", "W-3", "T-4", "F-5", "S-6"];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const CANCEL_POLICIES = [
  "Flexible – Full refund up to 24h",
  "Moderate – 50% refund up to 24h",
  "Strict – No refunds",
];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-4 text-sm font-bold text-foreground">{title}</p>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export default function CreateServicePage() {
  const router = useRouter();
  const actions = useActions();

  // Edit mode: ?edit=<listingId>. Read from the URL on the client to keep this
  // page statically rendered (no useSearchParams Suspense requirement).
  const [editId, setEditId] = useState<string | undefined>(undefined);
  useEffect(() => {
    // Client-only: read the URL param after mount to avoid an SSR/CSR
    // hydration mismatch on the statically-rendered page.
    const param = new URLSearchParams(window.location.search).get("edit");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (param) setEditId(param);
  }, []);
  const existing = useService(editId);
  const isEdit = Boolean(editId);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [pricingModel, setPricingModel] = useState<PricingModel>("fixed");
  const [baseAmount, setBaseAmount] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");
  const [teachingMethod, setTeachingMethod] =
    useState<TeachingMethod>("One-to-one");
  const [locationType, setLocationType] = useState<LocationType>("Offline");
  const [workingDays, setWorkingDays] = useState<string[]>([
    "M-1",
    "W-3",
    "F-5",
  ]);
  const [cancelPolicy, setCancelPolicy] = useState("");
  const [instantBook, setInstantBook] = useState(false);

  // Prefill the form once the listing being edited is available in the store.
  const prefilled = useRef(false);
  useEffect(() => {
    if (!existing || prefilled.current) return;
    prefilled.current = true;
    setTitle(existing.title);
    setCategoryId(existing.categoryId);
    setDescription(existing.description);
    setPricingModel(existing.pricingModel);
    setBaseAmount(String(existing.price));
    setSkillLevel(existing.skillLevel);
    setTeachingMethod(existing.teachingMethod);
    setLocationType(existing.locationType);
  }, [existing]);

  const parsedPrice = parseFloat(baseAmount);
  const canSubmit = title.trim().length > 0 && !isNaN(parsedPrice) && parsedPrice > 0;

  function toggleDay(key: string) {
    setWorkingDays((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
    );
  }

  function handleSubmit() {
    if (!canSubmit) return;

    const fields = {
      title: title.trim(),
      categoryId: categoryId || "life-skills",
      description,
      pricingModel,
      price: parsedPrice,
      skillLevel,
      teachingMethod,
      locationType,
    };

    if (isEdit && editId) {
      actions.updateListing(editId, fields);
      router.push("/instructor/listings");
      return;
    }

    const listingId = actions.createListing({
      ...fields,
      requirements: [],
      learningOutcomes: [],
    });

    router.push(`/admin/review/${listingId}`);
  }

  return (
    <Screen
      header={<ScreenHeader title={isEdit ? "Edit Service" : "Create Service"} />}
      footer={
        <Button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          {isEdit ? "Save Changes" : "Submit for Review"}
        </Button>
      }
      tone="muted"
    >
      <div className="space-y-4 pb-4">
        {/* General Details */}
        <Card title="General Details">
          <div className="space-y-3">
            <div>
              <FieldLabel>Service Title</FieldLabel>
              <Input
                aria-label="Service title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professional Home Cleaning"
                className="h-11 rounded-xl bg-background"
              />
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger
                  aria-label="Service category"
                  className="h-11 w-full rounded-xl border-input bg-background"
                >
                  <SelectValue placeholder="Select service category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                aria-label="Service description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you offer in detail (min 50 chars)…"
                rows={4}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">
                {description.length} / 50 min chars
              </p>
            </div>
          </div>
        </Card>

        {/* Pricing Model */}
        <Card title="Pricing Model">
          <div className="space-y-4">
            <PricingModelSelector
              value={pricingModel}
              onChange={setPricingModel}
            />
            <div>
              <FieldLabel>Base Amount (USD)</FieldLabel>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  min="0"
                  aria-label="Base amount in USD"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-11 rounded-xl bg-background pl-7"
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Payments are held in secure escrow until client confirmation.
              </p>
            </div>
          </div>
        </Card>

        {/* Skill Level & Teaching */}
        <Card title="Skill Level &amp; Teaching">
          <div className="space-y-4">
            <div>
              <FieldLabel>Skill Level</FieldLabel>
              <ChipSelector
                options={SKILL_LEVELS}
                value={skillLevel}
                onChange={(v) => {
                  if (typeof v === "string") setSkillLevel(v as SkillLevel);
                }}
              />
            </div>
            <div>
              <FieldLabel>Teaching Method</FieldLabel>
              <ChipSelector
                options={TEACHING_METHODS}
                value={teachingMethod}
                onChange={(v) => {
                  if (typeof v === "string")
                    setTeachingMethod(v as TeachingMethod);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Logistics */}
        <Card title="Logistics">
          <div className="space-y-4">
            <div>
              <FieldLabel>Location Type</FieldLabel>
              <ChipSelector
                options={LOCATION_TYPES}
                value={locationType}
                onChange={(v) => {
                  if (typeof v === "string")
                    setLocationType(v as LocationType);
                }}
              />
            </div>
            <div>
              <FieldLabel>Working Days</FieldLabel>
              <div className="flex gap-2">
                {WEEKDAY_KEYS.map((key, idx) => {
                  const isActive = workingDays.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={isActive}
                      aria-label={`Toggle ${WEEKDAY_LABELS[idx]} working day`}
                      onClick={() => toggleDay(key)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary/10"
                      }`}
                    >
                      {WEEKDAY_LABELS[idx]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Policies */}
        <Card title="Policies">
          <div className="space-y-4">
            <div>
              <FieldLabel>Cancellation Policy</FieldLabel>
              <Select value={cancelPolicy} onValueChange={setCancelPolicy}>
                <SelectTrigger
                  aria-label="Cancellation policy"
                  className="h-11 w-full rounded-xl border-input bg-background"
                >
                  <SelectValue placeholder="Choose a policy" />
                </SelectTrigger>
                <SelectContent>
                  {CANCEL_POLICIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Instant Book
                </p>
                <p className="text-xs text-muted-foreground">
                  Allow clients to book without approval
                </p>
              </div>
              <Switch
                aria-label="Enable instant book"
                checked={instantBook}
                onCheckedChange={(c) => setInstantBook(c)}
              />
            </div>
          </div>
        </Card>

        {/* Review notice */}
        {!isEdit && (
        <div className="flex items-start gap-3 rounded-2xl bg-brand-soft px-4 py-3.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-accent-foreground">
              Ready for Review?
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-accent-foreground/80">
              All new services are manually reviewed to ensure safety and
              quality. This process usually takes 24–48 hours.
            </p>
          </div>
        </div>
        )}
      </div>
    </Screen>
  );
}
