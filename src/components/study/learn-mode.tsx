"use client";

import { useState, useMemo, useCallback } from "react";
import { quizCards } from "@/data/quiz-cards";
import { playClick, playCheckOff, playUncheck } from "@/lib/sounds";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";

interface LearnModeProps {
  onBack: () => void;
}

type AnswerState = "idle" | "correct" | "wrong" | "revealed";

/** Fisher-Yates shuffle (immutable) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build 4 options: correct answer + 3 distractors (from card data), shuffled */
function buildOptions(card: (typeof quizCards)[number]) {
  const options = [
    { id: card.id, text: card.answer, isCorrect: true },
    ...card.distractors.map((d, i) => ({
      id: -(card.id * 10 + i),
      text: d,
      isCorrect: false,
    })),
  ];
  return shuffle(options);
}

export function LearnMode({ onBack }: LearnModeProps) {
  const [shuffledCards] = useState(() => shuffle(quizCards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const total = shuffledCards.length;
  const currentCard = shuffledCards[currentIndex];

  // Build 4 options: correct answer + 3 distractors, shuffled
  const options = useMemo(() => {
    if (!currentCard) return [];
    return buildOptions(currentCard);
  }, [currentCard]);

  const advance = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      setFinished(true);
    } else {
      setCurrentIndex(nextIndex);
      setAnswerState("idle");
      setSelectedId(null);
    }
  }, [currentIndex, total]);

  const handleSelect = useCallback(
    (optionId: number, isCorrect: boolean) => {
      if (answerState !== "idle") return;

      setSelectedId(optionId);

      if (isCorrect) {
        setAnswerState("correct");
        setScore((s) => s + 1);
        playCheckOff();
      } else {
        setAnswerState("wrong");
        playUncheck();
      }

      setTimeout(advance, 1200);
    },
    [answerState, advance],
  );

  const correctOptionId = useMemo(
    () => options.find((o) => o.isCorrect)?.id ?? currentCard.id,
    [options, currentCard],
  );

  const handleDontKnow = useCallback(() => {
    if (answerState !== "idle") return;
    setAnswerState("revealed");
    setSelectedId(correctOptionId);
    playClick();
    setTimeout(advance, 1500);
  }, [answerState, correctOptionId, advance]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setAnswerState("idle");
    setSelectedId(null);
    setFinished(false);
  }, []);

  const progressPercent = finished
    ? 100
    : Math.round((currentIndex / total) * 100);

  // Emoji reaction based on score
  const getReaction = () => {
    const pct = score / total;
    if (pct === 1) return { emoji: "🏆", label: "Perfect score!" };
    if (pct >= 0.8) return { emoji: "🔥", label: "Amazing work!" };
    if (pct >= 0.6) return { emoji: "💪", label: "Solid effort!" };
    if (pct >= 0.4) return { emoji: "📚", label: "Keep studying!" };
    return { emoji: "🌱", label: "Room to grow!" };
  };

  // Option button styling per state
  const getOptionClasses = (optionId: number, optionIsCorrect: boolean) => {
    const base =
      "w-full rounded-xl border-2 p-4 text-left text-sm font-semibold transition-all duration-200";

    if (answerState === "idle") {
      return `${base} border-border bg-card text-foreground hover:border-datefix-blue/50 hover:bg-datefix-blue/5 cursor-pointer active:scale-[0.97]`;
    }

    const isSelected = optionId === selectedId;

    if (optionIsCorrect) {
      return `${base} border-datefix-green bg-datefix-green/10 text-foreground`;
    }
    if (isSelected && !optionIsCorrect) {
      return `${base} border-destructive bg-destructive/10 text-foreground`;
    }
    return `${base} border-border/50 bg-card/50 text-muted-foreground opacity-50`;
  };

  /* ---------- Results Screen ---------- */
  if (finished) {
    const reaction = getReaction();
    return (
      <div className="flex flex-col items-center gap-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Progress bar - full */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full rounded-full bg-datefix-green transition-all duration-500" />
        </div>

        {/* Results card */}
        <div className="animate-bounce-in flex w-full flex-col items-center gap-6 rounded-2xl border bg-card p-8 text-center">
          <div className="text-6xl">{reaction.emoji}</div>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">
              {reaction.label}
            </h2>
            <p className="mt-1 text-muted-foreground">
              You scored{" "}
              <span className="font-bold text-foreground">
                {score} / {total}
              </span>
            </p>
          </div>

          <div className="flex w-full items-center justify-center gap-3">
            <Trophy className="h-5 w-5 text-datefix-gold" />
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-datefix-gold transition-all duration-700"
                style={{ width: `${Math.round((score / total) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-datefix-gold">
              {Math.round((score / total) * 100)}%
            </span>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-xl bg-datefix-pink px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Question Screen ---------- */
  return (
    <div className="flex flex-col gap-5">
      {/* Header: back + score */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-sm font-bold text-foreground">
          {score} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-datefix-pink transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question number */}
      <p className="text-center text-xs font-medium text-muted-foreground">
        Question {currentIndex + 1} of {total}
      </p>

      {/* Card with question prompt */}
      <div className="rounded-2xl border bg-card p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-datefix-pink">
          Question
        </p>
        <p className="text-base font-semibold leading-relaxed text-foreground">
          {currentCard.question}
        </p>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id, option.isCorrect)}
            disabled={answerState !== "idle"}
            className={getOptionClasses(option.id, option.isCorrect)}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Don't know button */}
      {answerState === "idle" && (
        <button
          onClick={handleDontKnow}
          className="mx-auto text-sm font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline cursor-pointer"
        >
          Don&apos;t know?
        </button>
      )}

      {/* Feedback after answer */}
      {answerState === "correct" && (
        <p className="animate-slide-up text-center text-sm font-bold text-datefix-green">
          Correct!
        </p>
      )}
      {answerState === "wrong" && (
        <p className="animate-slide-up text-center text-sm font-bold text-destructive">
          Not quite — the correct answer is highlighted.
        </p>
      )}
      {answerState === "revealed" && (
        <p className="animate-slide-up text-center text-sm font-bold text-datefix-blue">
          The correct answer is highlighted above.
        </p>
      )}
    </div>
  );
}
