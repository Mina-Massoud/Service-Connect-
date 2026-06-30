"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";
import { IPhoneMockup } from "react-device-mockup";
import type { FocusTarget } from "@/lib/showcase/scenes";

interface PhoneStageProps {
  focus: FocusTarget;
  learnerRef: RefObject<HTMLIFrameElement | null>;
  instructorRef: RefObject<HTMLIFrameElement | null>;
  learnerInitial: string;
  instructorInitial: string;
  /** Bump to force both iframes to fully reload (used by Restart). */
  reloadKey: number;
}

const SCREEN_W = 300;

interface DeviceProps {
  label: string;
  active: boolean;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  initial: string;
  title: string;
  reloadKey: number;
}

/**
 * A real iPhone mockup (same frame as PhoneFrame) wrapping the live iframe.
 * Both devices stay on screen; the one that isn't the focus blurs and dims so
 * the active side reads clearly while the pair stays visible.
 */
function Device({
  label,
  active,
  iframeRef,
  initial,
  title,
  reloadKey,
}: DeviceProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      animate={{
        opacity: active ? 1 : 0.55,
        filter: active ? "blur(0px)" : "blur(3px)",
        scale: active ? 1 : 0.93,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: active ? "#FF385C" : "#C7C7C7" }}
        />
        <span
          className={`text-xs font-semibold ${
            active ? "text-neutral-700" : "text-neutral-400"
          }`}
        >
          {label}
        </span>
      </div>

      <IPhoneMockup
        screenWidth={SCREEN_W}
        screenType="island"
        frameColor="#1d1d1f"
        statusbarColor="#ffffff"
        hideStatusBar
      >
        <iframe
          key={reloadKey}
          ref={iframeRef}
          src={initial}
          title={title}
          className="h-full w-full border-0 bg-white"
        />
      </IPhoneMockup>
    </motion.div>
  );
}

export function PhoneStage({
  focus,
  learnerRef,
  instructorRef,
  learnerInitial,
  instructorInitial,
  reloadKey,
}: PhoneStageProps) {
  return (
    <div className="flex items-center justify-center gap-5 md:gap-8">
      <Device
        label="Learner · Alex"
        active={focus === "learner" || focus === "both"}
        iframeRef={learnerRef}
        initial={learnerInitial}
        title="Learner device"
        reloadKey={reloadKey}
      />
      <Device
        label="Publisher · Marco"
        active={focus === "instructor" || focus === "both"}
        iframeRef={instructorRef}
        initial={instructorInitial}
        title="Publisher device"
        reloadKey={reloadKey}
      />
    </div>
  );
}
