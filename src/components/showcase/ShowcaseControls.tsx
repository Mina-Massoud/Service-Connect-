"use client";

import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { sequences, type SequenceKey } from "@/lib/showcase/scenes";

interface ShowcaseControlsProps {
  seqKey: SequenceKey;
  onSelectSequence: (key: SequenceKey) => void;
  playing: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  index: number;
  total: number;
  sceneKey: string;
  sceneDurationMs: number;
}

export function ShowcaseControls({
  seqKey,
  onSelectSequence,
  playing,
  onPlayPause,
  onRestart,
  index,
  total,
  sceneKey,
  sceneDurationMs,
}: ShowcaseControlsProps) {
  const keys = Object.keys(sequences) as SequenceKey[];

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      {/* progress bar */}
      <div className="flex w-full items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"
          >
            {i < index && <div className="h-full w-full bg-white/80" />}
            {i === index && (
              <motion.div
                key={sceneKey}
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: playing ? "100%" : "0%" }}
                transition={{
                  duration: playing ? sceneDurationMs / 1000 : 0,
                  ease: "linear",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* sequence selector */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onSelectSequence(k)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                seqKey === k
                  ? "bg-white text-neutral-900"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {sequences[k].label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onPlayPause}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition-transform hover:scale-105"
        >
          {playing ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5" fill="currentColor" />
          )}
        </button>

        <button
          type="button"
          onClick={onRestart}
          aria-label="Restart"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/10"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
