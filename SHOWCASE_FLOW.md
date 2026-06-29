# ServiceConnect — Demo & Showcase Flow

A presenter's script for demoing the ServiceConnect prototype. Everything is
**frontend-only** — a client-side store persisted to `localStorage` and synced
across tabs/iframes. No backend, no network calls. Mock data lives in
`src/lib/mock-data`; state logic in `src/lib/store`.

> **Reset between demos:** open `/showcase` once (it reseeds state on load), or
> clear the `serviceconnect:state:v2` key in your browser's localStorage and
> refresh. Both put the demo back to its pristine, scripted starting point.

There are **three ways to present**, smallest effort to most hands-on:

| Mode | Route | Best for |
|------|-------|----------|
| 🎬 Demo Reel | `/showcase` | Hands-off, narrated auto-play (great for video) |
| 📱 Two-Sided | `/demo` | Showing learner + instructor side-by-side, live |
| 👆 Live Click-through | `/` | A real, manual walk of the full product |

---

## 🎬 Mode 1 — The Demo Reel (`/showcase`)

The fastest way to show the whole story. Two phones animate side-by-side while
captions narrate each beat.

1. From the welcome screen tap **"Watch demo reel"** (or go to `/showcase`).
2. It **auto-plays**. Use the controls:
   - **Play / Pause** — pause to talk over a scene.
   - **◀ / ▶ arrows** (or **←/→** keys) — step scene by scene.
   - **Space** — play/pause.
   - **Sequence switcher** — jump to the *Learner*, *Instructor*, or *Full* story.
   - **Restart** — reseed and replay from the top.
3. While playing, the chrome auto-hides for clean screen-recording. Move the
   mouse to bring it back.

**Talking points as it runs:** "Two real people, two phones, one shared booking
— and the money sits safely in escrow until the session is confirmed done."

---

## 📱 Mode 2 — Two-Sided Live Demo (`/demo`)

Two fully-clickable phones: **Instructor** (left) and **Learner** (right). Actions
on one side propagate to the other in real time (shared store). Use **Restart
demo** (top-right) to reset both.

Recommended live sequence:

1. **Learner (right): discover & book.**
   - Home → drag the **Featured Services** carousel, tap **"Professional Deep
     Home Cleaning"**.
   - Pick a **date** (drag the date row) and a **time**, set quantity.
   - **Book Now** → review screen → **Confirm & Pay** → "Payment secured".
2. **Instructor (left): the request appears.**
   - Go to **Bookings** — the new request is now sitting as **Pending** (escrow held).
   - Open it → **Accept**. (Point out the money is in *pending* balance, not released.)
   - **Start session**, then **Mark complete**.
3. **Funds release.**
   - On completion the escrow releases to the instructor's **Wallet**
     (pending → available, with a transaction line).
   - Learner sees the booking move to **Completed / Funds released** under Orders.

**Talking points:** "Nothing is faked between the two screens — they share one
state. Watch the booking I just created on the right show up on the left."

---

## 👆 Mode 3 — Full Live Click-through (`/`)

The complete manual tour. Two character journeys — run either or both.

### A. The Learner journey (Alex)

1. **Welcome** (`/`) → **Get Started**.
2. **Auth** (`/auth`) → **Log in** (or Sign up → onboarding → verify).
3. **Home** (`/home`):
   - **Search** filters services live as you type.
   - **Categories** carousel — tap a chip to filter (tap again to clear).
   - **Featured Services** & **Top-Rated Providers** — drag to scroll; tap a
     provider to open their **profile** (`/provider/[id]`).
   - **Notification bell** (top-right) opens the notifications panel.
   - **Location chip** opens the city picker.
4. **Service detail** (`/service/[id]`):
   - **Share** (copies link), **Save** (heart → wishlist), **Chat** (opens a
     conversation with the provider).
   - Pick date/time/quantity → **Book Now**.
5. **Review booking** (`/booking/[id]/review`):
   - **Change** payment method (dialog) → **Confirm & Pay**.
6. **Payment secured** → **View Booking** → **Orders**.
7. **Orders** (`/orders`) → open the booking → **Confirm Completion** →
   countdown → **Confirm** → **Completed**:
   - Leave a **star rating + review** (this persists to the service) → **Submit**.
   - **View Session Notes** opens the notes dialog.
8. **Messages** (`/messages`) → open a thread → send a message; try the
   **call** / **video** buttons (faux-call modal).
9. **Wallet** (`/wallet`) → balances, **View All** transactions (expands),
   withdraw / add bank dialogs.
10. **Profile** (`/profile`) → Edit Profile, notifications toggle,
    **Help & Support** (`/help`), Log Out.

### B. The Instructor journey (Marco)

1. From **Profile**, tap **Create a Listing** (or go to `/create-service`).
2. **Create Service** — fill title, category, price, etc. → **Submit for Review**.
3. **Admin review** (`/admin/review/[id]`) — **View Profile** of the provider,
   then **Accept & Publish** → **Service Published** (try **Share Listing**).
4. **Instructor dashboard** (`/instructor`) — pending requests, stats from wallet.
5. **My Listings** (`/instructor/listings`) — **Edit** a listing (reopens the
   form prefilled → **Save Changes**), or **View public page**.
6. **Bookings** (`/instructor/bookings`) — filter pills; open a request →
   **Accept / Decline / Start / Mark complete**.
7. Watch the **Wallet** update as a session completes and escrow releases.

---

## Quick reference — every interactive surface works

- **Carousels** (categories, featured, providers, gallery, date pickers): drag
  / swipe to scroll, items snap, nothing is cut off, and tapping an item
  navigates.
- **Dialogs/panels:** payment method, session notes, call modal, notifications,
  location picker, wallet withdrawal.
- **Store-backed flows:** booking lifecycle, listing create/edit/publish,
  reviews, saved/wishlist, messaging, wallet, disputes — all persist and sync.

## Suggested 90-second pitch path

`/showcase` (let the Full reel play ~30s) → switch to `/demo`, create a booking
on the Learner phone and accept + complete it on the Instructor phone → land on
the Instructor **Wallet** showing the released funds. That single loop tells the
whole escrow-marketplace story.
