import type { ReceivedBooking } from "@/lib/types";

// Bookings as seen by the instructor (Marco) — "who booked my services".
export const incomingBookings: ReceivedBooking[] = [
  {
    id: "rb-2001",
    serviceId: "deep-cleaning",
    studentName: "Jessica Miller",
    studentAvatar: "https://i.pravatar.cc/120?img=5",
    date: "Mon, Jul 6, 2026",
    time: "10:00 AM",
    quantity: 1,
    amount: 80,
    payout: 68,
    status: "pending",
    requestedAgo: "2h ago",
    note: "Hi! It's a 2-bedroom apartment. Looking forward to learning your system.",
  },
  {
    id: "rb-2002",
    serviceId: "deep-cleaning",
    studentName: "David Reyes",
    studentAvatar: "https://i.pravatar.cc/120?img=14",
    date: "Wed, Jul 8, 2026",
    time: "2:00 PM",
    quantity: 1,
    amount: 80,
    payout: 68,
    status: "pending",
    requestedAgo: "5h ago",
  },
  {
    id: "rb-2003",
    serviceId: "deep-cleaning",
    studentName: "Priya Sharma",
    studentAvatar: "https://i.pravatar.cc/120?img=32",
    date: "Fri, Jul 3, 2026",
    time: "9:00 AM",
    quantity: 2,
    amount: 160,
    payout: 136,
    status: "accepted",
    requestedAgo: "1d ago",
  },
  {
    id: "rb-2004",
    serviceId: "deep-cleaning",
    studentName: "Tom Becker",
    studentAvatar: "https://i.pravatar.cc/120?img=51",
    date: "Today",
    time: "11:30 AM",
    quantity: 1,
    amount: 80,
    payout: 68,
    status: "in_progress",
    requestedAgo: "3d ago",
  },
  {
    id: "rb-2005",
    serviceId: "deep-cleaning",
    studentName: "Sofia Lindqvist",
    studentAvatar: "https://i.pravatar.cc/120?img=20",
    date: "Mon, Jun 22, 2026",
    time: "4:00 PM",
    quantity: 1,
    amount: 80,
    payout: 68,
    status: "completed",
    requestedAgo: "1w ago",
  },
];

export function getReceivedBooking(id: string): ReceivedBooking | undefined {
  return incomingBookings.find((b) => b.id === id);
}

// Services Marco has published, with lightweight review/listing status.
export interface ListingStatus {
  serviceId: string;
  state: "published" | "pending_review" | "draft";
  views: number;
  bookings: number;
}

export const myListings: ListingStatus[] = [
  { serviceId: "deep-cleaning", state: "published", views: 1240, bookings: 38 },
];

export const instructorStats = {
  thisMonthEarnings: 1245.0,
  pendingRequests: 2,
  rating: 4.9,
  completedSessions: 38,
};
