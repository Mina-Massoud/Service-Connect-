"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Mounted globally. When the app runs inside an iframe (the showcase reel),
 * it lets the parent page drive client-side navigation via postMessage —
 * `{ type: "sc-nav", path }` → router.push(path) — with no full reload.
 * State changes are driven separately by the parent writing localStorage,
 * which the store's storage-sync already picks up.
 */
export function TourBridge() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only active inside an iframe.
    if (window.self === window.top) return;

    const announceReady = () => {
      window.parent?.postMessage(
        { type: "sc-ready" },
        window.location.origin,
      );
    };

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; path?: string };
      if (data?.type === "sc-nav" && typeof data.path === "string") {
        router.push(data.path);
      }
    };

    window.addEventListener("message", onMessage);
    announceReady();
    // Re-announce shortly after in case the parent listener mounts late.
    const t = window.setTimeout(announceReady, 400);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(t);
    };
  }, [router]);

  return null;
}
