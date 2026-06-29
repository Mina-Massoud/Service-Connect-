"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SubtitleBarProps {
  sceneId: string;
  chapter?: string;
  caption: string;
  sub?: string;
}

export function SubtitleBar({ sceneId, chapter, caption, sub }: SubtitleBarProps) {
  return (
    <div className="pointer-events-none flex min-h-[108px] flex-col items-center justify-end gap-2 px-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneId}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          {chapter && (
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              {chapter}
            </span>
          )}
          <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-3xl md:text-4xl">
            {caption}
          </h2>
          {sub && (
            <p className="max-w-xl text-balance text-sm text-white/70 sm:text-base md:text-lg">
              {sub}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
