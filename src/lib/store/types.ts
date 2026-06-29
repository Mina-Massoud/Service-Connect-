import type {
  Service,
  Conversation,
  ChatMessage,
  BankAccount,
  Transaction,
} from "@/lib/types";

/** A learner-submitted review, captured after a session completes. */
export interface ReviewRecord {
  id: string;
  bookingId: string;
  serviceId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  body: string;
  createdAt: number;
}

/** Unified booking lifecycle — read from both learner and instructor sides. */
export type BookingLifecycle =
  | "pending_payment" // created by learner, not yet paid
  | "escrow_held" // paid; awaiting instructor acceptance (instructor's "pending request")
  | "accepted" // instructor accepted; upcoming
  | "in_progress" // session underway
  | "completed" // session finished; awaiting fund release confirmation
  | "funds_released" // escrow released to instructor
  | "declined" // instructor declined
  | "disputed"; // learner opened a dispute

/** One booking record, shared by the learner who booked and the instructor who fulfills. */
export interface BookingRecord {
  id: string;
  serviceId: string;
  // learner (student) identity
  studentId: string; // "me" for the demo learner
  studentName: string;
  studentAvatar: string;
  // instructor identity (derived from the service's provider)
  providerId: string;
  // schedule
  date: string;
  time: string;
  quantity: number;
  // money
  unitPrice: number;
  subtotal: number;
  platformFee: number;
  total: number; // what the student pays
  payout: number; // what the instructor receives (total - platformFee)
  // lifecycle
  status: BookingLifecycle;
  note?: string;
  createdAt: number; // epoch ms
}

export interface DisputeRecord {
  id: string;
  bookingId: string;
  reason: string;
  details: string;
  createdAt: number;
  status: "open" | "resolved";
}

export interface AppNotification {
  id: string;
  text: string;
  href?: string;
  read: boolean;
  createdAt: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  languages?: string[];
}

export type AppRole = "learner" | "instructor";

export interface WalletState {
  available: number;
  pending: number;
  lifetime: number;
  transactions: Transaction[];
  banks: BankAccount[];
}

export interface SessionState {
  authed: boolean;
  role: AppRole;
  /** The learner identity (the "me" who books). */
  learner: SessionUser;
  /** The instructor identity (Marco — the single demo provider). */
  instructor: SessionUser;
  verified: boolean;
}

export interface AppState {
  session: SessionState;
  listings: Service[]; // published + user-created (each carries `status`)
  bookings: BookingRecord[];
  conversations: Conversation[];
  wallet: WalletState;
  disputes: DisputeRecord[];
  notifications: AppNotification[];
  prefs: Record<string, boolean>;
  /** Service ids the learner saved to their wishlist. */
  saved: string[];
  /** Reviews the learner submitted after completed sessions. */
  reviews: ReviewRecord[];
}

export type AppAction =
  | { type: "HYDRATE"; state: AppState }
  | { type: "RESET" }
  | { type: "LOGIN"; user?: Partial<SessionUser> }
  | { type: "SIGNUP"; user?: Partial<SessionUser> }
  | { type: "LOGOUT" }
  | { type: "SET_ROLE"; role: AppRole }
  | { type: "SET_VERIFIED"; verified: boolean }
  | { type: "UPDATE_PROFILE"; patch: Partial<SessionUser> }
  | { type: "CREATE_BOOKING"; booking: BookingRecord }
  | { type: "PAY_ESCROW"; bookingId: string }
  | { type: "ACCEPT_BOOKING"; bookingId: string }
  | { type: "DECLINE_BOOKING"; bookingId: string }
  | { type: "START_SESSION"; bookingId: string }
  | { type: "COMPLETE_BOOKING"; bookingId: string }
  | { type: "OPEN_DISPUTE"; dispute: DisputeRecord }
  | { type: "CREATE_LISTING"; listing: Service }
  | { type: "UPDATE_LISTING"; listingId: string; patch: Partial<Service> }
  | { type: "SUBMIT_LISTING"; listingId: string }
  | { type: "APPROVE_LISTING"; listingId: string }
  | { type: "TOGGLE_SAVED"; serviceId: string }
  | { type: "SAVE_REVIEW"; review: ReviewRecord }
  | { type: "ENSURE_CONVERSATION"; conversation: Conversation }
  | { type: "SEND_MESSAGE"; conversationId: string; message: ChatMessage }
  | { type: "REQUEST_WITHDRAWAL"; amount: number; bankId: string }
  | { type: "ADD_BANK"; bank: BankAccount }
  | { type: "SET_PREF"; key: string; value: boolean }
  | { type: "MARK_NOTIFICATIONS_READ" };
