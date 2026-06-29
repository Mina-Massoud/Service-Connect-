import type { Review } from "@/lib/types";

export const reviews: Review[] = [
  {
    id: "r1",
    authorName: "Jessica M.",
    authorAvatar: "https://i.pravatar.cc/120?img=5",
    rating: 5,
    date: "2 weeks ago",
    body: "Absolutely worth it. I learned a system I actually use every week. The instructor was patient and incredibly thorough.",
  },
  {
    id: "r2",
    authorName: "David R.",
    authorAvatar: "https://i.pravatar.cc/120?img=14",
    rating: 5,
    date: "1 month ago",
    body: "Clear, practical and friendly. Showed up on time and answered every question I had. Highly recommend.",
  },
  {
    id: "r3",
    authorName: "Priya S.",
    authorAvatar: "https://i.pravatar.cc/120?img=32",
    rating: 4,
    date: "1 month ago",
    body: "Great session overall. Would have loved a little more time at the end, but I left feeling confident.",
  },
  {
    id: "r4",
    authorName: "Tom B.",
    authorAvatar: "https://i.pravatar.cc/120?img=51",
    rating: 5,
    date: "2 months ago",
    body: "Exceeded my expectations. The escrow payment made me feel safe booking with someone new.",
  },
];
