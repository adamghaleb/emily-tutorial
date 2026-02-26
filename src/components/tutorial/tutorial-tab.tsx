"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { tutorialSteps } from "@/data/tutorial-steps";
import { TutorialStep } from "@/components/tutorial/tutorial-step";
import { BuildGuide } from "@/components/tutorial/build-guide";
import { Confetti } from "@/components/confetti";
import { playCheckOff, playUncheck, playCelebration } from "@/lib/sounds";
import { PartyPopper, Sparkles, Trophy } from "lucide-react";

const STORAGE_KEY = "emily-tutorial-completed";
const TOTAL = tutorialSteps.length;

type View = "steps" | "build-guide";

export function TutorialTab() {
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [view, setView] = useState<View>("steps");
  const prevCompleted = useRef(completedIds.size);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const ids: number[] = JSON.parse(saved);
        setCompletedIds(new Set(ids));
        prevCompleted.current = ids.length;
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]));
  }, [completedIds]);

  // Celebration when all steps are completed
  useEffect(() => {
    if (
      completedIds.size === TOTAL &&
      prevCompleted.current < TOTAL &&
      TOTAL > 0
    ) {
      playCelebration();
      setShowConfetti(true);
    }
    prevCompleted.current = completedIds.size;
  }, [completedIds]);

  const handleToggle = useCallback((id: number) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        playUncheck();
      } else {
        next.add(id);
        playCheckOff();
      }
      return next;
    });
  }, []);

  const handleAction = useCallback((actionId: string) => {
    if (actionId === "build-guide") {
      setView("build-guide");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const allDone = completedIds.size === TOTAL;
  const doneCount = completedIds.size;

  // Build Guide sub-view
  if (view === "build-guide") {
    return (
      <BuildGuide
        onBack={() => {
          setView("steps");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Header with flair */}
      <div className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-datefix-gold" />
          <span className="text-xs font-bold tracking-[0.2em] text-datefix-blue uppercase">
            Your Roadmap
          </span>
          <Sparkles className="h-5 w-5 text-datefix-gold" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          10 Steps to Getting the Job
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Follow along at your own pace. Check off each step as you go. This job
          is yours, guaranteed.
        </p>
        {/* Progress indicator */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-datefix-green">
            {doneCount}/{TOTAL} completed
          </span>
          <span className="text-sm">
            {allDone
              ? "🎉"
              : doneCount >= 7
                ? "🔥"
                : doneCount >= 3
                  ? "💪"
                  : doneCount > 0
                    ? "✨"
                    : ""}
          </span>
        </div>
      </div>

      {/* Steps with staggered entrance */}
      <div className="stagger-children space-y-4">
        {tutorialSteps.map((step) => (
          <TutorialStep
            key={step.id}
            step={step}
            completed={completedIds.has(step.id)}
            onToggle={() => handleToggle(step.id)}
            onAction={handleAction}
          />
        ))}
      </div>

      {/* Celebration footer */}
      <div
        className={`mt-10 rounded-2xl border p-8 text-center transition-all ${
          allDone
            ? "animate-glow border-datefix-gold/40 bg-gradient-to-r from-datefix-gold/10 via-datefix-pink/10 to-datefix-blue/10"
            : "border-datefix-green/20 bg-gradient-to-r from-datefix-green/5 via-datefix-gold/5 to-datefix-pink/5"
        }`}
      >
        {allDone ? (
          <Trophy className="mx-auto mb-3 h-10 w-10 text-datefix-gold" />
        ) : (
          <PartyPopper className="mx-auto mb-3 h-8 w-8 text-datefix-gold" />
        )}
        <p className="text-xl font-extrabold text-foreground">
          {allDone
            ? "ALL DONE! The job is YOURS! 🎉"
            : "That's it! You're officially ready!"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {allDone
            ? "Every step complete. Go crush that interview, Emily. We're all rooting for you!"
            : "Check off each step as you complete it. You've totally got this."}
        </p>
      </div>
    </div>
  );
}
