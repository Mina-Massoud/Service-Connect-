"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";
import type { FocusTarget } from "@/lib/showcase/scenes";

// The app renders at a real phone width so its layouts are never cramped.
// The whole stage is then scaled to fit the viewport by the parent.
const DEVICE_W = 390;
const DEVICE_H = 812;
const GAP = 32;
const SHIFT = 150; // pre-scale px the pair slides to bias the focused device

/** Natural (unscaled) footprint of the two-device stage, for fit-to-viewport. */
export const STAGE_NATURAL = {
  width: DEVICE_W * 2 + GAP,
  height: DEVICE_H + 52, // device + label row
};

interface PhoneStageProps {
  focus: FocusTarget;
  zoom: number;
  focusY: number;
  learnerRef: RefObject<HTMLIFrameElement | null>;
  instructorRef: RefObject<HTMLIFrameElement | null>;
  learnerInitial: string;
  instructorInitial: string;
}

interface DeviceProps {
  label: string;
  accent: string;
  active: boolean;
  zoom: number;
  focusY: number;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  initial: string;
  title: string;
}

function Device({
  label,
  accent,
  active,
  zoom,
  focusY,
  iframeRef,
  initial,
  title,
}: DeviceProps) {
  const z = Math.min(zoom, 1.18);
  const scale = active ? z : 0.86;
  const translateY = active ? (0.5 - focusY) * 360 * (z - 1) : 0;

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      animate={{
        scale,
        y: translateY,
        opacity: active ? 1 : 0.32,
        filter: active ? "blur(0px) brightness(1)" : "blur(2.5px) brightness(0.7)",
      }}
      transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.9 }}
      style={{ transformOrigin: "center center" }}
    >
      <motion.div
        className="flex items-center gap-2"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <span className="text-sm font-semibold uppercase tracking-widest text-white/80">
          {label}
        </span>
      </motion.div>

      <div
        className="relative shrink-0 rounded-[52px] bg-gradient-to-br from-neutral-600 via-neutral-900 to-black p-[11px] shadow-[0_2px_4px_rgba(255,255,255,0.16)_inset,0_30px_70px_-18px_rgba(0,0,0,0.75)]"
        style={{ width: DEVICE_W, height: DEVICE_H }}
      >
        <iframe
          ref={iframeRef}
          src={initial}
          title={title}
          className="h-full w-full rounded-[42px] border-0 bg-white"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[52px]"
          animate={{
            boxShadow: active
              ? `0 0 0 2px ${accent}55, 0 0 40px 5px ${accent}40`
              : "0 0 0 0px transparent",
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

export function PhoneStage({
  focus,
  zoom,
  focusY,
  learnerRef,
  instructorRef,
  learnerInitial,
  instructorInitial,
}: PhoneStageProps) {
  const containerX =
    focus === "learner" ? SHIFT : focus === "instructor" ? -SHIFT : 0;

  return (
    <motion.div
      className="flex h-full w-full items-center justify-center"
      style={{ gap: GAP }}
      animate={{ x: containerX }}
      transition={{ type: "spring", stiffness: 110, damping: 24, mass: 1 }}
    >
      <Device
        label="Learner · Alex"
        accent="#2563EB"
        active={focus === "learner" || focus === "both"}
        zoom={focus === "both" ? 1 : zoom}
        focusY={focusY}
        iframeRef={learnerRef}
        initial={learnerInitial}
        title="Learner device"
      />
      <Device
        label="Publisher · Marco"
        accent="#7C3AED"
        active={focus === "instructor" || focus === "both"}
        zoom={focus === "both" ? 1 : zoom}
        focusY={focusY}
        iframeRef={instructorRef}
        initial={instructorInitial}
        title="Publisher device"
      />
    </motion.div>
  );
}
