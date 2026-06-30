"use client";

import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { sequences, type SequenceKey } from "@/lib/showcase/scenes";

interface ShowcaseControlsProps {
  seqKey: SequenceKey;
  onSelectSequence: (key: SequenceKey) => void;
  playing: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onPrev: () => void;
  onNext: () => void;
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
  onPrev,
  onNext,
  index,
  total,
  sceneKey,
  sceneDurationMs,
}: ShowcaseControlsProps) {
  const keys = Object.keys(sequences) as SequenceKey[];

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      {/* progress bar */}
      <div className="flex w-full items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200"
          >
            {i < index && <div className="h-full w-full bg-neutral-400" />}
            {i === index && (
              <motion.div
                key={sceneKey}
                className="h-full bg-primary"
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
        <div className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onSelectSequence(k)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                seqKey === k
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sequences[k].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            aria-label="Previous scene"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105"
          >
            {playing ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={index === total - 1}
            aria-label="Next scene"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onRestart}
            aria-label="Restart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
