import { Signal, Wifi, BatteryFull } from "lucide-react";

/**
 * iOS-style status bar shown at the top of every screen inside the iPhone 17
 * frame. The center gap is left clear for the Dynamic Island, so the time sits
 * on the left and the radio/battery cluster on the right.
 */
/** Height of the status bar overlay; exported so screens can offset content. */
export const STATUS_BAR_HEIGHT = 44;

export function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[44px] items-end justify-between px-7 pb-1.5 text-foreground [text-shadow:0_0_3px_rgba(255,255,255,0.4)]">
      <span className="w-[54px] text-[15px] font-semibold tracking-tight">
        9:41
      </span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <Wifi className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <BatteryFull className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
    </div>
  );
}
