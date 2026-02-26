"use client";

import { useState } from "react";
import { TutorialStep as TutorialStepType } from "@/types";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/sounds";
import {
  Copy,
  Check,
  ExternalLink,
  Github,
  FolderGit2,
  Terminal,
  Sparkles,
  Download,
  FolderTree,
  Wand2,
  Paintbrush,
  FileImage,
  Rocket,
  CircleCheck,
  Circle,
  BookOpen,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  github: <Github className="h-5 w-5" />,
  "folder-git": <FolderGit2 className="h-5 w-5" />,
  terminal: <Terminal className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  download: <Download className="h-5 w-5" />,
  "folder-tree": <FolderTree className="h-5 w-5" />,
  wand: <Wand2 className="h-5 w-5" />,
  paintbrush: <Paintbrush className="h-5 w-5" />,
  "file-image": <FileImage className="h-5 w-5" />,
  rocket: <Rocket className="h-5 w-5" />,
};

const stepAccents = [
  {
    bg: "bg-datefix-blue/10",
    text: "text-datefix-blue",
    border: "border-datefix-blue/20",
  },
  {
    bg: "bg-datefix-pink/10",
    text: "text-datefix-pink",
    border: "border-datefix-pink/20",
  },
  {
    bg: "bg-datefix-gold/10",
    text: "text-datefix-gold",
    border: "border-datefix-gold/20",
  },
  {
    bg: "bg-datefix-green/10",
    text: "text-datefix-green",
    border: "border-datefix-green/20",
  },
  {
    bg: "bg-datefix-blue/10",
    text: "text-datefix-blue",
    border: "border-datefix-blue/20",
  },
];

interface TutorialStepProps {
  step: TutorialStepType;
  completed: boolean;
  onToggle: () => void;
  onAction?: (actionId: string) => void;
}

export function TutorialStep({
  step,
  completed,
  onToggle,
  onAction,
}: TutorialStepProps) {
  const [copied, setCopied] = useState(false);
  const accent = stepAccents[(step.id - 1) % stepAccents.length];

  const handleCopy = async () => {
    if (!step.code) return;
    playClick();
    await navigator.clipboard.writeText(step.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allLinks = [...(step.link ? [step.link] : []), ...(step.links ?? [])];

  return (
    <div
      className={cn(
        "hover-lift group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all",
        accent.border,
        completed && "border-datefix-green/30 bg-datefix-green/[0.03]",
      )}
    >
      {/* Top accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent to-transparent opacity-60",
          completed ? "bg-datefix-green/30" : accent.bg,
        )}
      />

      <div className="flex items-start gap-4">
        {/* Step number or check */}
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-black transition-all",
            completed
              ? "bg-datefix-green/15 text-datefix-green"
              : `${accent.bg} ${accent.text}`,
          )}
        >
          {completed ? <Check className="h-5 w-5" /> : step.id}
        </div>

        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="mb-2 flex items-center gap-2.5">
            <span className={completed ? "text-datefix-green" : accent.text}>
              {iconMap[step.icon] ?? <Sparkles className="h-5 w-5" />}
            </span>
            <h3
              className={cn(
                "text-base font-bold tracking-tight sm:text-lg",
                completed ? "text-datefix-green" : "text-foreground",
              )}
            >
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <p
            className={cn(
              "whitespace-pre-line text-sm leading-relaxed",
              completed ? "text-muted-foreground/60" : "text-muted-foreground",
            )}
          >
            {linkifyDatefix(step.description)}
          </p>

          {/* Code snippet */}
          {step.code && (
            <div className="relative mt-4 overflow-hidden rounded-xl bg-[#1a1530] ring-1 ring-white/5">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-datefix-pink/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-datefix-gold/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-datefix-green/60" />
                  </div>
                  <span className="text-[10px] font-medium tracking-widest text-white/30 uppercase">
                    terminal
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-white/50 transition-all hover:bg-white/10 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-datefix-green" />
                      <span className="text-datefix-green">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-sm text-datefix-green">
                <span className="mr-2 text-datefix-pink/60">$</span>
                <code>{step.code}</code>
              </pre>
            </div>
          )}

          {/* Action + Links row */}
          {(step.action || allLinks.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {step.action && onAction && (
                <button
                  onClick={() => {
                    playClick();
                    onAction(step.action!.actionId);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-datefix-pink px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  {step.action.label}
                </button>
              )}
              {allLinks.map((lnk) => (
                <a
                  key={lnk.url}
                  href={lnk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.02] ${accent.bg} ${accent.text}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {lnk.label}
                </a>
              ))}
            </div>
          )}

          {/* Done checkbox */}
          <button
            onClick={onToggle}
            className={cn(
              "mt-4 flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
              completed
                ? "bg-datefix-green/15 text-datefix-green"
                : "bg-accent text-muted-foreground hover:text-foreground",
            )}
          >
            {completed ? (
              <CircleCheck className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            {completed ? "Done!" : "Mark as done"}
          </button>
        </div>
      </div>
    </div>
  );
}

const DEMO_URL = "https://datefix-demo.vercel.app/";
const DATEFIX_PATTERN = /\b(datefix-demo|DateFix demo|DateFix Demo)\b/g;

/** Auto-link mentions of "datefix-demo" / "DateFix demo" to the live site */
function linkifyDatefix(text: string): React.ReactNode {
  const parts = text.split(DATEFIX_PATTERN);
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    DATEFIX_PATTERN.test(part) ? (
      <a
        key={i}
        href={DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-datefix-pink underline decoration-datefix-pink/30 underline-offset-2 transition-colors hover:text-datefix-blue hover:decoration-datefix-blue/50"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}
