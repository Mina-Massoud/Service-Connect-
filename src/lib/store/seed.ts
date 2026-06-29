import type { Service } from "@/lib/types";
import { services, getService } from "@/lib/mock-data/services";
import { currentUser } from "@/lib/mock-data/providers";
import { conversations } from "@/lib/mock-data/conversations";
import {
  walletBalance,
  bankAccounts,
  transactions,
} from "@/lib/mock-data/wallet";
import type {
  AppState,
  BookingLifecycle,
  BookingRecord,
  SessionUser,
} from "./types";

const PLATFORM_RATE = 0.15;

export const learnerUser: SessionUser = {
  id: "me",
  name: "Alex Morgan",
  email: "alex@demo.app",
  avatar: "https://i.pravatar.cc/160?img=8",
  bio: "Lifelong learner exploring new skills on the weekends.",
  location: "Austin, TX",
  languages: ["English"],
};

export const instructorUser: SessionUser = {
  id: currentUser.id,
  name: currentUser.name,
  email: "marco@demo.app",
  avatar: currentUser.avatar,
  bio: currentUser.bio,
  location: currentUser.location,
  languages: currentUser.languages,
};

interface SeedBookingInput {
  id: string;
  serviceId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  date: string;
  time: string;
  quantity: number;
  status: BookingLifecycle;
  note?: string;
  ageMinutes: number; // how long ago it was created (for ordering)
}

function makeBooking(input: SeedBookingInput): BookingRecord {
  const service = getService(input.serviceId);
  const unitPrice = service?.price ?? 0;
  const providerId = service?.providerId ?? "marco";
  const subtotal = unitPrice * input.quantity;
  const platformFee = Math.round(subtotal * PLATFORM_RATE * 100) / 100;
  const total = subtotal + platformFee;
  const payout = subtotal - platformFee;
  return {
    id: input.id,
    serviceId: input.serviceId,
    studentId: input.studentId,
    studentName: input.studentName,
    studentAvatar: input.studentAvatar,
    providerId,
    date: input.date,
    time: input.time,
    quantity: input.quantity,
    unitPrice,
    subtotal,
    platformFee,
    total,
    payout,
    status: input.status,
    note: input.note,
    createdAt: -input.ageMinutes, // negative offset; resolved to real time on hydrate
  };
}

const seedBookingInputs: SeedBookingInput[] = [
  // The demo learner ("me") — what Alex booked
  {
    id: "bk-1024",
    serviceId: "deep-cleaning",
    studentId: "me",
    studentName: learnerUser.name,
    studentAvatar: learnerUser.avatar,
    date: "Mon, Jul 6, 2026",
    time: "10:00 AM",
    quantity: 1,
    status: "escrow_held",
    ageMinutes: 120,
  },
  {
    id: "bk-1025",
    serviceId: "saltwater-fishing",
    studentId: "me",
    studentName: learnerUser.name,
    studentAvatar: learnerUser.avatar,
    date: "Sat, Jul 11, 2026",
    time: "6:30 AM",
    quantity: 2,
    status: "in_progress",
    ageMinutes: 2880,
  },
  {
    id: "bk-1026",
    serviceId: "sushi-making",
    studentId: "me",
    studentName: learnerUser.name,
    studentAvatar: learnerUser.avatar,
    date: "Thu, Jun 25, 2026",
    time: "5:00 PM",
    quantity: 2,
    status: "completed",
    ageMinutes: 5760,
  },
  {
    id: "bk-1027",
    serviceId: "portrait-photography",
    studentId: "me",
    studentName: learnerUser.name,
    studentAvatar: learnerUser.avatar,
    date: "Tue, Jun 17, 2026",
    time: "9:00 AM",
    quantity: 1,
    status: "funds_released",
    ageMinutes: 14400,
  },
  // Other students who booked the instructor's (Marco's) deep-cleaning service
  {
    id: "rb-2001",
    serviceId: "deep-cleaning",
    studentId: "jessica",
    studentName: "Jessica Miller",
    studentAvatar: "https://i.pravatar.cc/120?img=5",
    date: "Mon, Jul 6, 2026",
    time: "1:00 PM",
    quantity: 1,
    status: "escrow_held",
    note: "Hi! It's a 2-bedroom apartment. Looking forward to learning your system.",
    ageMinutes: 130,
  },
  {
    id: "rb-2002",
    serviceId: "deep-cleaning",
    studentId: "david",
    studentName: "David Reyes",
    studentAvatar: "https://i.pravatar.cc/120?img=14",
    date: "Wed, Jul 8, 2026",
    time: "2:00 PM",
    quantity: 1,
    status: "escrow_held",
    ageMinutes: 300,
  },
  {
    id: "rb-2003",
    serviceId: "deep-cleaning",
    studentId: "priya",
    studentName: "Priya Sharma",
    studentAvatar: "https://i.pravatar.cc/120?img=32",
    date: "Fri, Jul 3, 2026",
    time: "9:00 AM",
    quantity: 2,
    status: "accepted",
    ageMinutes: 1440,
  },
  {
    id: "rb-2004",
    serviceId: "deep-cleaning",
    studentId: "tom",
    studentName: "Tom Becker",
    studentAvatar: "https://i.pravatar.cc/120?img=51",
    date: "Today",
    time: "11:30 AM",
    quantity: 1,
    status: "in_progress",
    ageMinutes: 4320,
  },
  {
    id: "rb-2005",
    serviceId: "deep-cleaning",
    studentId: "sofia",
    studentName: "Sofia Lindqvist",
    studentAvatar: "https://i.pravatar.cc/120?img=20",
    date: "Mon, Jun 22, 2026",
    time: "4:00 PM",
    quantity: 1,
    status: "funds_released",
    ageMinutes: 10080,
  },
];

// A second Marco-owned listing in review, so the instructor's listings view has variety.
const pendingListing: Service = {
  id: "move-out-cleaning",
  title: "Move-Out Deep Cleaning Masterclass",
  categoryId: "life-skills",
  providerId: "marco",
  coverImage:
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=70",
  description:
    "A focused session on getting any rental spotless for move-out, including landlord checklists and deposit-saving tips.",
  pricingModel: "fixed",
  price: 120,
  durationMinutes: 150,
  skillLevel: "Beginner",
  teachingMethod: "One-to-one",
  locationType: "Offline",
  rating: 0,
  reviewCount: 0,
  studentCount: 0,
  featured: false,
  requirements: ["Access to the space being cleaned"],
  learningOutcomes: [
    "Follow a landlord-grade checklist",
    "Tackle deposit-critical areas",
    "Finish in under three hours",
  ],
  gallery: [],
  status: "pending_review",
};

export function createSeedState(): AppState {
  const seededListings: Service[] = [
    ...services.map((s) => ({ ...s, status: "published" as const })),
    pendingListing,
  ];

  return {
    session: {
      authed: false,
      role: "learner",
      learner: learnerUser,
      instructor: instructorUser,
      verified: false,
    },
    listings: seededListings,
    bookings: seedBookingInputs.map(makeBooking),
    conversations: conversations.map((c) => ({
      ...c,
      messages: [...c.messages],
    })),
    wallet: {
      available: walletBalance.available,
      pending: walletBalance.pending,
      lifetime: walletBalance.lifetimeEarnings,
      transactions: [...transactions],
      banks: [...bankAccounts],
    },
    disputes: [],
    notifications: [],
    prefs: {
      instantBook: false,
      emailNotifications: true,
      pushNotifications: true,
    },
    saved: [],
    reviews: [],
  };
}
