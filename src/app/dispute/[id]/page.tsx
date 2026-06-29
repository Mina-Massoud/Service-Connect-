"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Camera,
  FileText,
  Shield,
  Clock,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useActions } from "@/lib/store";

const REASONS = [
  {
    id: "no_show" as const,
    label: "Instructor didn't show",
    description: "Provider didn't arrive at the scheduled time or place.",
    Icon: Clock,
  },
  {
    id: "not_described" as const,
    label: "Service not as described",
    description: "The result differs greatly from the listing description.",
    Icon: FileText,
  },
  {
    id: "incomplete" as const,
    label: "Session incomplete",
    description: "The session ended significantly earlier than scheduled.",
    Icon: AlertCircle,
  },
  {
    id: "safety" as const,
    label: "Safety concern",
    description: "Behavior that raised a safety or boundary issue.",
    Icon: Shield,
  },
  {
    id: "other" as const,
    label: "Other",
    description: "Something else went wrong during the session.",
    Icon: HelpCircle,
  },
];

type ReasonId = (typeof REASONS)[number]["id"];

export default function DisputePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const actions = useActions();

  const [selectedReason, setSelectedReason] = useState<ReasonId | null>(null);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!selectedReason) return;
    const reason =
      REASONS.find((r) => r.id === selectedReason)?.label ?? selectedReason;
    actions.openDispute({ bookingId: id, reason, details });
    setSubmitted(true);
  }

  return (
    <Screen
      header={<ScreenHeader title="Open Dispute" />}
      footer={
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          disabled={!selectedReason}
          onClick={handleSubmit}
        >
          Submit for Admin Review
        </Button>
      }
    >
      {/* ── Heading ── */}
      <div className="mb-6">
        <h2 className="mb-1.5 text-xl font-bold tracking-tight text-foreground">
          Tell us what happened
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Our admin team will review your claim and mediate between you and the
          provider.{id ? ` Order #${id}.` : ""}
        </p>
      </div>

      {/* ── Reason selector ── */}
      <div className="mb-5">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Select Reason
          </p>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
            Required
          </span>
        </div>

        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Dispute reason">
          {REASONS.map(({ id: reasonId, label, description, Icon }) => {
            const active = selectedReason === reasonId;
            return (
              <button
                key={reasonId}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedReason(reasonId)}
                className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                  active
                    ? "border-primary bg-brand-soft"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {description}
                  </p>
                </div>
                {active && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Details textarea ── */}
      <div className="mb-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Detailed Explanation
        </p>
        <Textarea
          placeholder="Explain the issue in detail. Mention specific dates, missed items, or discrepancies..."
          rows={4}
          value={details}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDetails(e.target.value)
          }
          className="resize-none text-sm"
        />
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Minimum 50 characters required for review.
        </p>
      </div>

      {/* ── Evidence upload ── */}
      <div className="mb-5">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Attachments & Evidence
        </p>
        <div className="mb-3 flex gap-3">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40">
            <Camera className="mb-1 h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Photos/Videos</span>
          </div>
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40">
            <FileText className="mb-1 h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Files</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-medium text-success">
            Chat history attached
          </span>
        </div>
      </div>

      {/* ── Escrow paused banner ── */}
      <div className="mb-2 rounded-2xl bg-brand-soft p-4">
        <div className="flex items-start gap-2.5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="mb-1 text-xs font-semibold text-accent-foreground">
              Escrow Paused During Review
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Funds are held securely until admin resolution. You&apos;ll be
              notified within 48 hours with the outcome and any next steps.
            </p>
          </div>
        </div>
      </div>

      {/* ── Submit success dialog ── */}
      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Dispute Submitted</DialogTitle>
            <DialogDescription>
              Our admin team will review your case and respond within 48 hours.
              Escrow funds remain held securely until resolution.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="h-10 w-full rounded-xl font-semibold"
              onClick={() => router.push("/orders")}
            >
              Back to Orders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Screen>
  );
}
