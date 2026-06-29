"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Camera, Upload, CheckCircle, Circle } from "lucide-react";
import { Screen, ScreenHeader } from "@/components/phone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActions, useSession } from "@/lib/store";

type UploadState = "idle" | "uploaded";

interface ChecklistItem {
  label: string;
  done: boolean;
}

export default function VerifyPage() {
  const router = useRouter();
  const a = useActions();
  const session = useSession();

  const [idState, setIdState] = useState<UploadState>("idle");
  const [selfieState, setSelfieState] = useState<UploadState>("idle");

  const checklist: ChecklistItem[] = [
    { label: "Government ID", done: idState === "uploaded" },
    { label: "Live selfie", done: selfieState === "uploaded" },
    { label: "Phone number", done: true },
    { label: "Email address", done: true },
    { label: "Bank account", done: false },
  ];

  function handleSubmit() {
    a.setVerified(true);
    router.push(session.role === "instructor" ? "/instructor" : "/home");
  }

  return (
    <Screen
      header={<ScreenHeader title="Verify your identity" />}
      footer={
        <Button
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={handleSubmit}
        >
          Submit for Review
        </Button>
      }
    >
      <div className="space-y-5 pb-2">
        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl bg-brand-soft p-4">
          <Shield
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Action Required
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Instructors must verify their identity before publishing listings,
              accessing high-value bookings, or receiving secure escrow payments.
            </p>
          </div>
        </div>

        {/* Required documents */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Required Documents
            </p>
            <p className="text-xs text-muted-foreground">Step 1 of 2</p>
          </div>

          <div className="space-y-3">
            {/* National ID Card */}
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">National ID Card</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Clear photo of the front of your government ID, Passport, or
                    Driver&apos;s License.
                  </p>
                </div>
                {idState === "uploaded" ? (
                  <CheckCircle
                    className="h-5 w-5 shrink-0 text-success"
                    aria-label="Uploaded"
                  />
                ) : (
                  <Circle
                    className="h-5 w-5 shrink-0 text-muted-foreground/30"
                    aria-label="Not uploaded"
                  />
                )}
              </div>

              {/* Sample document image */}
              <div className="mt-3 overflow-hidden rounded-lg bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400&q=70"
                  alt="Sample identity document"
                  width={400}
                  height={112}
                  className="h-28 w-full object-cover opacity-70"
                />
              </div>

              <Button
                variant="outline"
                className="mt-3 h-9 w-full rounded-xl text-sm"
                onClick={() => setIdState("uploaded")}
                aria-pressed={idState === "uploaded"}
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {idState === "uploaded" ? "Document Uploaded" : "Upload Document"}
              </Button>
            </div>

            {/* Live Selfie */}
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">Live Selfie</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    A clear portrait of yourself looking directly at the camera
                    to match your ID.
                  </p>
                </div>
                {selfieState === "uploaded" ? (
                  <CheckCircle
                    className="h-5 w-5 shrink-0 text-success"
                    aria-label="Uploaded"
                  />
                ) : (
                  <Circle
                    className="h-5 w-5 shrink-0 text-muted-foreground/30"
                    aria-label="Not uploaded"
                  />
                )}
              </div>

              {/* Camera placeholder tile */}
              <div
                className="mt-3 flex h-28 items-center justify-center rounded-lg bg-muted"
                aria-hidden="true"
              >
                {selfieState === "uploaded" ? (
                  <CheckCircle className="h-10 w-10 text-success" />
                ) : (
                  <Camera className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>

              <Button
                variant="outline"
                className="mt-3 h-9 w-full rounded-xl text-sm"
                onClick={() => setSelfieState("uploaded")}
                aria-pressed={selfieState === "uploaded"}
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                {selfieState === "uploaded" ? "Selfie Captured" : "Take Selfie"}
              </Button>
            </div>
          </div>
        </div>

        {/* Verification checklist */}
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="mb-3 text-sm font-semibold">Verification Checklist</p>
          <ul className="space-y-2.5" aria-label="Verification checklist">
            {checklist.map(({ label, done }) => (
              <li key={label} className="flex items-center gap-2.5">
                {done ? (
                  <CheckCircle
                    className="h-4 w-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className="h-4 w-4 shrink-0 text-muted-foreground/30"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "text-sm",
                    done ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                  {done ? (
                    <span className="sr-only"> (complete)</span>
                  ) : (
                    <span className="sr-only"> (incomplete)</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security note */}
        <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3">
          <Shield
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Secure &amp; Encrypted.
            </span>{" "}
            Your data is encrypted using AES-256 and stored securely. We do not
            share your photos with third parties.
          </p>
        </div>

        {/* Demo note */}
        <p className="text-center text-xs text-muted-foreground">
          Demo: tap the upload buttons above to simulate verification steps.
        </p>

        <p className="text-center text-xs text-muted-foreground">
          By confirming, you agree to ServiceConnect&apos;s{" "}
          <span className="text-primary underline">Terms of Service</span> and{" "}
          <span className="text-primary underline">Privacy Policy</span>{" "}
          regarding identity data processing.
        </p>
      </div>
    </Screen>
  );
}
