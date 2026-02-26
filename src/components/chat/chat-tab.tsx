"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage, TypingIndicator } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { playSend, playReceive } from "@/lib/sounds";
import { Sparkles } from "lucide-react";

const WELCOME_MESSAGE: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey Emily! I'm Job Bot — your personal guide to landing this job GUARANTEED. Ask me anything about GitHub, Claude Code, the datefix-demo project, or how things work. No question is too basic — we're getting you this job!",
};

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

async function fetchWithRetry(
  messages: { role: string; content: string }[],
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (
        !res.ok &&
        res.status >= 400 &&
        res.status < 500 &&
        res.status !== 429
      ) {
        // Don't retry 4xx errors (except 429)
        const data = await res.json().catch(() => ({}));
        return (
          data.response ?? "Hmm, something went sideways. Try asking again!"
        );
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.response;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < MAX_RETRIES - 1) {
        const delay =
          INITIAL_DELAY * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error("Chat fetch failed after retries:", lastError);
  return "Oops! I'm having trouble connecting right now. Try again in a moment!";
}

export function ChatTab() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    WELCOME_MESSAGE,
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);
    playSend();

    // Build conversation history for the API (skip the welcome message id stuff)
    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetchWithRetry(apiMessages);

    const assistantMessage: ChatMessageType = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
    playReceive();
  };

  return (
    <div className="flex h-[calc(100dvh-11rem)] flex-col">
      {/* Header */}
      <div className="mb-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-datefix-pink" />
          <span className="text-xs font-bold tracking-[0.2em] text-datefix-pink uppercase">
            Ask Anything
          </span>
          <Sparkles className="h-4 w-4 text-datefix-pink" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Job Bot
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Powered by Claude — ask me anything!
        </p>
      </div>

      {/* Messages — native scroll with custom scrollbar */}
      <div
        ref={scrollRef}
        className="custom-scrollbar flex-1 space-y-4 overflow-y-auto overscroll-contain rounded-2xl border border-border/50 bg-card/20 p-4"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="mt-3">
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
