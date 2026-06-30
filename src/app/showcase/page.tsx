"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneStage } from "@/components/showcase/PhoneStage";
import { ShowcaseControls } from "@/components/showcase/ShowcaseControls";
import { sequences, type SequenceKey, type Scene } from "@/lib/showcase/scenes";
import { createSeedState } from "@/lib/store/seed";
import { savePersisted, clearPersisted } from "@/lib/store/persistence";
import type { AppState } from "@/lib/store/types";

// Both devices boot at the welcome screen so the cursor can walk in from the
// very start (sign up / log in) rather than teleporting into the app.
const LEARNER_HOME = "/";
const INSTRUCTOR_HOME = "/";

type Device = "learner" | "instructor";

export default function ShowcasePage() {
  const [seqKey, setSeqKey] = useState<SequenceKey>("full");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [runId, setRunId] = useState(0);

  const scenes: readonly Scene[] = sequences[seqKey].scenes;
  const scene = scenes[Math.min(index, scenes.length - 1)];

  const learnerRef = useRef<HTMLIFrameElement | null>(null);
  const instructorRef = useRef<HTMLIFrameElement | null>(null);
  const directorState = useRef<AppState>(createSeedState());
  const ready = useRef<Record<Device, boolean>>({
    learner: false,
    instructor: false,
  });
  const pendingNav = useRef<Partial<Record<Device, string>>>({});
  const applied = useRef<Set<string>>(new Set());
  // True for the next applyScene when the index change came from a manual
  // seek (next/prev/restart/sequence) — forces a teleport to the scene's route.
  const seekRef = useRef(false);
  // Mirrors of the active scene + playing state, readable inside the (stable)
  // ready-handshake listener so it can (re)start the cursor on cold loads.
  const sceneRef = useRef(scenes[0]);
  const playingRef = useRef(true);

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

  const postToFrame = useCallback((device: Device, data: unknown) => {
    const frame =
      device === "learner" ? learnerRef.current : instructorRef.current;
    frame?.contentWindow?.postMessage(data, window.location.origin);
  }, []);

  const seedReset = useCallback(() => {
    clearPersisted();
    directorState.current = createSeedState();
    savePersisted(directorState.current);
    applied.current.clear();
  }, []);

  const applyScene = useCallback(
    (s: Scene, seek = false) => {
      // On a manual seek, rebuild state from seed by replaying every director
      // up to and including this scene, so jumping back/forward is consistent.
      if (seek) {
        let st = createSeedState();
        applied.current.clear();
        const upto = scenes.indexOf(s);
        for (let i = 0; i <= upto; i++) {
          const d = scenes[i].director;
          if (d) {
            st = d(st);
            applied.current.add(`${seqKey}:${scenes[i].id}`);
          }
        }
        directorState.current = st;
        savePersisted(st);
      }

      const key = `${seqKey}:${s.id}`;
      if (s.director && !applied.current.has(key)) {
        directorState.current = s.director(directorState.current);
        savePersisted(directorState.current);
        applied.current.add(key);
      }
      // During autoplay, selfNav scenes navigate via the cursor (walk shown),
      // so the parent skips the teleport. Manual seeks always teleport so they
      // land on the right screen even when jumping around.
      if (seek || !s.selfNav) {
        if (s.navLearner) sendNav("learner", s.navLearner);
        if (s.navInstructor) sendNav("instructor", s.navInstructor);
      }

      // Kill any running cursor, then play this scene's cursor. On a seek we
      // first teleported to the scene's screen, so give the route a beat to
      // render before the cursor starts hunting for elements.
      postToFrame("learner", { type: "sc-demo-off" });
      postToFrame("instructor", { type: "sc-demo-off" });
      if (s.demo) {
        const device: Device = s.focus === "learner" ? "learner" : "instructor";
        const script = s.demo;
        window.setTimeout(
          () => postToFrame(device, { type: "sc-demo", script }),
          seek ? 650 : 250,
        );
      }
    },
    [seqKey, scenes, sendNav, postToFrame],
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
      // Cold-load race fix: the very first sc-demo can be posted before this
      // iframe's DemoDriver listener exists. When the iframe (re)announces it's
      // ready, (re)start the active scene's cursor on the focused device.
      const cur = sceneRef.current;
      const focusDevice: Device =
        cur.focus === "learner" ? "learner" : "instructor";
      if (playingRef.current && cur.demo && focusDevice === device) {
        const script = cur.demo;
        window.setTimeout(() => {
          postToFrame(device, { type: "sc-demo", script });
        }, 500);
      }
    };
    window.addEventListener("message", onMessage);
    seedReset();
    return () => window.removeEventListener("message", onMessage);
  }, [seedReset, sendNav, postToFrame]);

  // Keep refs current for the ready-handshake listener.
  useEffect(() => {
    sceneRef.current = scene;
    playingRef.current = playing;
  });

  // Apply the scene (navigation + state) whenever the active scene changes.
  useEffect(() => {
    applyScene(scenes[index], seekRef.current);
    seekRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, runId, seqKey]);

  const advance = useCallback(() => {
    setIndex((i) => {
      if (i < scenes.length - 1) return i + 1;
      setPlaying(false);
      return i;
    });
  }, [scenes.length]);

  // Advance the timeline while playing. Scripted scenes get a long fallback
  // timeout — they normally advance early on the driver's `demo:done` event.
  useEffect(() => {
    if (!playing) return;
    const current = scenes[index];
    const ms = current.demo
      ? Math.max(current.durationMs, 16000)
      : current.durationMs;
    const t = window.setTimeout(advance, ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing, runId, seqKey]);

  // Event-driven advance: when the focused device finishes its script, move on.
  useEffect(() => {
    if (!playing) return;
    const onDone = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; script?: string };
      if (data?.type !== "demo:done") return;
      if (data.script && data.script === scenes[index]?.demo) advance();
    };
    window.addEventListener("message", onDone);
    return () => window.removeEventListener("message", onDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing, runId, seqKey]);

  // Restart / sequence switch = full reset: reseed, reload both iframes (the
  // runId bump remounts them), and autoplay from scene 0 with the cursor.
  const restart = useCallback(() => {
    seedReset();
    ready.current = { learner: false, instructor: false };
    pendingNav.current = {};
    seekRef.current = false;
    setIndex(0);
    setPlaying(true);
    setRunId((n) => n + 1);
  }, [seedReset]);

  const selectSequence = useCallback(
    (key: SequenceKey) => {
      seedReset();
      ready.current = { learner: false, instructor: false };
      pendingNav.current = {};
      seekRef.current = false;
      setSeqKey(key);
      setIndex(0);
      setPlaying(true);
      setRunId((n) => n + 1);
    },
    [seedReset],
  );

  const togglePlay = useCallback(() => {
    const nextPlaying = !playingRef.current;
    setPlaying(nextPlaying);
    if (!nextPlaying) {
      // Pause: stop the cursor where it is.
      postToFrame("learner", { type: "sc-demo-off" });
      postToFrame("instructor", { type: "sc-demo-off" });
    } else {
      // Resume: replay the current scene's cursor from the top.
      const s = sceneRef.current;
      if (s.demo) {
        const device: Device = s.focus === "learner" ? "learner" : "instructor";
        const script = s.demo;
        window.setTimeout(() => {
          postToFrame(device, { type: "sc-demo", script });
        }, 200);
      }
    }
  }, [postToFrame]);

  // Next/Prev jump to the adjacent slide and keep playing — the jumped-to
  // scene's cursor plays, then the timeline continues from there.
  const next = useCallback(() => {
    setPlaying(true);
    seekRef.current = true;
    setIndex((i) => Math.min(scenes.length - 1, i + 1));
  }, [scenes.length]);

  const prev = useCallback(() => {
    setPlaying(true);
    seekRef.current = true;
    setIndex((i) => Math.max(0, i - 1));
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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* top bar */}

      {/* stage: [ left text | phones | right text ] */}
      <main className="grid min-h-0 flex-1 grid-cols-1 items-center gap-6 px-8 py-4 xl:grid-cols-[1fr_auto_1fr] xl:gap-10 xl:px-12">
        {/* LEFT — headline */}
        <div className="hidden xl:flex xl:justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={`cap-${scene.id}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xs text-right"
            >
              {scene.chapter && (
                <p className="mb-3 text-xs font-bold uppercase text-primary">
                  {scene.chapter}
                </p>
              )}
              <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground xl:text-4xl">
                {scene.caption}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTER — phones */}
        <div className="flex items-center justify-center">
          <PhoneStage
            focus={scene.focus}
            learnerRef={learnerRef}
            instructorRef={instructorRef}
            learnerInitial={LEARNER_HOME}
            instructorInitial={INSTRUCTOR_HOME}
            reloadKey={runId}
          />
        </div>

        {/* RIGHT — detail */}
        <div className="hidden xl:flex xl:justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={`sub-${scene.id}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xs text-left"
            >
              {scene.sub && (
                <p className="text-balance text-lg leading-relaxed text-muted-foreground">
                  {scene.sub}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Small screens: caption below the phones */}
        <div className="text-center xl:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`m-${scene.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {scene.chapter && (
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  {scene.chapter}
                </p>
              )}
              <h2 className="text-balance text-xl font-bold tracking-tight text-foreground">
                {scene.caption}
              </h2>
              {scene.sub && (
                <p className="mx-auto mt-2 max-w-md text-balance text-sm text-muted-foreground">
                  {scene.sub}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* controls */}
      <div className="flex shrink-0 justify-center px-6 pb-7 pt-3">
        <ShowcaseControls
          seqKey={seqKey}
          onSelectSequence={selectSequence}
          playing={playing}
          onPlayPause={togglePlay}
          onRestart={restart}
          onPrev={prev}
          onNext={next}
          index={index}
          total={scenes.length}
          sceneKey={`${runId}-${scene.id}`}
          sceneDurationMs={scene.durationMs}
        />
      </div>
    </div>
  );
}
