"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { quizCards } from "@/data/quiz-cards";
import { QuizCard } from "@/types";
import { playFlip, playClick } from "@/lib/sounds";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Shuffle,
  Github,
  Sparkles,
  Package,
  Terminal,
  Rocket,
} from "lucide-react";

const categoryIcons: Record<QuizCard["category"], React.ReactNode> = {
  github: <Github className="h-3 w-3" />,
  claude: <Sparkles className="h-3 w-3" />,
  datefix: <Package className="h-3 w-3" />,
  terminal: <Terminal className="h-3 w-3" />,
  vercel: <Rocket className="h-3 w-3" />,
};

const categoryStyles: Record<QuizCard["category"], { badge: string }> = {
  github: { badge: "bg-datefix-blue/15 text-datefix-blue" },
  claude: { badge: "bg-datefix-pink/15 text-datefix-pink" },
  datefix: { badge: "bg-datefix-gold/15 text-datefix-gold" },
  terminal: { badge: "bg-datefix-green/15 text-datefix-green" },
  vercel: { badge: "bg-datefix-blue/15 text-datefix-blue" },
};

interface FlashcardsModeProps {
  onBack: () => void;
}

export function FlashcardsMode({ onBack }: FlashcardsModeProps) {
  const [order, setOrder] = useState<number[]>(() =>
    quizCards.map((c) => c.id),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );

  const orderedCards = useMemo(
    () => order.map((id) => quizCards.find((c) => c.id === id)!),
    [order],
  );

  const card = orderedCards[currentIndex];
  const style = categoryStyles[card.category];
  const total = orderedCards.length;

  const goTo = useCallback(
    (direction: "prev" | "next") => {
      playClick();
      setIsFlipped(false);
      setSlideDirection(direction === "next" ? "left" : "right");

      // Reset slide animation after it plays
      const timeout = setTimeout(() => setSlideDirection(null), 300);

      setCurrentIndex((prev) => {
        if (direction === "next") return prev < total - 1 ? prev + 1 : 0;
        return prev > 0 ? prev - 1 : total - 1;
      });

      return () => clearTimeout(timeout);
    },
    [total],
  );

  const handleFlip = useCallback(() => {
    playFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = useCallback(() => {
    playClick();
    setIsFlipped(false);
    setCurrentIndex(0);
    setOrder((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo("next");
      } else if (e.key === " ") {
        e.preventDefault();
        handleFlip();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goTo, handleFlip]);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="flex cursor-pointer items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <button
          onClick={handleShuffle}
          className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </button>
      </div>

      {/* Card area */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div
          className={cn(
            "perspective w-full max-w-lg transition-transform duration-300 ease-out",
            slideDirection === "left" &&
              "animate-[slide-in-left_0.3s_ease-out]",
            slideDirection === "right" &&
              "animate-[slide-in-right_0.3s_ease-out]",
          )}
        >
          <button
            onClick={handleFlip}
            className="perspective h-[350px] w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-datefix-blue focus-visible:ring-offset-2"
            aria-label={isFlipped ? "Show question" : "Show answer"}
          >
            <div
              className={cn(
                "preserve-3d relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                isFlipped && "rotate-y-180",
              )}
            >
              {/* Front — question */}
              <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-bold",
                      style.badge,
                    )}
                  >
                    {categoryIcons[card.category]} {card.category}
                  </span>
                  <span className="text-xs text-muted-foreground/60">Term</span>
                </div>

                <p className="text-center text-2xl font-extrabold leading-snug text-foreground">
                  {card.term}
                </p>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-datefix-pink" />
                  Click to flip
                </div>
              </div>

              {/* Back — answer */}
              <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border border-datefix-green/30 bg-card p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-bold",
                      style.badge,
                    )}
                  >
                    {categoryIcons[card.category]} {card.category}
                  </span>
                  <span className="text-xs font-semibold text-datefix-green">
                    Definition
                  </span>
                </div>

                <p className="whitespace-pre-line text-center text-base leading-relaxed text-foreground">
                  {card.answer}
                </p>

                <p className="text-center text-xs text-muted-foreground/50">
                  Click to flip back
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          onClick={() => goTo("prev")}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/50 bg-card text-foreground transition-all hover:scale-105 hover:bg-accent active:scale-95"
          aria-label="Previous card"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="min-w-[60px] text-center text-sm font-bold tabular-nums text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>

        <button
          onClick={() => goTo("next")}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border/50 bg-card text-foreground transition-all hover:scale-105 hover:bg-accent active:scale-95"
          aria-label="Next card"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
