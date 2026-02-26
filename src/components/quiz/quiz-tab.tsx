"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { quizCards } from "@/data/quiz-cards";
import { Flashcard } from "@/components/quiz/flashcard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { playClick, playCelebration } from "@/lib/sounds";
import { Confetti } from "@/components/confetti";
import { Shuffle, RotateCcw, Sparkles, Trophy } from "lucide-react";

export function QuizTab() {
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  const [order, setOrder] = useState<number[]>(() =>
    quizCards.map((c) => c.id),
  );

  const orderedCards = useMemo(
    () => order.map((id) => quizCards.find((c) => c.id === id)!),
    [order],
  );

  const progress = Math.round((flippedIds.size / quizCards.length) * 100);
  const allDone = flippedIds.size === quizCards.length;
  const [showConfetti, setShowConfetti] = useState(false);
  const prevFlipped = useRef(flippedIds.size);

  useEffect(() => {
    if (
      flippedIds.size === quizCards.length &&
      prevFlipped.current < quizCards.length &&
      quizCards.length > 0
    ) {
      playCelebration();
      setShowConfetti(true);
    }
    prevFlipped.current = flippedIds.size;
  }, [flippedIds]);

  const handleFlip = useCallback((id: number) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleShuffle = () => {
    playClick();
    setOrder((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const handleReset = () => {
    playClick();
    setFlippedIds(new Set());
    setOrder(quizCards.map((c) => c.id));
  };

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Header */}
      <div className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-datefix-gold" />
          <span className="text-xs font-bold tracking-[0.2em] text-datefix-gold uppercase">
            Brain Check
          </span>
          <Sparkles className="h-4 w-4 text-datefix-gold" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Flashcard Quiz
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Tap to flip! See how many you already know.
        </p>
      </div>

      {/* Progress bar with personality */}
      <div className="rounded-2xl border border-border/50 bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            {flippedIds.size} of {quizCards.length} revealed
          </span>
          <span className="font-bold text-datefix-gold">
            {progress}%{" "}
            {progress === 100
              ? "🎉"
              : progress >= 50
                ? "🔥"
                : progress > 0
                  ? "💪"
                  : ""}
          </span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShuffle}
          className="cursor-pointer gap-2 rounded-xl font-semibold"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="cursor-pointer gap-2 rounded-xl font-semibold"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Cards grid */}
      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orderedCards.map((card) => (
          <Flashcard
            key={card.id}
            card={card}
            flipped={flippedIds.has(card.id)}
            onFlip={() => handleFlip(card.id)}
          />
        ))}
      </div>

      {/* Celebration */}
      {allDone && (
        <div className="animate-bounce-in rounded-2xl border border-datefix-gold/30 bg-gradient-to-r from-datefix-gold/5 via-datefix-pink/5 to-datefix-blue/5 p-8 text-center">
          <Trophy className="mx-auto mb-3 h-10 w-10 text-datefix-gold" />
          <p className="text-xl font-extrabold text-foreground">
            You nailed every single one!
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Interview mode: activated. You&apos;re going to crush it.
          </p>
        </div>
      )}
    </div>
  );
}
