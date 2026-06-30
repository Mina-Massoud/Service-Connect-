import type { AppState } from "./types";

const STORAGE_KEY = "serviceconnect:state:v3";
const CHANNEL_NAME = "serviceconnect:sync:v3";

export function loadPersisted(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppState) : null;
  } catch {
    return null;
  }
}

export function savePersisted(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full / unavailable — demo can continue in-memory
  }
}

export function clearPersisted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

type RemoteHandler = (state: AppState) => void;

/**
 * Broadcast a state change to other same-origin contexts (the two demo iframes,
 * other tabs) and subscribe to theirs. Returns an unsubscribe + a broadcast fn.
 */
export function createSyncBridge(onRemote: RemoteHandler): {
  broadcast: (state: AppState) => void;
  dispose: () => void;
} {
  if (typeof window === "undefined") {
    return { broadcast: () => {}, dispose: () => {} };
  }

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (e: MessageEvent<AppState>) => onRemote(e.data);
  }

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        onRemote(JSON.parse(e.newValue) as AppState);
      } catch {
        // ignore malformed
      }
    }
  };
  window.addEventListener("storage", onStorage);

  return {
    broadcast: (state: AppState) => channel?.postMessage(state),
    dispose: () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    },
  };
}
