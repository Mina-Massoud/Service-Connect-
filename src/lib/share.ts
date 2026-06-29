export type ShareResult = "shared" | "copied" | "failed";

/**
 * Share a link using the Web Share API when available, otherwise copy it to
 * the clipboard. Returns what actually happened so the caller can surface a
 * matching toast. Demo-only — the URL is synthesized from the current origin.
 */
export async function shareLink(input: {
  title: string;
  text?: string;
  path: string;
}): Promise<ShareResult> {
  if (typeof window === "undefined") return "failed";
  const url = `${window.location.origin}${input.path}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: input.title, text: input.text, url });
      return "shared";
    } catch {
      // User dismissed the sheet, or share failed — fall through to copy.
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
