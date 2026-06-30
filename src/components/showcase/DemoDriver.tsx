"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";
import { DEMO_SCRIPTS, type DemoStep } from "@/lib/showcase/demoScripts";

interface CursorPos {
  x: number;
  y: number;
}

const HIDE = { x: -100, y: -100 };

function setNativeValue(
  el: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Mounted globally. Inside the showcase reel iframes it renders an animated
 * cursor and plays named scripts (typing into fields, clicking toggles,
 * pressing CTAs) when the parent posts `{ type: "sc-demo", script }`.
 * No-op outside an iframe.
 */
export function DemoDriver() {
  const [pos, setPos] = useState<CursorPos>(HIDE);
  const [pressing, setPressing] = useState(false);
  const [visible, setVisible] = useState(false);
  const runToken = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.self === window.top) return; // only inside the reel iframes

    const moveTo = (x: number, y: number) => setPos({ x, y });

    const findEl = async (sel: string): Promise<HTMLElement | null> => {
      const q = `[data-demo="${sel}"]`;
      for (let i = 0; i < 70; i++) {
        const el = document.querySelector<HTMLElement>(q);
        if (el && el.offsetParent !== null) return el;
        await delay(90);
      }
      return null;
    };

    const centerOf = (el: HTMLElement): CursorPos => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const runStep = async (step: DemoStep, token: number) => {
      if (token !== runToken.current) return;
      if (step.a === "wait") return delay(step.ms);

      const el = await findEl(step.sel);
      // Missing element: skip this step rather than stalling the whole reel.
      if (!el || token !== runToken.current) return;
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      await delay(320);
      const c = centerOf(el);
      moveTo(c.x, c.y);
      await delay(820); // let the cursor glide over

      if (token !== runToken.current) return;

      if (step.a === "type") {
        const field = el as HTMLInputElement | HTMLTextAreaElement;
        field.focus();
        const cps = step.cps ?? 20;
        const per = Math.max(28, Math.round(1000 / cps));
        for (let i = 1; i <= step.text.length; i++) {
          if (token !== runToken.current) return;
          setNativeValue(field, step.text.slice(0, i));
          await delay(per);
        }
        await delay(500); // pause on the filled field
        return;
      }

      // `click` performs a REAL click (navigation Links/tabs/cards — safe, no
      // store mutation). `press` is a visual cursor-press only (mutating CTAs —
      // the reel parent owns that state + navigation to avoid corrupting the
      // shared two-persona session).
      setPressing(true);
      await delay(220);
      setPressing(false);
      if (step.a === "click") el.click();
      await delay(450); // let the click's result settle / be seen
    };

    const runScript = async (name: string) => {
      const steps = DEMO_SCRIPTS[name];
      const token = ++runToken.current;
      setVisible(true);
      if (steps) {
        for (const step of steps) {
          if (token !== runToken.current) return;
          await runStep(step, token);
        }
      }
      if (token !== runToken.current) return;
      // Brief dwell on the finished screen, then advance.
      await delay(650);
      if (token !== runToken.current) return;
      window.parent?.postMessage(
        { type: "demo:done", script: name },
        window.location.origin,
      );
    };

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; script?: string };
      if (data?.type === "sc-demo" && data.script) {
        void runScript(data.script);
      } else if (data?.type === "sc-demo-off") {
        runToken.current++;
        setVisible(false);
        setPos(HIDE);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="relative -left-1 -top-1">
        {pressing && (
          <span className="absolute left-1.5 top-1.5 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary/40" />
        )}
        <MousePointer2
          className="h-6 w-6 fill-white text-neutral-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
          style={{ transform: pressing ? "scale(0.82)" : "scale(1)" }}
        />
      </div>
    </div>
  );
}
