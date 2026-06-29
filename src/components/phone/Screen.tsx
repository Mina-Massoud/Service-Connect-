import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "./PhoneFrame";
import { StatusBar, STATUS_BAR_HEIGHT } from "./StatusBar";
import { BottomNav, type NavTab, type Role } from "./BottomNav";

interface ScreenProps {
  children: ReactNode;
  /** Top bar (e.g. <ScreenHeader />). Rendered directly under the status bar. */
  header?: ReactNode;
  /** Sticky action area pinned above the bottom nav (e.g. primary CTA). */
  footer?: ReactNode;
  /** Show the bottom tab bar and highlight this tab. */
  activeTab?: NavTab;
  /** Which tab set the bottom nav renders (learner vs instructor). */
  role?: Role;
  /** Apply default horizontal/vertical padding to the scroll body. */
  padded?: boolean;
  bodyClassName?: string;
  /** Background tone of the scroll body. */
  tone?: "white" | "muted";
}

/**
 * The canonical screen wrapper. Renders the centered phone frame (device bezel
 * on desktop, full-bleed on mobile), the status bar, a scrollable body, and the
 * optional header / footer / bottom-nav chrome.
 *
 * Usage:
 *   <Screen header={<ScreenHeader title="Wallet" />} activeTab="wallet">
 *     ...content...
 *   </Screen>
 */
export function Screen({
  children,
  header,
  footer,
  activeTab,
  role = "learner",
  padded = true,
  bodyClassName,
  tone = "white",
}: ScreenProps) {
  return (
    <PhoneFrame>
      <StatusBar />
      {/* Safe-area spacer below the transparent status bar. Full-bleed screens
          (no header, no body padding) skip it so content runs edge-to-edge. */}
      {(padded || header) && (
        <div
          aria-hidden
          className="shrink-0"
          style={{ height: STATUS_BAR_HEIGHT }}
        />
      )}
      {header}
      <main
        className={cn(
          "no-scrollbar min-h-0 flex-1 overflow-y-auto",
          tone === "muted" ? "bg-page" : "bg-background",
          padded && "px-5 py-4",
          bodyClassName,
        )}
      >
        {children}
      </main>
      {footer && (
        <div className="shrink-0 border-t border-border bg-background px-5 py-3">
          {footer}
        </div>
      )}
      {activeTab && <BottomNav active={activeTab} role={role} />}
    </PhoneFrame>
  );
}
