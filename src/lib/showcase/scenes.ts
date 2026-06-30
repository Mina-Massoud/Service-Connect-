import { reducer } from "@/lib/store/reducer";
import type { AppState } from "@/lib/store/types";

export type FocusTarget = "learner" | "instructor" | "both";

export interface Scene {
  id: string;
  caption: string;
  sub?: string;
  durationMs: number;
  focus: FocusTarget;
  /** Route the reel pushes into a device (for screens not reached by a tap). */
  navLearner?: string;
  navInstructor?: string;
  /** Optional real state mutation, applied via the store reducer. */
  director?: (s: AppState) => AppState;
  /** Named DemoDriver script (cursor walks + types) for the focused device. */
  demo?: string;
  /**
   * The scene's own demo script navigates here via cursor taps. During
   * autoplay the reel skips the parent nav so the walk is visible; manual
   * seeks (next/prev) still teleport to the route so they land correctly.
   */
  selfNav?: boolean;
  /** Chapter label shown beside the phones. */
  chapter?: string;
}

const HERO = "bk-1024"; // Alex's fishing booking (seeded as escrow_held, newest)

// ── State directors ────────────────────────────────────────────────
const setVerified = (s: AppState): AppState =>
  reducer(s, { type: "SET_VERIFIED", verified: true });
const connectBank = (s: AppState): AppState =>
  reducer(s, {
    type: "ADD_BANK",
    bank: {
      id: "ba-demo",
      bankName: "Chase Premier Checking",
      last4: "8421",
      primary: false,
    },
  });
const approveListing = (s: AppState): AppState =>
  reducer(s, { type: "APPROVE_LISTING", listingId: "move-out-cleaning" });
const accept = (s: AppState): AppState =>
  reducer(s, { type: "ACCEPT_BOOKING", bookingId: HERO });
const startSession = (s: AppState): AppState =>
  reducer(s, { type: "START_SESSION", bookingId: HERO });
const complete = (s: AppState): AppState =>
  reducer(s, { type: "COMPLETE_BOOKING", bookingId: HERO });

// ── Act 1 — Marco becomes a publisher ──────────────────────────────
const onboardingScenes: Scene[] = [
  {
    id: "p-signup",
    chapter: "Becoming a Publisher",
    caption: "Marco joins ServiceConnect.",
    sub: "He creates his account.",
    focus: "instructor",
    navInstructor: "/auth",
    demo: "signup",
    durationMs: 8000,
  },
  {
    id: "p-profile",
    chapter: "Becoming a Publisher",
    caption: "He sets up his profile.",
    sub: "Chooses to teach, then adds a bio and where he's based.",
    focus: "instructor",
    navInstructor: "/onboarding/profile",
    demo: "onboard-profile",
    durationMs: 8500,
  },
  {
    id: "p-verify",
    chapter: "Identity Verification",
    caption: "He proves who he is.",
    sub: "A government ID and a live selfie — the trust step every publisher passes.",
    focus: "instructor",
    navInstructor: "/onboarding/verify",
    demo: "verify",
    director: setVerified,
    durationMs: 7000,
  },
  {
    id: "p-verified",
    chapter: "Identity Verification",
    caption: "Verified ✓",
    sub: "Now a trusted publisher — cleared to publish and to get paid.",
    focus: "instructor",
    navInstructor: "/instructor",
    durationMs: 4200,
  },
  {
    id: "p-bank",
    chapter: "Becoming a Publisher",
    caption: "He connects his payout account.",
    sub: "Earnings → Add bank, so escrow can release to him.",
    focus: "instructor",
    navInstructor: "/wallet",
    selfNav: true,
    demo: "connect-bank",
    director: connectBank,
    durationMs: 9000,
  },
  {
    id: "p-create",
    chapter: "Becoming a Publisher",
    caption: "Time to list a service.",
    sub: "Profile → Create a Listing.",
    focus: "instructor",
    navInstructor: "/create-service",
    selfNav: true,
    demo: "go-create",
    durationMs: 5500,
  },
  {
    id: "p-publish",
    chapter: "Becoming a Publisher",
    caption: "He fills in the details.",
    sub: "Sunset Inshore Fishing Trip — title, price, and schedule.",
    focus: "instructor",
    navInstructor: "/create-service",
    demo: "publish",
    durationMs: 9500,
  },
  {
    id: "p-review",
    chapter: "Becoming a Publisher",
    caption: "A quick quality review.",
    sub: "Verified for safety, then approved.",
    focus: "instructor",
    navInstructor: "/admin/review/move-out-cleaning",
    director: approveListing,
    durationMs: 4500,
  },
  {
    id: "p-published",
    chapter: "Becoming a Publisher",
    caption: "And it's live on the marketplace.",
    sub: "Ready for learners to discover and book.",
    focus: "instructor",
    navInstructor: "/service-published",
    durationMs: 4000,
  },
];

// ── Act 2 — Alex books ─────────────────────────────────────────────
const learnerScenes: Scene[] = [
  {
    id: "l-login",
    chapter: "The Learner",
    caption: "Meet Alex.",
    sub: "He signs in to find a class this weekend.",
    focus: "learner",
    navLearner: "/",
    selfNav: true,
    demo: "learner-login",
    durationMs: 7500,
  },
  {
    id: "l-find",
    chapter: "The Learner",
    caption: "He finds Marco's class.",
    sub: "Deep-Sea Fishing for Beginners · 4.9 ★ · Verified mentor.",
    focus: "learner",
    navLearner: "/home",
    demo: "learner-find",
    durationMs: 5500,
  },
  {
    id: "l-book",
    chapter: "The Learner",
    caption: "He books in a tap.",
    sub: "Picks a time and taps Book Now.",
    focus: "learner",
    navLearner: "/service/deep-cleaning",
    demo: "book",
    durationMs: 4800,
  },
  {
    id: "l-pay",
    chapter: "The Learner",
    caption: "Paid safely into escrow.",
    sub: "Funds are held securely until the session is complete.",
    focus: "learner",
    navLearner: `/booking/${HERO}/review`,
    demo: "pay",
    durationMs: 5000,
  },
];

// ── Act 3 — The transaction ────────────────────────────────────────
const transactionScenes: Scene[] = [
  {
    id: "p-request",
    chapter: "The Transaction",
    caption: "Marco gets the request — live.",
    sub: "Alex's paid booking appears the instant it's made.",
    focus: "instructor",
    navInstructor: "/instructor",
    durationMs: 4500,
  },
  {
    id: "p-open",
    chapter: "The Transaction",
    caption: "He opens the request.",
    sub: "Bookings → the newest request.",
    focus: "instructor",
    navInstructor: "/instructor/bookings",
    selfNav: true,
    demo: "go-bookings",
    durationMs: 6000,
  },
  {
    id: "p-accept",
    chapter: "The Transaction",
    caption: "He accepts the booking.",
    sub: "He could decline — instead he confirms the trip.",
    focus: "instructor",
    navInstructor: `/instructor/bookings/${HERO}`,
    demo: "accept",
    director: accept,
    durationMs: 5000,
  },
  {
    id: "p-start",
    chapter: "The Transaction",
    caption: "Session day — he starts the trip.",
    sub: "The booking moves to in-progress for both sides.",
    focus: "instructor",
    navInstructor: `/instructor/bookings/${HERO}`,
    demo: "start",
    director: startSession,
    durationMs: 4600,
  },
  {
    id: "p-complete",
    chapter: "The Transaction",
    caption: "Session complete.",
    sub: "Escrow releases automatically — no chasing payments.",
    focus: "instructor",
    navInstructor: `/instructor/bookings/${HERO}`,
    demo: "complete",
    director: complete,
    durationMs: 4600,
  },
  {
    id: "p-wallet",
    chapter: "The Transaction",
    caption: "The money lands in his wallet.",
    sub: "Cleared from escrow, ready to withdraw to the bank he connected.",
    focus: "instructor",
    navInstructor: "/wallet",
    durationMs: 5500,
  },
];

const finale: Scene = {
  id: "finale",
  chapter: "ServiceConnect",
  caption: "Two sides. One trusted marketplace.",
  sub: "Learn from real people. Earn from real skills.",
  focus: "both",
  durationMs: 5200,
};

export const sequences = {
  full: {
    label: "Full Story",
    scenes: [
      ...onboardingScenes,
      ...learnerScenes,
      ...transactionScenes,
      finale,
    ],
  },
  publisher: {
    label: "Publisher Flow",
    scenes: [...onboardingScenes, ...transactionScenes, finale],
  },
  learner: {
    label: "Learner Flow",
    scenes: [...learnerScenes, finale],
  },
} as const;

export type SequenceKey = keyof typeof sequences;
