"use client";

import { playClick } from "@/lib/sounds";
import {
  Layers,
  RefreshCw,
  FileText,
  Grid3X3,
  Rocket,
  LayoutGrid,
} from "lucide-react";

export type StudyMode =
  | "hub"
  | "flashcards"
  | "learn"
  | "test"
  | "match"
  | "blast"
  | "blocks";

const modes: {
  id: StudyMode;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  description: string;
}[] = [
  {
    id: "flashcards",
    label: "Flashcards",
    emoji: "🃏",
    icon: <Layers className="h-6 w-6" />,
    color: "text-datefix-blue",
    bg: "bg-datefix-blue/10 border-datefix-blue/20 hover:border-datefix-blue/40",
    description: "Flip through cards at your own pace",
  },
  {
    id: "learn",
    label: "Learn",
    emoji: "🎯",
    icon: <RefreshCw className="h-6 w-6" />,
    color: "text-datefix-pink",
    bg: "bg-datefix-pink/10 border-datefix-pink/20 hover:border-datefix-pink/40",
    description: "Multiple choice, one at a time",
  },
  {
    id: "test",
    label: "Test",
    emoji: "📝",
    icon: <FileText className="h-6 w-6" />,
    color: "text-datefix-green",
    bg: "bg-datefix-green/10 border-datefix-green/20 hover:border-datefix-green/40",
    description: "Full quiz — submit when ready",
  },
  {
    id: "blocks",
    label: "Blocks",
    emoji: "🧱",
    icon: <LayoutGrid className="h-6 w-6" />,
    color: "text-datefix-gold",
    bg: "bg-datefix-gold/10 border-datefix-gold/20 hover:border-datefix-gold/40",
    description: "Puzzle game with quiz questions",
  },
  {
    id: "blast",
    label: "Blast",
    emoji: "💥",
    icon: <Rocket className="h-6 w-6" />,
    color: "text-datefix-blue",
    bg: "bg-datefix-blue/10 border-datefix-blue/20 hover:border-datefix-blue/40",
    description: "Shoot the correct answers!",
  },
  {
    id: "match",
    label: "Match",
    emoji: "🧩",
    icon: <Grid3X3 className="h-6 w-6" />,
    color: "text-datefix-pink",
    bg: "bg-datefix-pink/10 border-datefix-pink/20 hover:border-datefix-pink/40",
    description: "Timed memory matching game",
  },
];

interface StudyHubProps {
  onSelect: (mode: StudyMode) => void;
}

export function StudyHub({ onSelect }: StudyHubProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Study Games
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Pick a mode and master everything. This job is yours.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              playClick();
              onSelect(mode.id);
            }}
            className={`hover-lift group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border p-5 transition-all ${mode.bg}`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-card/50 ${mode.color} transition-transform group-hover:scale-110`}
            >
              {mode.icon}
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-foreground">
                {mode.emoji} {mode.label}
              </span>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {mode.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
