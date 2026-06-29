# ServiceConnect — App State Contract (for wiring agents)

The app now has a real client-side store (no backend). It is **persisted to
localStorage** and **synced across the two demo iframes** automatically — you
just read/write it; cross-device propagation is free.

Goal of this pass: **every control works**. No dead buttons, toggles, sliders,
steppers, filters, or forms. Replace local-only `useState`-from-mock-data with
the store. Keep visual design identical.

## Importing
```ts
import {
  useSession, useActions,
  usePublishedListings, useInstructorListings, useService,
  useLearnerBookings, useInstructorBookings, useBooking,
  useWallet, useConversations, useConversation, useNotifications,
} from "@/lib/store";
```
All store hooks are **client** hooks → the file needs `"use client"`.

## Actions — `const a = useActions()`
- `a.login(user?)`, `a.signup(user?)`, `a.logout()`
- `a.setRole("learner" | "instructor")`, `a.setVerified(true)`, `a.updateProfile({bio, location, languages})`
- `a.createBooking({ serviceId, date, time, quantity }) => bookingId`  ← creates a `pending_payment` booking
- `a.payEscrow(bookingId)`  ← marks it `escrow_held` (money into instructor's pending wallet)
- `a.acceptBooking(id)` / `a.declineBooking(id)` / `a.startSession(id)` / `a.completeBooking(id)`
- `a.openDispute({ bookingId, reason, details }) => disputeId`  ← also flips booking to `disputed`
- `a.createListing(partialService & {title}) => listingId`  ← created as `pending_review`
- `a.submitListing(id)`, `a.approveListing(id)`  ← `approveListing` publishes it
- `a.sendMessage(conversationId, { text })`
- `a.requestWithdrawal(amount, bankId)`, `a.addBank({ bankName, last4 })`
- `a.setPref(key, value)`, `a.markNotificationsRead()`

## Booking lifecycle (one shared `BookingRecord`)
`pending_payment → escrow_held → accepted → in_progress → completed → funds_released`
(plus `declined`, `disputed`).
- **Learner** flow: Book Now → `createBooking` (→`/booking/{id}/review`) → Confirm & Pay → `payEscrow` (→`/booking/{id}/payment-secured`).
- **Instructor** sees `escrow_held` bookings as **pending requests** → `acceptBooking`/`declineBooking`.
- Completion: `completeBooking(id)` releases escrow → instructor wallet (pending→available + a transaction) and sets `funds_released`.

`BookingRecord`: `{ id, serviceId, studentId, studentName, studentAvatar, providerId,
date, time, quantity, unitPrice, subtotal, platformFee, total, payout, status, note?, createdAt }`.

Suggested status → badge mapping: pending_payment=muted, escrow_held=amber("Pending"),
accepted=blue("Confirmed"), in_progress=indigo, completed=teal, funds_released=green("Paid out"),
declined=muted/red, disputed=red.

## Per-screen wiring (do the ones in YOUR folders)
- **/auth**: signup → `a.signup({name,email})` then `/onboarding/profile`; login → `a.login({email})` then `/home`.
- **/onboarding/profile**: role cards → `a.setRole(...)`; Continue → `a.updateProfile({bio,location,languages})` then `/onboarding/verify`.
- **/onboarding/verify**: Submit → `a.setVerified(true)` then `/home`.
- **/home**: search field filters `usePublishedListings()` by title/category/provider **live**; category chips filter; featured = published & `featured`; nearby = published & has `distanceKm`.
- **/service/[id]**: `useService(id)`; carry selected date/time/quantity into `const id = a.createBooking(...)` then `router.push(\`/booking/${id}/review\`)`.
- **/create-service**: build from the form → `const id = a.createListing({...})` then `router.push(\`/admin/review/${id}\`)`.
- **/booking/[id]/review**: `useBooking(id)`; Confirm & Pay → `a.payEscrow(id)` then `/booking/{id}/payment-secured`.
- **/booking/[id]/payment-secured**: `useBooking(id)`; View Booking → `/orders/{id}`.
- **/messages**, **/messages/[id]**: `useConversations()` / `useConversation(id)`; send → `a.sendMessage(id,{text})`.
- **/orders**: `useLearnerBookings()`. **/orders/[id]**: `useBooking(id)`, pipeline from status; Confirm Completion → `/orders/{id}/completion`.
- **/orders/[id]/completion**: countdown; Confirm → `a.completeBooking(id)` then `/orders/{id}/completed`.
- **/orders/[id]/completed**, **/funds-released**: read `useBooking(id)` + `useWallet()`.
- **/admin/review/[id]**: `useService(id)`; Accept & Publish → `a.approveListing(id)` then `/service-published`.
- **/instructor**: pending requests = `useInstructorBookings().filter(b=>b.status==="escrow_held")`; Accept/Decline → actions; stats from `useWallet()` + counts.
- **/instructor/bookings** + **[id]**: `useInstructorBookings()` / `useBooking(id)`; Accept/Decline/Mark-Complete → actions.
- **/instructor/listings**: `useInstructorListings()`.
- **/wallet**: `useWallet()`; withdrawal dialog → `a.requestWithdrawal(amount, bankId)`; add bank → `a.addBank(...)`.
- **/dispute/[id]**: Submit → `a.openDispute({bookingId:id, reason, details})` then dialog → `/orders`.
- **/profile**: `useSession().learner`; every row navigates; Log Out → `a.logout()` then `/`; preference switches → `a.setPref(...)`.

## Rules
- Add `"use client"` to any screen using store hooks. Keep design unchanged.
- Make EVERY interactive control do something real (navigate or mutate store). No `href="#"`.
- Guard for missing records (e.g. booking/service not found → friendly fallback, don't crash).
- Stay in your assigned folders. TS strict, no `any`, no `console.log`. Don't run build/tsc.
