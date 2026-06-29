"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Phone, Video, PhoneOff, ShieldCheck } from "lucide-react";
import { Screen } from "@/components/phone/Screen";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { ChatInput } from "@/components/messaging/ChatInput";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useConversation, useActions } from "@/lib/store";
import { getProvider } from "@/lib/mock-data";

type CallMode = "voice" | "video" | null;

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const actions = useActions();
  const [callMode, setCallMode] = useState<CallMode>(null);

  const conv = useConversation(id);
  const provider = conv ? getProvider(conv.providerId) : undefined;

  if (!conv) {
    return (
      <Screen header={<ScreenHeader title="Chat" />}>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="font-semibold text-foreground">Conversation not found</p>
          <p className="text-sm text-muted-foreground">
            This conversation does not exist or has been removed.
          </p>
        </div>
      </Screen>
    );
  }

  function handleSend(text: string) {
    actions.sendMessage(id, { text });
  }

  return (
    <Screen
      header={
        <ScreenHeader
          title={provider?.name ?? "Chat"}
          action={
            <div className="-mr-2 flex items-center">
              <button
                type="button"
                aria-label="Voice call"
                onClick={() => setCallMode("voice")}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Video call"
                onClick={() => setCallMode("video")}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <Video className="h-4 w-4" />
              </button>
            </div>
          }
        />
      }
      padded={false}
      footer={<ChatInput onSend={handleSend} />}
    >
      {/* Booking context strip */}
      <div className="border-b border-border bg-brand-soft/40 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary">
            BOOKING ID #SC-8821
          </span>
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
            Confirmed
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          {conv.serviceTitle}
        </p>
        <p className="text-xs text-muted-foreground">Oct 24 · 10:00 AM</p>
      </div>

      {/* Security notice */}
      <div className="flex gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          For your security, contact details are masked. Keep all communication
          and payments within{" "}
          <span className="font-semibold text-primary">ServiceConnect</span> to
          stay protected by our Escrow Guarantee.
        </p>
      </div>

      {/* Message thread */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* Date separator */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Today
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {conv.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            providerAvatar={provider?.avatar}
          />
        ))}
      </div>

      <Dialog
        open={callMode !== null}
        onOpenChange={(open) => {
          if (!open) setCallMode(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          aria-label="Calling"
          className="flex flex-col items-center gap-6 py-8 text-center"
        >
          {/* Animated pulsing ring around avatar */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-28 w-28 animate-pulse rounded-full bg-primary/20" />
            <span className="absolute inline-flex h-24 w-24 rounded-full ring-2 ring-primary/40" />
            <img
              src={provider?.avatar ?? "https://i.pravatar.cc/96"}
              alt={provider?.name ?? "Provider"}
              className="relative h-20 w-20 rounded-full object-cover ring-2 ring-background"
              width={80}
              height={80}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-foreground">
              {provider?.name ?? "Provider"}
            </p>
            <p className="text-sm text-muted-foreground">
              {callMode === "video" ? "Video calling…" : "Calling…"}
            </p>
          </div>

          <button
            type="button"
            aria-label="End call"
            onClick={() => setCallMode(null)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </DialogContent>
      </Dialog>
    </Screen>
  );
}
