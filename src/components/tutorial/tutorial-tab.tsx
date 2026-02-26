"use client";

import { tutorialSteps } from "@/data/tutorial-steps";
import { TutorialStep } from "@/components/tutorial/tutorial-step";
import { PartyPopper, Sparkles } from "lucide-react";

export function TutorialTab() {
  return (
    <div className="space-y-4">
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
          10 Steps to Pro
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Follow along at your own pace. Each step builds on the last.
          You&apos;ve totally got this.
        </p>
      </div>

      {/* Steps with staggered entrance */}
      <div className="stagger-children space-y-4">
        {tutorialSteps.map((step) => (
          <TutorialStep key={step.id} step={step} />
        ))}
      </div>

      {/* Celebration footer */}
      <div className="mt-10 rounded-2xl border border-datefix-green/20 bg-gradient-to-r from-datefix-green/5 via-datefix-gold/5 to-datefix-pink/5 p-8 text-center">
        <PartyPopper className="mx-auto mb-3 h-8 w-8 text-datefix-gold" />
        <p className="text-xl font-extrabold text-foreground">
          That&apos;s it! You&apos;re officially ready!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Go crush that interview, Emily. We&apos;re all rooting for you.
        </p>
      </div>
    </div>
  );
}
