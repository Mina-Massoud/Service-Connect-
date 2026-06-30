"use client";

import type { Conversation, Service } from "@/lib/types";
import type { AppActions } from "./AppStateProvider";
import { useApp } from "./AppStateProvider";
import type { BookingRecord, SessionState, WalletState } from "./types";

export function useActions(): AppActions {
  return useApp().actions;
}

export function useSession(): SessionState {
  return useApp().state.session;
}

/** All listings regardless of moderation state. */
export function useAllListings(): Service[] {
  return useApp().state.listings;
}

/** Only published listings — what the learner sees in discovery. */
export function usePublishedListings(): Service[] {
  return useApp().state.listings.filter(
    (l) => (l.status ?? "published") === "published",
  );
}

/** Listings owned by the instructor (Marco) — for the instructor surface. */
export function useInstructorListings(): Service[] {
  const { state } = useApp();
  return state.listings.filter(
    (l) => l.providerId === state.session.instructor.id,
  );
}

export function useService(id: string | undefined): Service | undefined {
  return useApp().state.listings.find((l) => l.id === id);
}

/** Bookings the current learner ("me") placed. */
export function useLearnerBookings(): BookingRecord[] {
  const { state } = useApp();
  return state.bookings
    .filter((b) => b.studentId === state.session.learner.id)
    .sort((a, b) => a.createdAt - b.createdAt);
}

/** Bookings for the instructor's services — "who booked my services" (newest first). */
export function useInstructorBookings(): BookingRecord[] {
  const { state } = useApp();
  return state.bookings
    .filter((b) => b.providerId === state.session.instructor.id)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function useBooking(id: string | undefined): BookingRecord | undefined {
  return useApp().state.bookings.find((b) => b.id === id);
}

export function useWallet(): WalletState {
  return useApp().state.wallet;
}

export function useConversations(): Conversation[] {
  return useApp().state.conversations;
}

export function useConversation(id: string | undefined): Conversation | undefined {
  return useApp().state.conversations.find((c) => c.id === id);
}

export function useNotifications() {
  return useApp().state.notifications;
}

export function useDisputes() {
  return useApp().state.disputes;
}

/** Service ids on the learner's wishlist. */
export function useSaved(): string[] {
  return useApp().state.saved;
}

/** Whether a specific service is saved. */
export function useIsSaved(serviceId: string | undefined): boolean {
  return useApp().state.saved.includes(serviceId ?? "");
}

/** All submitted reviews, optionally filtered to one service. */
export function useReviews(serviceId?: string) {
  const all = useApp().state.reviews;
  return serviceId ? all.filter((r) => r.serviceId === serviceId) : all;
}
