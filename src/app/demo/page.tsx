"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Megaphone, RotateCcw, ArrowLeft, Play } from "lucide-react";

interface DeviceProps {
  src: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accent: string; // hex
  reloadKey: number;
}

function Device({ src, label, sublabel, icon, accent, reloadKey }: DeviceProps) {
  return (
    <div className="flex w-full max-w-[422px] flex-col items-center gap-4">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: accent }}
        >
          {icon}
        </span>
        <div className="text-left">
          <p className="text-sm font-bold leading-tight text-white">{label}</p>
          <p className="text-xs leading-tight text-neutral-400">{sublabel}</p>
        </div>
      </div>

      {/* iPhone-17 titanium bezel — the iframe renders its own Dynamic Island */}
      <div
        className="relative w-full max-w-[422px] rounded-[56px] bg-gradient-to-br from-neutral-700 via-neutral-900 to-black p-[11px] shadow-[0_2px_4px_rgba(255,255,255,0.18)_inset,0_30px_80px_-20px_rgba(0,0,0,0.7)]"
        style={{ aspectRatio: "422 / 860" }}
      >
        {/* hardware side buttons */}
        <span className="absolute -left-[2px] top-[120px] h-7 w-[3px] rounded-l-sm bg-neutral-950" />
        <span className="absolute -left-[2px] top-[176px] h-12 w-[3px] rounded-l-sm bg-neutral-950" />
        <span className="absolute -left-[2px] top-[240px] h-12 w-[3px] rounded-l-sm bg-neutral-950" />
        <span className="absolute -right-[2px] top-[200px] h-16 w-[3px] rounded-r-sm bg-neutral-950" />
        <iframe
          key={reloadKey}
          src={src}
          title={label}
          className="h-full w-full rounded-[46px] border-0 bg-white"
        />
      </div>
    </div>
  );
}

export default function DemoPage() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-700"
            aria-label="Back to welcome"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold tracking-tight sm:text-lg">
              ServiceConnect — Two-Sided Marketplace
            </h1>
            <p className="text-sm text-neutral-400">
              The same booking, seen from both sides. Each device is fully
              clickable.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/showcase"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Demo reel
          </Link>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            <RotateCcw className="h-4 w-4" />
            Restart demo
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-center lg:gap-20">
          <Device
            src="/instructor"
            label="Instructor"
            sublabel="Publishes the service · sees who booked"
            icon={<Megaphone className="h-5 w-5" />}
            accent="#7C3AED"
            reloadKey={reloadKey}
          />
          <Device
            src="/home"
            label="Learner"
            sublabel="Discovers a skill · books a session"
            icon={<GraduationCap className="h-5 w-5" />}
            accent="#FF385C"
            reloadKey={reloadKey}
          />
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm text-neutral-300">
          <p className="mb-2 font-semibold text-white">Try the flow</p>
          <ol className="list-inside list-decimal space-y-1 text-neutral-400">
            <li>
              <span className="text-neutral-200">Instructor</span> → Dashboard →
              create / manage a listing and review incoming booking requests.
            </li>
            <li>
              <span className="text-neutral-200">Learner</span> → Home → open a
              service → pick a time → book &amp; pay into escrow.
            </li>
            <li>
              Watch the booking appear on the Instructor&apos;s side under
              Bookings, ready to accept and complete.
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
