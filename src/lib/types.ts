// Domain types for the ServiceConnect demo. All data is mocked — no backend.

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string; // tailwind-ish accent for the chip (hex)
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  headline: string; // e.g. "Professional Home Cleaner"
  bio: string;
  location: string;
  languages: string[];
  rating: number; // 0-5
  reviewCount: number;
  studentCount: number;
  yearsExperience: number;
  verified: boolean;
  responseTime: string; // e.g. "~1 hour"
  completionRate: number; // 0-100
}

export type ListingState = "published" | "pending_review" | "draft";
export type PricingModel = "fixed" | "hourly" | "per_person" | "custom";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type LocationType = "Online" | "Offline" | "Hybrid";
export type TeachingMethod = "One-to-one" | "Small group" | "Workshop";

export interface Service {
  id: string;
  title: string;
  categoryId: string;
  providerId: string;
  coverImage: string;
  description: string;
  pricingModel: PricingModel;
  price: number; // base price in USD
  durationMinutes: number;
  skillLevel: SkillLevel;
  teachingMethod: TeachingMethod;
  locationType: LocationType;
  rating: number;
  reviewCount: number;
  studentCount: number;
  featured: boolean;
  requirements: string[];
  learningOutcomes: string[];
  gallery: string[];
  distanceKm?: number;
  /** Listing moderation state (defaults to published for seed services). */
  status?: ListingState;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  body: string;
}

export type BookingStatus =
  | "review"
  | "escrow_held"
  | "in_progress"
  | "completed"
  | "funds_released"
  | "disputed";

export interface Booking {
  id: string;
  serviceId: string;
  date: string; // human readable
  time: string;
  quantity: number;
  servicePrice: number;
  platformFee: number;
  total: number;
  status: BookingStatus;
}

export type ReceivedStatus =
  | "pending" // a new request awaiting the instructor's acceptance
  | "accepted" // confirmed, upcoming
  | "in_progress"
  | "completed";

/** A booking from the instructor's side — "who booked my service". */
export interface ReceivedBooking {
  id: string;
  serviceId: string;
  studentName: string;
  studentAvatar: string;
  date: string;
  time: string;
  quantity: number;
  amount: number; // what the student paid
  payout: number; // instructor's take after the 15% platform fee
  status: ReceivedStatus;
  requestedAgo: string; // e.g. "2h ago"
  note?: string; // optional message from the student
}

export interface ChatMessage {
  id: string;
  fromMe: boolean;
  text?: string;
  time: string;
  type: "text" | "image" | "document" | "voice";
  meta?: string; // doc name, voice length, etc.
}

export interface Conversation {
  id: string;
  providerId: string;
  serviceTitle: string;
  messages: ChatMessage[];
}

export type TransactionType = "earning" | "withdrawal" | "fee" | "refund";

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // positive earning, negative withdrawal
  date: string;
  type: TransactionType;
}

export interface BankAccount {
  id: string;
  bankName: string;
  last4: string;
  primary: boolean;
}

export interface PipelineStep {
  label: string;
  description: string;
  state: "done" | "active" | "upcoming";
}
