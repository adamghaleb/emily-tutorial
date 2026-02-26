"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 rounded-2xl border border-border/50 bg-card p-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your question here..."
        disabled={disabled}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        className="h-10 w-10 shrink-0 cursor-pointer rounded-xl bg-gradient-to-r from-datefix-blue to-datefix-pink text-white transition-all hover:scale-105 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
