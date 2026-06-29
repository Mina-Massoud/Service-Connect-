import type { Transaction } from "@/lib/types";
import type { AppAction, AppState, AppNotification, BookingRecord } from "./types";

let idCounter = 0;
/** Client-side unique id (these actions only run after hydration). */
export function uid(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function notify(text: string, href?: string): AppNotification {
  return { id: uid("ntf"), text, href, read: false, createdAt: Date.now() };
}

function patchBooking(
  state: AppState,
  bookingId: string,
  patch: Partial<BookingRecord>,
): BookingRecord[] {
  return state.bookings.map((b) =>
    b.id === bookingId ? { ...b, ...patch } : b,
  );
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "RESET":
      return state; // replaced by provider with a fresh seed

    case "LOGIN":
    case "SIGNUP":
      return {
        ...state,
        session: {
          ...state.session,
          authed: true,
          learner: { ...state.session.learner, ...action.user },
        },
      };

    case "LOGOUT":
      return { ...state, session: { ...state.session, authed: false } };

    case "SET_ROLE":
      return { ...state, session: { ...state.session, role: action.role } };

    case "SET_VERIFIED":
      return {
        ...state,
        session: { ...state.session, verified: action.verified },
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        session: {
          ...state.session,
          learner: { ...state.session.learner, ...action.patch },
        },
      };

    case "CREATE_BOOKING":
      return { ...state, bookings: [action.booking, ...state.bookings] };

    case "PAY_ESCROW": {
      const booking = state.bookings.find((b) => b.id === action.bookingId);
      if (!booking) return state;
      const goesToInstructor =
        booking.providerId === state.session.instructor.id;
      return {
        ...state,
        bookings: patchBooking(state, action.bookingId, {
          status: "escrow_held",
        }),
        wallet: goesToInstructor
          ? { ...state.wallet, pending: state.wallet.pending + booking.payout }
          : state.wallet,
        notifications: [
          notify(
            `New booking request for ${booking.studentName}'s session`,
            `/instructor/bookings/${booking.id}`,
          ),
          ...state.notifications,
        ],
      };
    }

    case "ACCEPT_BOOKING":
      return {
        ...state,
        bookings: patchBooking(state, action.bookingId, { status: "accepted" }),
        notifications: [
          notify("Your booking was accepted by the instructor", "/orders"),
          ...state.notifications,
        ],
      };

    case "DECLINE_BOOKING": {
      const booking = state.bookings.find((b) => b.id === action.bookingId);
      if (!booking) return state;
      const refundFromPending =
        booking.providerId === state.session.instructor.id &&
        (booking.status === "escrow_held" || booking.status === "accepted");
      return {
        ...state,
        bookings: patchBooking(state, action.bookingId, { status: "declined" }),
        wallet: refundFromPending
          ? {
              ...state.wallet,
              pending: Math.max(0, state.wallet.pending - booking.payout),
            }
          : state.wallet,
      };
    }

    case "START_SESSION":
      return {
        ...state,
        bookings: patchBooking(state, action.bookingId, {
          status: "in_progress",
        }),
      };

    case "COMPLETE_BOOKING": {
      const booking = state.bookings.find((b) => b.id === action.bookingId);
      if (!booking) return state;
      const goesToInstructor =
        booking.providerId === state.session.instructor.id;
      if (!goesToInstructor) {
        return {
          ...state,
          bookings: patchBooking(state, action.bookingId, {
            status: "funds_released",
          }),
        };
      }
      const tx: Transaction = {
        id: uid("tx"),
        title: `Session payout — booking ${booking.id}`,
        subtitle: "Escrow released",
        amount: booking.payout,
        date: formatToday(),
        type: "earning",
      };
      return {
        ...state,
        bookings: patchBooking(state, action.bookingId, {
          status: "funds_released",
        }),
        wallet: {
          ...state.wallet,
          pending: Math.max(0, state.wallet.pending - booking.payout),
          available: state.wallet.available + booking.payout,
          lifetime: state.wallet.lifetime + booking.payout,
          transactions: [tx, ...state.wallet.transactions],
        },
        notifications: [
          notify(`Funds released: $${booking.payout.toFixed(2)}`, "/wallet"),
          ...state.notifications,
        ],
      };
    }

    case "OPEN_DISPUTE":
      return {
        ...state,
        disputes: [action.dispute, ...state.disputes],
        bookings: patchBooking(state, action.dispute.bookingId, {
          status: "disputed",
        }),
      };

    case "CREATE_LISTING":
      return { ...state, listings: [action.listing, ...state.listings] };

    case "UPDATE_LISTING":
      return {
        ...state,
        listings: state.listings.map((l) =>
          l.id === action.listingId ? { ...l, ...action.patch } : l,
        ),
      };

    case "TOGGLE_SAVED":
      return {
        ...state,
        saved: state.saved.includes(action.serviceId)
          ? state.saved.filter((id) => id !== action.serviceId)
          : [action.serviceId, ...state.saved],
      };

    case "SAVE_REVIEW": {
      const { serviceId, rating } = action.review;
      return {
        ...state,
        reviews: [action.review, ...state.reviews],
        // Fold the new rating into the listing's running average.
        listings: state.listings.map((l) => {
          if (l.id !== serviceId) return l;
          const nextCount = l.reviewCount + 1;
          const nextRating =
            Math.round(((l.rating * l.reviewCount + rating) / nextCount) * 10) /
            10;
          return { ...l, rating: nextRating, reviewCount: nextCount };
        }),
      };
    }

    case "ENSURE_CONVERSATION":
      return state.conversations.some((c) => c.id === action.conversation.id)
        ? state
        : {
            ...state,
            conversations: [action.conversation, ...state.conversations],
          };

    case "SUBMIT_LISTING":
      return {
        ...state,
        listings: state.listings.map((l) =>
          l.id === action.listingId
            ? { ...l, status: "pending_review" as const }
            : l,
        ),
      };

    case "APPROVE_LISTING":
      return {
        ...state,
        listings: state.listings.map((l) =>
          l.id === action.listingId
            ? { ...l, status: "published" as const }
            : l,
        ),
      };

    case "SEND_MESSAGE":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, messages: [...c.messages, action.message] }
            : c,
        ),
      };

    case "REQUEST_WITHDRAWAL": {
      if (action.amount <= 0 || action.amount > state.wallet.available)
        return state;
      const bank = state.wallet.banks.find((b) => b.id === action.bankId);
      const tx: Transaction = {
        id: uid("tx"),
        title: `Withdrawal to ${bank?.bankName ?? "bank"} ••${bank?.last4 ?? ""}`,
        subtitle: "Bank transfer",
        amount: -action.amount,
        date: formatToday(),
        type: "withdrawal",
      };
      return {
        ...state,
        wallet: {
          ...state.wallet,
          available: state.wallet.available - action.amount,
          transactions: [tx, ...state.wallet.transactions],
        },
      };
    }

    case "ADD_BANK":
      return {
        ...state,
        wallet: { ...state.wallet, banks: [...state.wallet.banks, action.bank] },
      };

    case "SET_PREF":
      return {
        ...state,
        prefs: { ...state.prefs, [action.key]: action.value },
      };

    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    default:
      return state;
  }
}
