// Scripts the in-iframe DemoDriver plays. Steps target elements by their
// `data-demo="<sel>"` attribute.
//   type  — drives a native input (visual + real React state)
//   click — REAL click; used for navigation (Links / bottom-nav tabs / cards)
//           which only route and never mutate the shared store. This is what
//           makes the reel "walk" the app to each screen.
//   press — visual cursor-press only; used for mutating CTAs (the reel parent
//           owns that state via directors + the screen nav), so the shared
//           two-persona session never gets corrupted.

export type DemoStep =
  | { a: "move"; sel: string }
  | { a: "type"; sel: string; text: string; cps?: number }
  | { a: "click"; sel: string }
  | { a: "press"; sel: string }
  | { a: "wait"; ms: number };

export const DEMO_SCRIPTS: Record<string, DemoStep[]> = {
  // ── Publisher onboarding ──────────────────────────────────────────
  signup: [
    { a: "type", sel: "auth-reg-name", text: "Marco Diaz" },
    { a: "type", sel: "auth-reg-email", text: "marco@serviceconnect.app" },
    { a: "type", sel: "auth-reg-password", text: "fishing123" },
    { a: "click", sel: "auth-reg-terms" },
    { a: "press", sel: "auth-register-btn" },
  ],
  "onboard-profile": [
    { a: "click", sel: "profile-role-teach" },
    {
      a: "type",
      sel: "profile-bio",
      text: "Licensed charter captain. 10+ years guiding beginners to their first catch.",
      cps: 42,
    },
    { a: "type", sel: "profile-location", text: "San Diego, CA" },
    { a: "press", sel: "profile-continue-btn" },
  ],
  verify: [
    { a: "click", sel: "verify-upload-id" },
    { a: "wait", ms: 600 },
    { a: "click", sel: "verify-take-selfie" },
    { a: "wait", ms: 600 },
    { a: "press", sel: "verify-submit-btn" },
  ],

  // ── Publisher: walk to wallet via the Earnings tab, connect a bank ─
  "connect-bank": [
    { a: "click", sel: "nav-earnings" },
    { a: "wait", ms: 700 },
    { a: "click", sel: "wallet-add-bank-btn" },
    { a: "wait", ms: 500 },
    { a: "type", sel: "wallet-bank-name", text: "Chase Premier Checking" },
    { a: "type", sel: "wallet-bank-last4", text: "8421" },
    { a: "press", sel: "wallet-add-account-confirm" },
  ],

  // ── Publisher: walk Profile → Create a Listing, fill it ───────────
  "go-create": [
    { a: "click", sel: "nav-profile" },
    { a: "wait", ms: 700 },
    { a: "click", sel: "profile-create-listing" },
  ],
  publish: [
    { a: "type", sel: "create-title", text: "Sunset Inshore Fishing Trip" },
    {
      a: "type",
      sel: "create-description",
      text: "An evening on calm inshore waters — light-tackle casting, bait rigging, and reading the tide. All gear included.",
      cps: 55,
    },
    { a: "type", sel: "create-amount", text: "120" },
    { a: "press", sel: "create-submit-btn" },
  ],
  "publish-approve": [{ a: "press", sel: "admin-publish-btn" }],

  // ── Learner: log in, find the class, book, pay ────────────────────
  "learner-login": [
    { a: "click", sel: "welcome-login" },
    { a: "wait", ms: 600 },
    { a: "click", sel: "auth-login-tab" },
    { a: "wait", ms: 400 },
    { a: "type", sel: "auth-login-email", text: "alex@demo.app" },
    { a: "press", sel: "auth-login-btn" },
  ],
  "learner-find": [{ a: "click", sel: "service-card" }],
  book: [{ a: "press", sel: "service-book-now-btn" }],
  pay: [{ a: "press", sel: "review-confirm-pay-btn" }],

  // ── Publisher: walk to Bookings, open the request, run the session ─
  "go-bookings": [
    { a: "click", sel: "nav-bookings" },
    { a: "wait", ms: 700 },
    { a: "click", sel: "booking-card" },
  ],
  accept: [{ a: "press", sel: "booking-accept-btn" }],
  start: [{ a: "press", sel: "booking-start-btn" }],
  complete: [{ a: "press", sel: "booking-complete-btn" }],
  "go-wallet": [{ a: "click", sel: "nav-earnings" }],
};
