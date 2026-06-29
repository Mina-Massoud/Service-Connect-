"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { PhoneStage, STAGE_NATURAL } from "@/components/showcase/PhoneStage";
import { SubtitleBar } from "@/components/showcase/SubtitleBar";
import { ShowcaseControls } from "@/components/showcase/ShowcaseControls";
import { sequences, type SequenceKey, type Scene } from "@/lib/showcase/scenes";
import { createSeedState } from "@/lib/store/seed";
import { savePersisted, clearPersisted } from "@/lib/store/persistence";
import type { AppState } from "@/lib/store/types";

const LEARNER_HOME = "/home";
const INSTRUCTOR_HOME = "/instructor";

type Device = "learner" | "instructor";

export default function ShowcasePage() {
  const [seqKey, setSeqKey] = useState<SequenceKey>("full");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [runId, setRunId] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);

  const scenes: readonly Scene[] = sequences[seqKey].scenes;
  const scene = scenes[Math.min(index, scenes.length - 1)];

  const learnerRef = useRef<HTMLIFrameElement | null>(null);
  const instructorRef = useRef<HTMLIFrameElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [fitScale, setFitScale] = useState(1);
  const directorState = useRef<AppState>(createSeedState());
  const ready = useRef<Record<Device, boolean>>({
    learner: false,
    instructor: false,
  });
  const pendingNav = useRef<Partial<Record<Device, string>>>({});
  const applied = useRef<Set<string>>(new Set());

  const sendNav = useCallback((device: Device, path: string) => {
    const frame =
      device === "learner" ? learnerRef.current : instructorRef.current;
    if (ready.current[device] && frame?.contentWindow) {
      frame.contentWindow.postMessage(
        { type: "sc-nav", path },
        window.location.origin,
      );
    } else {
      pendingNav.current[device] = path;
    }
  }, []);

  const seedReset = useCallback(() => {
    clearPersisted();
    directorState.current = createSeedState();
    savePersisted(directorState.current);
    applied.current.clear();
  }, []);

  const applyScene = useCallback(
    (s: Scene) => {
      const key = `${seqKey}:${s.id}`;
      if (s.director && !applied.current.has(key)) {
        directorState.current = s.director(directorState.current);
        savePersisted(directorState.current);
        applied.current.add(key);
      }
      if (s.navLearner) sendNav("learner", s.navLearner);
      if (s.navInstructor) sendNav("instructor", s.navInstructor);
    },
    [seqKey, sendNav],
  );

  // iframe readiness handshake + initial seed.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if ((e.data as { type?: string })?.type !== "sc-ready") return;
      const isLearner = e.source === learnerRef.current?.contentWindow;
      const isInstructor = e.source === instructorRef.current?.contentWindow;
      const device: Device | null = isLearner
        ? "learner"
        : isInstructor
          ? "instructor"
          : null;
      if (!device) return;
      ready.current[device] = true;
      const queued = pendingNav.current[device];
      if (queued) {
        sendNav(device, queued);
        delete pendingNav.current[device];
      }
    };
    window.addEventListener("message", onMessage);
    seedReset();
    return () => window.removeEventListener("message", onMessage);
  }, [seedReset, sendNav]);

  // Apply the scene (navigation + state) whenever the active scene changes.
  useEffect(() => {
    applyScene(scenes[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, runId, seqKey]);

  // Advance the timeline while playing.
  useEffect(() => {
    if (!playing) return;
    const current = scenes[index];
    const t = window.setTimeout(() => {
      if (index < scenes.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setPlaying(false);
      }
    }, current.durationMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing, runId, seqKey]);

  // Auto-hide the chrome while playing for clean recording. Chrome is always
  // shown while paused (derived below), so this effect only runs the idle timer.
  useEffect(() => {
    if (!playing) return;
    let timer = window.setTimeout(() => setChromeVisible(false), 2600);
    const wake = () => {
      setChromeVisible(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setChromeVisible(false), 2600);
    };
    window.addEventListener("mousemove", wake);
    return () => {
      window.removeEventListener("mousemove", wake);
      window.clearTimeout(timer);
    };
  }, [playing]);

  const showChrome = !playing || chromeVisible;

  const restart = useCallback(() => {
    seedReset();
    setIndex(0);
    setPlaying(true);
    setChromeVisible(true);
    setRunId((n) => n + 1);
  }, [seedReset]);

  const selectSequence = useCallback(
    (key: SequenceKey) => {
      seedReset();
      setSeqKey(key);
      setIndex(0);
      setPlaying(true);
      setChromeVisible(true);
      setRunId((n) => n + 1);
    },
    [seedReset],
  );

  const togglePlay = useCallback(() => {
    setChromeVisible(true);
    setPlaying((p) => !p);
  }, []);

  const next = useCallback(() => {
    setChromeVisible(true);
    setPlaying(false);
    setIndex((i) => Math.min(scenes.length - 1, i + 1));
  }, [scenes.length]);

  const prev = useCallback(() => {
    setChromeVisible(true);
    setPlaying(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  // Scale the two-device stage to fit the available area (devices keep their
  // real 390px render width, so app layouts never get cramped).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) return;
      const pad = 48;
      const s = Math.min(
        (r.width - pad) / STAGE_NATURAL.width,
        (r.height - pad) / STAGE_NATURAL.height,
        1,
      );
      setFitScale(s > 0.2 ? s : 0.2);
    };
    compute();
    const raf = requestAnimationFrame(compute);
    const t = window.setTimeout(compute, 250);
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", compute);
      ro.disconnect();
    };
  }, []);

  // Keyboard: ← / → to step scenes, Space to play/pause.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, togglePlay]);

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-neutral-950">
      {/* ambient backdrop */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        animate={{
          background: [
            "radial-gradient(circle, rgba(37,99,235,0.30), transparent 60%)",
            "radial-gradient(circle, rgba(124,58,237,0.30), transparent 60%)",
            "radial-gradient(circle, rgba(37,99,235,0.30), transparent 60%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.85))]" />

      {/* top bar */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-6 py-4"
        animate={{ opacity: showChrome ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit
        </Link>
        <p className="text-sm font-semibold tracking-tight text-white/80">
          ServiceConnect — Demo Reel
        </p>
        <div className="w-16" />
      </motion.header>

      {/* stage (clips so zoom never overlaps the subtitles) */}
      <div
        ref={stageRef}
        className="relative z-0 flex min-h-0 flex-1 items-center justify-center overflow-hidden"
      >
        {/* Outer box takes the SCALED layout size so flex centering stays
            correct; the inner natural-size stage is transform-scaled from its
            top-left to exactly fill it. */}
        <div
          style={{
            width: STAGE_NATURAL.width * fitScale,
            height: STAGE_NATURAL.height * fitScale,
          }}
        >
          <div
            style={{
              width: STAGE_NATURAL.width,
              height: STAGE_NATURAL.height,
              transform: `scale(${fitScale})`,
              transformOrigin: "top left",
            }}
          >
            <PhoneStage
              focus={scene.focus}
              zoom={scene.zoom ?? 1}
              focusY={scene.focusY ?? 0.5}
              learnerRef={learnerRef}
              instructorRef={instructorRef}
              learnerInitial={LEARNER_HOME}
              instructorInitial={INSTRUCTOR_HOME}
            />
          </div>
        </div>

        {/* prev / next arrows */}
        <motion.button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous scene"
          className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60 disabled:opacity-30 md:left-8"
          animate={{ opacity: showChrome ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
        <motion.button
          type="button"
          onClick={next}
          disabled={index === scenes.length - 1}
          aria-label="Next scene"
          className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60 disabled:opacity-30 md:right-8"
          animate={{ opacity: showChrome ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </div>

      {/* subtitles */}
      <div className="relative z-10">
        <SubtitleBar
          sceneId={scene.id}
          chapter={scene.chapter}
          caption={scene.caption}
          sub={scene.sub}
        />
      </div>

      {/* controls */}
      <motion.div
        className="relative z-10 flex justify-center px-6 pb-8 pt-4"
        animate={{ opacity: showChrome ? 1 : 0, y: showChrome ? 0 : 12 }}
        transition={{ duration: 0.4 }}
      >
        <ShowcaseControls
          seqKey={seqKey}
          onSelectSequence={selectSequence}
          playing={playing}
          onPlayPause={togglePlay}
          onRestart={restart}
          index={index}
          total={scenes.length}
          sceneKey={`${runId}-${scene.id}`}
          sceneDurationMs={scene.durationMs}
        />
      </motion.div>
    </div>
  );
}
