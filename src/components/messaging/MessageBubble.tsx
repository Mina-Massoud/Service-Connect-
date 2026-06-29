import { Download, FileText, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
  providerAvatar?: string;
}

const WAVEFORM_HEIGHTS = [3, 5, 4, 7, 5, 3, 6, 4, 5, 3, 7, 4] as const;

export function MessageBubble({ message, providerAvatar }: MessageBubbleProps) {
  const isMe = message.fromMe;

  return (
    <div className={cn("flex items-end gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
      {!isMe && (
        <img
          src={providerAvatar ?? "https://i.pravatar.cc/40"}
          alt="Provider"
          className="mb-1 h-7 w-7 flex-shrink-0 rounded-full object-cover"
          width={28}
          height={28}
        />
      )}

      <div className={cn("flex max-w-[75%] flex-col gap-1", isMe ? "items-end" : "items-start")}>
        {message.type === "text" && message.text && (
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              isMe
                ? "rounded-br-sm bg-primary text-primary-foreground"
                : "rounded-bl-sm bg-muted text-foreground",
            )}
          >
            {message.text}
          </div>
        )}

        {message.type === "document" && (
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5",
              isMe
                ? "rounded-br-sm bg-primary text-primary-foreground"
                : "rounded-bl-sm bg-muted text-foreground",
            )}
          >
            <FileText className="h-5 w-5 flex-shrink-0" />
            <span className="max-w-[120px] truncate text-sm font-medium">
              {message.meta ?? "Document"}
            </span>
            <Download className="h-4 w-4 flex-shrink-0 opacity-70" />
          </div>
        )}

        {message.type === "voice" && (
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5",
              isMe
                ? "rounded-br-sm bg-primary text-primary-foreground"
                : "rounded-bl-sm bg-muted text-foreground",
            )}
          >
            <button
              type="button"
              aria-label="Play voice message"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/20"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
            <div className="flex items-center gap-0.5">
              {WAVEFORM_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-0.5 rounded-full",
                    isMe ? "bg-primary-foreground/70" : "bg-foreground/40",
                  )}
                  style={{ height: `${h * 2}px` }}
                />
              ))}
            </div>
            <span className="text-xs opacity-75">{message.meta ?? "0:00"}</span>
          </div>
        )}

        {message.type === "image" && message.meta && (
          <img
            src={message.meta}
            alt="Shared image"
            className="max-w-[200px] rounded-2xl object-cover"
          />
        )}

        <span className="px-1 text-xs text-muted-foreground">{message.time}</span>
      </div>
    </div>
  );
}
