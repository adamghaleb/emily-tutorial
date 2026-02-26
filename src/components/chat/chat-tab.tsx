"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage, TypingIndicator } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { getResponse } from "@/lib/chat-engine";
import { playSend, playReceive } from "@/lib/sounds";
import { Sparkles } from "lucide-react";

const WELCOME_MESSAGE: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey Emily! 👋 I'm Job Bot — your personal guide to landing this job GUARANTEED. Ask me anything about GitHub, Claude Code, the datefix-demo project, or how things work. No question is too basic — we're getting you this job!",
};

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

  const handleSend = (content: string) => {
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    playSend();

    const delay = 500 + Math.random() * 300;
    setTimeout(() => {
      const response = getResponse(content);
      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      playReceive();
    }, delay);
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
          Your personal guide to landing this job. Ask me anything!
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
