"use client";

import { useState } from "react";
import { StudyHub, type StudyMode } from "@/components/study/study-hub";
import { FlashcardsMode } from "@/components/study/flashcards-mode";
import { LearnMode } from "@/components/study/learn-mode";
import { TestMode } from "@/components/study/test-mode";
import { MatchGame } from "@/components/study/match-game";
import { BlastGame } from "@/components/study/blast-game";
import { BlocksGame } from "@/components/study/blocks-game";

export function StudyTab() {
  const [mode, setMode] = useState<StudyMode>("hub");

  const handleBack = () => setMode("hub");

  if (mode === "flashcards") return <FlashcardsMode onBack={handleBack} />;
  if (mode === "learn") return <LearnMode onBack={handleBack} />;
  if (mode === "test") return <TestMode onBack={handleBack} />;
  if (mode === "match") return <MatchGame onBack={handleBack} />;
  if (mode === "blast") return <BlastGame onBack={handleBack} />;
  if (mode === "blocks") return <BlocksGame onBack={handleBack} />;

  return <StudyHub onSelect={setMode} />;
}
