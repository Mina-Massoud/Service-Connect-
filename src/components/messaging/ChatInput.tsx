"use client";

import { useState } from "react";
import { Mic, Plus, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Attach file"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-5 w-5" />
      </button>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="h-10 flex-1 rounded-full border border-border bg-muted px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
      />

      <button
        type="button"
        aria-label={hasText ? "Send message" : "Record voice message"}
        onClick={hasText ? handleSend : undefined}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/80"
      >
        {hasText ? <Send className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
    </div>
  );
}
