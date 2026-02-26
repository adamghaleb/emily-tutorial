"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { quizCards } from "@/data/quiz-cards";
import { playClick, playCelebration } from "@/lib/sounds";
import { Confetti } from "@/components/confetti";
import type { QuizCard } from "@/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Use the card's built-in distractors */
function getDistractors(card: QuizCard): string[] {
  return [...card.distractors];
}

function getResultEmoji(pct: number): string {
  if (pct === 100) return "🎉";
  if (pct >= 80) return "🔥";
  if (pct >= 60) return "💪";
  if (pct >= 40) return "📚";
  return "🤔";
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface TestModeProps {
  onBack: () => void;
}

interface TestQuestion {
  card: QuizCard;
  options: string[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function TestMode({ onBack }: TestModeProps) {
  /* Build shuffled questions + options once on mount */
  const questions: TestQuestion[] = useMemo(() => {
    const shuffledCards = shuffle(quizCards);
    return shuffledCards.map((card) => {
      const distractors = getDistractors(card);
      const options = shuffle([card.answer, ...distractors]);
      return { card, options };
    });
  }, []);

  const totalQuestions = questions.length;

  /* Answers map: questionIndex -> selected answer string */
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  const allAnswered = Object.keys(answers).length === totalQuestions;

  /* ---- Computed results ---- */
  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.card.answer ? 1 : 0),
      0,
    );
  }, [submitted, questions, answers]);

  const pct = Math.round((score / totalQuestions) * 100);

  /* ---- Handlers ---- */
  const selectOption = useCallback(
    (qIdx: number, option: string) => {
      if (submitted) return;
      playClick();
      setAnswers((prev) => ({ ...prev, [qIdx]: option }));
    },
    [submitted],
  );

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    topRef.current?.scrollIntoView({ behavior: "smooth" });

    /* Check if perfect score (need to compute inline since state hasn't flushed) */
    const correct = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.card.answer ? 1 : 0),
      0,
    );
    if (correct === totalQuestions) {
      playCelebration();
      setShowConfetti(true);
    }
  }, [questions, answers, totalQuestions]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setShowConfetti(false);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ---- Option style builder ---- */
  function optionClasses(qIdx: number, option: string): string {
    const base =
      "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer";

    if (!submitted) {
      const selected = answers[qIdx] === option;
      return selected
        ? `${base} border-datefix-blue ring-2 ring-datefix-blue bg-datefix-blue/10 text-foreground`
        : `${base} border-border bg-card text-foreground hover:border-datefix-blue/40`;
    }

    /* Post-submit states */
    const isCorrect = option === questions[qIdx].card.answer;
    const wasSelected = answers[qIdx] === option;

    if (isCorrect) {
      return `${base} border-datefix-green bg-datefix-green/10 text-foreground ring-2 ring-datefix-green`;
    }
    if (wasSelected && !isCorrect) {
      return `${base} border-destructive bg-destructive/10 text-foreground ring-2 ring-destructive`;
    }
    return `${base} border-border bg-card/50 text-muted-foreground opacity-60`;
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6 pb-12">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Top bar */}
      <div ref={topRef} className="flex items-center gap-3">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Test
          </h2>
          <p className="text-xs text-muted-foreground">
            Answer all {totalQuestions} questions, then submit.
          </p>
        </div>
      </div>

      {/* Results banner */}
      {submitted && (
        <div className="animate-slide-up rounded-2xl border border-datefix-blue/20 bg-datefix-blue/5 p-5 text-center">
          <p className="text-4xl">{getResultEmoji(pct)}</p>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {score} / {totalQuestions}
          </p>
          <p className="text-sm text-muted-foreground">{pct}% correct</p>
          <button
            onClick={handleRetake}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-datefix-blue px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
          >
            Retake Test
          </button>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const wasCorrect = submitted && answers[qIdx] === q.card.answer;
          const wasWrong = submitted && answers[qIdx] !== q.card.answer;

          return (
            <div
              key={q.card.id}
              className={`rounded-2xl border p-5 transition-colors ${
                submitted
                  ? wasCorrect
                    ? "border-datefix-green/30 bg-datefix-green/5"
                    : "border-destructive/30 bg-destructive/5"
                  : "border-border bg-card"
              }`}
            >
              {/* Header row */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {qIdx + 1} of {totalQuestions}
                </span>
                {submitted && (
                  <span className="flex items-center gap-1 text-xs font-semibold">
                    {wasCorrect ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-datefix-green" />
                        <span className="text-datefix-green">Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">Incorrect</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question prompt */}
              <p className="mb-4 text-sm font-semibold leading-relaxed text-foreground">
                {q.card.question}
              </p>

              {/* Options grid */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.options.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => selectOption(qIdx, option)}
                    disabled={submitted}
                    className={optionClasses(qIdx, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="cursor-pointer rounded-xl bg-datefix-blue px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Submit Test
          </button>
        </div>
      )}
    </div>
  );
}
