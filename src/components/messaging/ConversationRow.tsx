import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { getProvider } from "@/lib/mock-data";
import type { Conversation, ChatMessage } from "@/lib/types";

function getLastMessagePreview(msg: ChatMessage): string {
  if (msg.type === "voice") return "Voice message";
  if (msg.type === "document") return msg.meta ?? "Document";
  if (msg.type === "image") return "Photo";
  return msg.text ?? "";
}

interface ConversationRowProps {
  conversation: Conversation;
  unread?: boolean;
}

export function ConversationRow({ conversation, unread = false }: ConversationRowProps) {
  const provider = getProvider(conversation.providerId);
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  const preview = lastMsg ? getLastMessagePreview(lastMsg) : "";

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted"
    >
      <div className="relative flex-shrink-0">
        <img
          src={provider?.avatar ?? `https://i.pravatar.cc/80?u=${conversation.providerId}`}
          alt={provider?.name ?? "Provider"}
          className="h-12 w-12 rounded-full object-cover"
          width={48}
          height={48}
        />
        {unread && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground">
            {provider?.name ?? "Provider"}
          </span>
          {provider?.verified && (
            <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{conversation.serviceTitle}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{preview}</p>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
        <span className="text-xs text-muted-foreground">
          {lastMsg?.time ?? ""}
        </span>
        {unread && (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
      </div>
    </Link>
  );
}
