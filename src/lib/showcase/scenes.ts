import { reducer } from "@/lib/store/reducer";
import type { AppState } from "@/lib/store/types";

export type FocusTarget = "learner" | "instructor" | "both";

export interface Scene {
  id: string;
  caption: string;
  sub?: string;
  durationMs: number;
  focus: FocusTarget;
  /** Extra cinematic zoom applied to the focused device (1 = none). */
  zoom?: number;
  /** Vertical bias of the zoom, 0 (top) … 1 (bottom). Default 0.5. */
  focusY?: number;
  /** Route to push into each device (omit to leave it where it was). */
  navLearner?: string;
  navInstructor?: string;
  /** Optional real state mutation, applied via the store reducer. */
  director?: (s: AppState) => AppState;
  /** Chapter label shown in the corner. */
  chapter?: string;
}

const HERO = "bk-1024"; // Alex's deep-cleaning booking (seeded as escrow_held)

const accept = (s: AppState): AppState =>
  reducer(s, { type: "ACCEPT_BOOKING", bookingId: HERO });
const complete = (s: AppState): AppState =>
  reducer(s, { type: "COMPLETE_BOOKING", bookingId: HERO });

// ── Learner journey ────────────────────────────────────────────────
const learnerScenes: Scene[] = [
  {
    id: "l-meet",
    chapter: "The Learner",
    caption: "Meet Alex.",
    sub: "He wants to learn a new skill this weekend.",
    focus: "learner",
    zoom: 1.04,
    navLearner: "/home",
    durationMs: 4200,
  },
  {
    id: "l-explore",
    chapter: "The Learner",
    caption: "He explores the marketplace.",
    sub: "Search by skill, browse categories, discover mentors.",
    focus: "learner",
    zoom: 1.28,
    focusY: 0.12,
    navLearner: "/home",
    durationMs: 4000,
  },
  {
    id: "l-find",
    chapter: "The Learner",
    caption: "He finds a 5-star class.",
    sub: "Professional Deep-Home Cleaning · 4.9 ★ · Verified mentor.",
    focus: "learner",
    zoom: 1.06,
    navLearner: "/service/deep-cleaning",
    durationMs: 4400,
  },
  {
    id: "l-book",
    chapter: "The Learner",
    caption: "Picks a time and books in a tap.",
    sub: "Choose a date, a slot, the quantity — done.",
    focus: "learner",
    zoom: 1.32,
    focusY: 0.58,
    navLearner: "/service/deep-cleaning",
    durationMs: 4400,
  },
  {
    id: "l-review",
    chapter: "The Learner",
    caption: "Transparent pricing.",
    sub: "Service price and platform fee — no surprises.",
    focus: "learner",
    zoom: 1.12,
    navLearner: `/booking/${HERO}/review`,
    durationMs: 4200,
  },
  {
    id: "l-escrow",
    chapter: "The Learner",
    caption: "Paid safely into escrow.",
    sub: "Funds are held securely until the session is complete.",
    focus: "learner",
    zoom: 1.12,
    navLearner: `/booking/${HERO}/payment-secured`,
    durationMs: 4400,
  },
];

// ── Publisher / instructor journey ─────────────────────────────────
const publisherScenes: Scene[] = [
  {
    id: "p-meet",
    chapter: "The Publisher",
    caption: "Meet Marco.",
    sub: "He earns by teaching what he already knows.",
    focus: "instructor",
    zoom: 1.04,
    navInstructor: "/instructor",
    durationMs: 4200,
  },
  {
    id: "p-request",
    chapter: "The Publisher",
    caption: "A new booking lands — live.",
    sub: "Alex's request shows up the moment it's paid.",
    focus: "instructor",
    zoom: 1.26,
    focusY: 0.44,
    navInstructor: "/instructor",
    durationMs: 4200,
  },
  {
    id: "p-detail",
    chapter: "The Publisher",
    caption: "He reviews the request.",
    sub: "Schedule, student note, and his $68 payout.",
    focus: "instructor",
    zoom: 1.1,
    navInstructor: `/instructor/bookings/${HERO}`,
    durationMs: 4400,
  },
  {
    id: "p-accept",
    chapter: "The Publisher",
    caption: "One tap to accept.",
    sub: "Marco confirms the session.",
    focus: "instructor",
    zoom: 1.22,
    focusY: 0.82,
    navInstructor: `/instructor/bookings/${HERO}`,
    director: accept,
    durationMs: 4200,
  },
  {
    id: "p-sync",
    chapter: "In Sync",
    caption: "Watch Alex's order update — instantly.",
    sub: "Both sides stay perfectly in sync, in real time.",
    focus: "learner",
    zoom: 1.16,
    navLearner: `/orders/${HERO}`,
    durationMs: 5000,
  },
  {
    id: "p-complete",
    chapter: "In Sync",
    caption: "The session wraps up.",
    sub: "Completion is confirmed and escrow releases automatically.",
    focus: "learner",
    zoom: 1.12,
    navLearner: `/orders/${HERO}/completion`,
    director: complete,
    durationMs: 4600,
  },
  {
    id: "p-wallet",
    chapter: "The Publisher",
    caption: "Funds land in Marco's wallet.",
    sub: "Available to withdraw to his bank anytime.",
    focus: "instructor",
    zoom: 1.16,
    navInstructor: "/wallet",
    durationMs: 4400,
  },
];

const finale: Scene = {
  id: "finale",
  chapter: "ServiceConnect",
  caption: "Two sides. One seamless marketplace.",
  sub: "Learn from real people. Earn from real skills.",
  focus: "both",
  zoom: 1,
  durationMs: 5200,
};

export const sequences = {
  full: {
    label: "Full Story",
    scenes: [...learnerScenes, ...publisherScenes, finale],
  },
  learner: {
    label: "Learner Flow",
    scenes: [...learnerScenes, finale],
  },
  publisher: {
    label: "Publisher Flow",
    scenes: [...publisherScenes, finale],
  },
} as const;

export type SequenceKey = keyof typeof sequences;
