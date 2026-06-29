"use client";

import {
  Children,
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  /** Tailwind gap utility for the row (e.g. "gap-3"). */
  gap?: string;
  /**
   * Classes for the scroll row — pass edge-bleed/padding here
   * (e.g. "-mx-5 px-5 pb-1") so cards reach the screen edges.
   */
  className?: string;
  /** Accessible label for the scrollable region. */
  label?: string;
}

const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag

/**
 * Horizontal drag-to-scroll row. Touch devices use native momentum swipe;
 * pointer devices (mouse/trackpad) can click-and-drag to scroll. No arrow
 * controls — movement is gestural. A plain click always reaches the child
 * (link/button): drag state only engages once the pointer moves past a
 * threshold, so children stay fully interactive for normal clicks.
 */
export function Carousel({
  children,
  gap = "gap-3",
  className,
  label = "Scrollable content",
}: CarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const pressed = useRef(false);
  const moved = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    // Touch uses native scrolling; only hijack mouse/pen for drag.
    if (e.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;
    pressed.current = true;
    moved.current = false;
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
    // NOTE: do not engage drag state here — that would disable child
    // pointer-events and swallow the click. Wait for real movement.
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pressed.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - startX.current;
    if (!moved.current && Math.abs(dx) > DRAG_THRESHOLD) {
      moved.current = true;
      setDragging(true); // now it's a real drag: dim children, change cursor
      el.setPointerCapture?.(e.pointerId);
    }
    if (moved.current) el.scrollLeft = startScroll.current - dx;
  }, []);

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pressed.current) return;
    pressed.current = false;
    setDragging(false);
    scrollerRef.current?.releasePointerCapture?.(e.pointerId);
  }, []);

  // Swallow the click that immediately follows a drag so cards don't navigate
  // mid-swipe. A plain click (no movement) passes straight through.
  const onClickCapture = useCallback((e: ReactMouseEvent) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  }, []);

  return (
    <div
      ref={scrollerRef}
      role="group"
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      className={cn(
        "flex snap-x snap-proximity overflow-x-auto no-scrollbar",
        dragging
          ? "cursor-grabbing select-none [&_*]:pointer-events-none"
          : "cursor-grab",
        gap,
        className,
      )}
    >
      {Children.map(children, (child) => (
        <div className="shrink-0 snap-start">{child}</div>
      ))}
    </div>
  );
}
