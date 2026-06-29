import type { Conversation } from "@/lib/types";

export const conversations: Conversation[] = [
  {
    id: "conv-marco",
    providerId: "marco",
    serviceTitle: "Professional Deep Home Cleaning",
    messages: [
      {
        id: "m1",
        fromMe: false,
        text: "Hi! Thanks for booking. Looking forward to our session on Monday 👋",
        time: "9:02 AM",
        type: "text",
      },
      {
        id: "m2",
        fromMe: true,
        text: "Hi Marco! Excited to learn. Should I prepare anything beforehand?",
        time: "9:05 AM",
        type: "text",
      },
      {
        id: "m3",
        fromMe: false,
        text: "Just clear the kitchen counters and I'll bring all the supplies. Here's the checklist:",
        time: "9:06 AM",
        type: "text",
      },
      {
        id: "m4",
        fromMe: false,
        time: "9:06 AM",
        type: "document",
        meta: "cleaning-checklist.pdf",
      },
      {
        id: "m5",
        fromMe: true,
        text: "Perfect, got it. See you Monday!",
        time: "9:10 AM",
        type: "text",
      },
      {
        id: "m6",
        fromMe: false,
        time: "9:12 AM",
        type: "voice",
        meta: "0:14",
      },
    ],
  },
  {
    id: "conv-ahmed",
    providerId: "ahmed",
    serviceTitle: "Saltwater Fishing for Beginners",
    messages: [
      {
        id: "a1",
        fromMe: false,
        text: "Weather looks great for Saturday. Meet at the marina entrance at 6:30am.",
        time: "Yesterday",
        type: "text",
      },
      {
        id: "a2",
        fromMe: true,
        text: "Sounds good! Do I need a fishing license?",
        time: "Yesterday",
        type: "text",
      },
      {
        id: "a3",
        fromMe: false,
        text: "All covered under the day pass — no worries. Just bring sunscreen ☀️",
        time: "Yesterday",
        type: "text",
      },
    ],
  },
];

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
