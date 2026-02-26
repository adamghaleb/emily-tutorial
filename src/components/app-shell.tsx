"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  MessageCircle,
  Brain,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorialTab } from "@/components/tutorial/tutorial-tab";
import { ChatTab } from "@/components/chat/chat-tab";
import { QuizTab } from "@/components/quiz/quiz-tab";

type Tab = "tutorial" | "chat" | "quiz";

const tabs: {
  id: Tab;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "tutorial",
    label: "Learn",
    emoji: "📚",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-datefix-blue",
  },
  {
    id: "chat",
    label: "Ask",
    emoji: "💬",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "text-datefix-pink",
  },
  {
    id: "quiz",
    label: "Quiz",
    emoji: "🧠",
    icon: <Brain className="h-4 w-4" />,
    color: "text-datefix-gold",
  },
];

const tabColors: Record<Tab, string> = {
  tutorial: "border-datefix-blue text-datefix-blue",
  chat: "border-datefix-pink text-datefix-pink",
  quiz: "border-datefix-gold text-datefix-gold",
};

interface AppShellProps {
  onBack: () => void;
}

export function AppShell({ onBack }: AppShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tutorial");

  useEffect(() => {
    const saved = localStorage.getItem("emily-tutorial-tab");
    if (saved === "tutorial" || saved === "chat" || saved === "quiz") {
      setActiveTab(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("emily-tutorial-tab", activeTab);
  }, [activeTab]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-datefix-gold" />
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                Emily&apos;s Guide
              </h1>
            </div>
          </div>
          <span className="rounded-full bg-datefix-pink/10 px-3 py-1 text-xs font-medium text-datefix-pink">
            by Adam
          </span>
        </div>

        {/* Tab bar — pill style */}
        <div className="mx-auto max-w-3xl px-4 pb-2">
          <nav className="flex gap-1 rounded-xl bg-accent/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
                  activeTab === tab.id
                    ? "bg-card shadow-sm " + tabColors[tab.id]
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-base">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Tab content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {activeTab === "tutorial" && <TutorialTab />}
        {activeTab === "chat" && <ChatTab />}
        {activeTab === "quiz" && <QuizTab />}
      </main>
    </div>
  );
}
