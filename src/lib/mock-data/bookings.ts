import type { Booking, PipelineStep } from "@/lib/types";

export const bookings: Booking[] = [
  {
    id: "bk-1024",
    serviceId: "deep-cleaning",
    date: "Mon, Jul 6, 2026",
    time: "10:00 AM",
    quantity: 1,
    servicePrice: 80,
    platformFee: 12,
    total: 92,
    status: "escrow_held",
  },
  {
    id: "bk-1025",
    serviceId: "saltwater-fishing",
    date: "Sat, Jul 11, 2026",
    time: "6:30 AM",
    quantity: 2,
    servicePrice: 130,
    platformFee: 19.5,
    total: 149.5,
    status: "in_progress",
  },
  {
    id: "bk-1026",
    serviceId: "sushi-making",
    date: "Thu, Jun 25, 2026",
    time: "5:00 PM",
    quantity: 2,
    servicePrice: 220,
    platformFee: 33,
    total: 253,
    status: "completed",
  },
  {
    id: "bk-1027",
    serviceId: "portrait-photography",
    date: "Tue, Jun 17, 2026",
    time: "9:00 AM",
    quantity: 1,
    servicePrice: 135,
    platformFee: 20.25,
    total: 155.25,
    status: "funds_released",
  },
];

export function getBooking(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export const defaultBooking = bookings[0];

// Service order pipeline (used on the order-status screen)
export const orderPipeline: PipelineStep[] = [
  {
    label: "Booking Confirmed",
    description: "Your booking has been accepted by the instructor.",
    state: "done",
  },
  {
    label: "Payment Secured",
    description: "Funds are held safely in escrow until completion.",
    state: "done",
  },
  {
    label: "Session In Progress",
    description: "Your session is underway. Enjoy the lesson!",
    state: "active",
  },
  {
    label: "Confirm Completion",
    description: "Confirm the session to release funds to the instructor.",
    state: "upcoming",
  },
  {
    label: "Leave a Review",
    description: "Share your experience and rate your instructor.",
    state: "upcoming",
  },
];
