"use client";

import { ChatMessage as ChatMessageType } from "@/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar — emoji style */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg",
          isUser
            ? "bg-datefix-pink/15"
            : "bg-gradient-to-br from-datefix-blue/20 to-datefix-pink/10",
        )}
      >
        {isUser ? "👩" : "🤖"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-gradient-to-br from-datefix-blue to-datefix-blue/90 text-white"
            : "rounded-tl-sm border border-border/50 bg-card text-foreground",
        )}
      >
        <p className="whitespace-pre-line">{message.content}</p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-datefix-blue/20 to-datefix-pink/10 text-lg">
        🤖
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border/50 bg-card px-4 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-datefix-pink/60" />
        <span className="typing-dot h-2 w-2 rounded-full bg-datefix-blue/60" />
        <span className="typing-dot h-2 w-2 rounded-full bg-datefix-gold/60" />
      </div>
    </div>
  );
}
