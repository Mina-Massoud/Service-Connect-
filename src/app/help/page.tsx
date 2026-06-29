"use client";

import { useState } from "react";
import { ChevronDown, LifeBuoy, Mail } from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";

interface Faq {
  question: string;
  answer: string;
}

const FAQS: ReadonlyArray<Faq> = [
  {
    question: "How does escrow protect my payment?",
    answer:
      "When you book a session, your payment is held securely in escrow — not paid out immediately. Funds are only released to the instructor once you confirm the session was completed. If something goes wrong, the money stays protected until the issue is resolved.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Open any listing, pick a time that works from the instructor's availability, and tap Book. You'll review the price and confirm — your card is authorized into escrow and the instructor is notified to accept the request.",
  },
  {
    question: "How do I become an instructor?",
    answer:
      "Head to your Profile and tap Create a Listing. Add your skill, set your rate and availability, and complete identity verification. Once approved, your listing goes live and learners can start booking you.",
  },
  {
    question: "When and how do I get paid out?",
    answer:
      "Released escrow funds land in your in-app wallet. From the Wallet screen you can withdraw to a linked bank account or card. Standard withdrawals settle in 1–3 business days with no hidden fees.",
  },
  {
    question: "What happens with disputes and refunds?",
    answer:
      "If a session didn't go as agreed, open a dispute from your order within 48 hours. Our team reviews messages and booking details, and because funds sit in escrow we can issue a full or partial refund without chasing anyone for the money.",
  },
  {
    question: "Why do I need identity verification?",
    answer:
      "Verification keeps the community safe and trustworthy. We confirm your identity with a government ID and a quick selfie check. Verified members get a badge, higher visibility, and the ability to receive payouts.",
  },
  {
    question: "How do I contact a real person?",
    answer:
      "You can reach our support team any time using the Contact support card below. Include your order number if your question is about a specific booking so we can help faster.",
  },
];

function FaqRow({
  faq,
  isOpen,
  onToggle,
}: {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted"
      >
        <span className="flex-1 text-sm font-medium text-foreground">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
          {faq.answer}
        </p>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Screen header={<ScreenHeader title="Help & Support" />} tone="muted">
      {/* ── Intro card ── */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-brand-soft p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card">
          <LifeBuoy className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            How can we help?
          </h2>
          <p className="text-xs text-muted-foreground">
            Browse common questions or reach our team directly.
          </p>
        </div>
      </div>

      {/* ── FAQ accordion ── */}
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Frequently asked questions
      </h3>

      <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-card">
        {FAQS.map((faq, index) => (
          <FaqRow
            key={faq.question}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* ── Contact support card ── */}
      <div className="rounded-2xl border border-border bg-card p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground">
          Still need help?
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Our support team is here for you. We typically reply within a few
          hours.
        </p>
        <a
          href="mailto:support@serviceconnect.app"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Mail className="h-5 w-5" />
          Contact support
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          Average response time: under 4 hours
        </p>
      </div>
    </Screen>
  );
}
