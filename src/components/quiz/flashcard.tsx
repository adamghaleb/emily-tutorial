"use client";

import { QuizCard } from "@/types";
import { cn } from "@/lib/utils";
import { playFlip } from "@/lib/sounds";
import { Check } from "lucide-react";

const categoryStyles: Record<
  QuizCard["category"],
  { badge: string; border: string; glow: string; emoji: string }
> = {
  github: {
    badge: "bg-datefix-blue/15 text-datefix-blue",
    border: "border-datefix-blue/20",
    glow: "shadow-datefix-blue/10",
    emoji: "🐙",
  },
  claude: {
    badge: "bg-datefix-pink/15 text-datefix-pink",
    border: "border-datefix-pink/20",
    glow: "shadow-datefix-pink/10",
    emoji: "🤖",
  },
  datefix: {
    badge: "bg-datefix-gold/15 text-datefix-gold",
    border: "border-datefix-gold/20",
    glow: "shadow-datefix-gold/10",
    emoji: "📦",
  },
  terminal: {
    badge: "bg-datefix-green/15 text-datefix-green",
    border: "border-datefix-green/20",
    glow: "shadow-datefix-green/10",
    emoji: "💻",
  },
  vercel: {
    badge: "bg-datefix-blue/15 text-datefix-blue",
    border: "border-datefix-blue/20",
    glow: "shadow-datefix-blue/10",
    emoji: "🚀",
  },
};

interface FlashcardProps {
  card: QuizCard;
  flipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ card, flipped, onFlip }: FlashcardProps) {
  const style = categoryStyles[card.category];

  return (
    <button
      onClick={() => {
        playFlip();
        onFlip();
      }}
      className="perspective h-52 w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-datefix-blue focus-visible:ring-offset-2"
    >
      <div
        className={cn(
          "preserve-3d relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          flipped && "rotate-y-180",
        )}
      >
        {/* Front — question */}
        <div
          className={cn(
            "backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border bg-card p-5 transition-shadow hover:shadow-lg",
            style.border,
            !flipped && style.glow,
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-bold",
                style.badge,
              )}
            >
              {style.emoji} {card.category}
            </span>
            <span className="text-xs text-muted-foreground/50">tap me!</span>
          </div>
          <p className="text-base font-bold leading-snug text-foreground">
            {card.question}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-datefix-pink" />
            Tap to reveal answer
          </div>
        </div>

        {/* Back — answer */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border border-datefix-green/30 bg-gradient-to-br from-datefix-green/5 to-datefix-gold/5 p-5">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-bold",
                style.badge,
              )}
            >
              {style.emoji} {card.category}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-datefix-green/20">
              <Check className="h-3.5 w-3.5 text-datefix-green" />
            </div>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {card.answer}
          </p>
          <p className="text-xs font-semibold text-datefix-green">Nailed it!</p>
        </div>
      </div>
    </button>
  );
}
