"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type {
  BankAccount,
  ChatMessage,
  Conversation,
  Service,
} from "@/lib/types";
import type {
  AppRole,
  AppState,
  BookingRecord,
  ReviewRecord,
  SessionUser,
} from "./types";
import { reducer, uid } from "./reducer";
import { createSeedState } from "./seed";
import {
  createSyncBridge,
  loadPersisted,
  savePersisted,
} from "./persistence";

const PLATFORM_RATE = 0.15;

function nowTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface AppActions {
  login: (user?: Partial<SessionUser>) => void;
  signup: (user?: Partial<SessionUser>) => void;
  logout: () => void;
  setRole: (role: AppRole) => void;
  setVerified: (verified: boolean) => void;
  updateProfile: (patch: Partial<SessionUser>) => void;
  createBooking: (input: {
    serviceId: string;
    date: string;
    time: string;
    quantity: number;
  }) => string;
  payEscrow: (bookingId: string) => void;
  acceptBooking: (bookingId: string) => void;
  declineBooking: (bookingId: string) => void;
  startSession: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  openDispute: (input: {
    bookingId: string;
    reason: string;
    details: string;
  }) => string;
  createListing: (input: Partial<Service> & { title: string }) => string;
  updateListing: (listingId: string, patch: Partial<Service>) => void;
  submitListing: (listingId: string) => void;
  approveListing: (listingId: string) => void;
  toggleSaved: (serviceId: string) => void;
  saveReview: (input: {
    bookingId: string;
    serviceId: string;
    rating: number;
    body: string;
  }) => void;
  /** Find (or create) the conversation for a provider; returns its id. */
  openConversationForProvider: (input: {
    providerId: string;
    serviceTitle: string;
  }) => string;
  sendMessage: (
    conversationId: string,
    input: { text?: string; type?: ChatMessage["type"]; meta?: string },
  ) => void;
  requestWithdrawal: (amount: number, bankId: string) => void;
  addBank: (input: { bankName: string; last4: string }) => void;
  setPref: (key: string, value: boolean) => void;
  markNotificationsRead: () => void;
}

interface AppContextValue {
  state: AppState;
  actions: AppActions;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeedState);

  // Latest state, readable inside action creators (which run post-commit, so an
  // effect-synced ref is always current by the time a user triggers an action).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const firstPersist = useRef(true);
  const applyingRemote = useRef(false);
  const bridgeRef = useRef<ReturnType<typeof createSyncBridge> | null>(null);

  // Hydrate from localStorage + wire cross-context sync (runs once on mount).
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) dispatch({ type: "HYDRATE", state: persisted });

    bridgeRef.current = createSyncBridge((remote) => {
      applyingRemote.current = true;
      dispatch({ type: "HYDRATE", state: remote });
    });

    return () => bridgeRef.current?.dispose();
  }, []);

  // Persist + broadcast on change, skipping the initial seed render and any
  // change that originated from a remote sync (prevents echo loops).
  useEffect(() => {
    if (firstPersist.current) {
      firstPersist.current = false;
      return;
    }
    if (applyingRemote.current) {
      applyingRemote.current = false;
      return;
    }
    savePersisted(state);
    bridgeRef.current?.broadcast(state);
  }, [state]);

  const actions = useMemo<AppActions>(() => {
    return {
      login: (user) => dispatch({ type: "LOGIN", user }),
      signup: (user) => dispatch({ type: "SIGNUP", user }),
      logout: () => dispatch({ type: "LOGOUT" }),
      setRole: (role) => dispatch({ type: "SET_ROLE", role }),
      setVerified: (verified) => dispatch({ type: "SET_VERIFIED", verified }),
      updateProfile: (patch) => dispatch({ type: "UPDATE_PROFILE", patch }),

      createBooking: ({ serviceId, date, time, quantity }) => {
        const s = stateRef.current;
        const svc = s.listings.find((l) => l.id === serviceId);
        const unitPrice = svc?.price ?? 0;
        const providerId = svc?.providerId ?? "marco";
        const subtotal = unitPrice * quantity;
        const platformFee = Math.round(subtotal * PLATFORM_RATE * 100) / 100;
        const booking: BookingRecord = {
          id: uid("bk"),
          serviceId,
          studentId: s.session.learner.id,
          studentName: s.session.learner.name,
          studentAvatar: s.session.learner.avatar,
          providerId,
          date,
          time,
          quantity,
          unitPrice,
          subtotal,
          platformFee,
          total: subtotal + platformFee,
          payout: subtotal - platformFee,
          status: "pending_payment",
          createdAt: Date.now(),
        };
        dispatch({ type: "CREATE_BOOKING", booking });
        return booking.id;
      },

      payEscrow: (bookingId) => dispatch({ type: "PAY_ESCROW", bookingId }),
      acceptBooking: (bookingId) =>
        dispatch({ type: "ACCEPT_BOOKING", bookingId }),
      declineBooking: (bookingId) =>
        dispatch({ type: "DECLINE_BOOKING", bookingId }),
      startSession: (bookingId) =>
        dispatch({ type: "START_SESSION", bookingId }),
      completeBooking: (bookingId) =>
        dispatch({ type: "COMPLETE_BOOKING", bookingId }),

      openDispute: ({ bookingId, reason, details }) => {
        const id = uid("dsp");
        dispatch({
          type: "OPEN_DISPUTE",
          dispute: {
            id,
            bookingId,
            reason,
            details,
            createdAt: Date.now(),
            status: "open",
          },
        });
        return id;
      },

      createListing: (input) => {
        const id = input.id ?? uid("svc");
        const s = stateRef.current;
        const listing: Service = {
          id,
          title: input.title,
          categoryId: input.categoryId ?? "life-skills",
          providerId: s.session.instructor.id,
          coverImage:
            input.coverImage ??
            "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=70",
          description: input.description ?? "",
          pricingModel: input.pricingModel ?? "fixed",
          price: input.price ?? 0,
          durationMinutes: input.durationMinutes ?? 60,
          skillLevel: input.skillLevel ?? "Beginner",
          teachingMethod: input.teachingMethod ?? "One-to-one",
          locationType: input.locationType ?? "Online",
          rating: 0,
          reviewCount: 0,
          studentCount: 0,
          featured: false,
          requirements: input.requirements ?? [],
          learningOutcomes: input.learningOutcomes ?? [],
          gallery: input.gallery ?? [],
          status: "pending_review",
        };
        dispatch({ type: "CREATE_LISTING", listing });
        return id;
      },
      updateListing: (listingId, patch) =>
        dispatch({ type: "UPDATE_LISTING", listingId, patch }),
      submitListing: (listingId) =>
        dispatch({ type: "SUBMIT_LISTING", listingId }),
      approveListing: (listingId) =>
        dispatch({ type: "APPROVE_LISTING", listingId }),

      toggleSaved: (serviceId) =>
        dispatch({ type: "TOGGLE_SAVED", serviceId }),

      saveReview: ({ bookingId, serviceId, rating, body }) => {
        const s = stateRef.current;
        const review: ReviewRecord = {
          id: uid("rev"),
          bookingId,
          serviceId,
          authorName: s.session.learner.name,
          authorAvatar: s.session.learner.avatar,
          rating,
          body,
          createdAt: Date.now(),
        };
        dispatch({ type: "SAVE_REVIEW", review });
      },

      openConversationForProvider: ({ providerId, serviceTitle }) => {
        const s = stateRef.current;
        const existing = s.conversations.find(
          (c) => c.providerId === providerId,
        );
        if (existing) return existing.id;
        const id = `conv-${providerId}`;
        const conversation: Conversation = {
          id,
          providerId,
          serviceTitle,
          messages: [],
        };
        dispatch({ type: "ENSURE_CONVERSATION", conversation });
        return id;
      },

      sendMessage: (conversationId, { text, type = "text", meta }) =>
        dispatch({
          type: "SEND_MESSAGE",
          conversationId,
          message: {
            id: uid("msg"),
            fromMe: true,
            text,
            type,
            meta,
            time: nowTime(),
          },
        }),

      requestWithdrawal: (amount, bankId) =>
        dispatch({ type: "REQUEST_WITHDRAWAL", amount, bankId }),
      addBank: ({ bankName, last4 }) => {
        const bank: BankAccount = {
          id: uid("ba"),
          bankName,
          last4,
          primary: false,
        };
        dispatch({ type: "ADD_BANK", bank });
      },

      setPref: (key, value) => dispatch({ type: "SET_PREF", key, value }),
      markNotificationsRead: () => dispatch({ type: "MARK_NOTIFICATIONS_READ" }),
    };
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ state, actions }),
    [state, actions],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within <AppStateProvider>");
  }
  return ctx;
}
