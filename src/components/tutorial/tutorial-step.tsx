"use client";

import { useState } from "react";
import { TutorialStep as TutorialStepType } from "@/types";
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

// Rotating accent colors per step — datefix spice palette
const stepAccents = [
  {
    bg: "bg-datefix-blue/10",
    text: "text-datefix-blue",
    border: "border-datefix-blue/20",
    glow: "hover:shadow-datefix-blue/10",
  },
  {
    bg: "bg-datefix-pink/10",
    text: "text-datefix-pink",
    border: "border-datefix-pink/20",
    glow: "hover:shadow-datefix-pink/10",
  },
  {
    bg: "bg-datefix-gold/10",
    text: "text-datefix-gold",
    border: "border-datefix-gold/20",
    glow: "hover:shadow-datefix-gold/10",
  },
  {
    bg: "bg-datefix-green/10",
    text: "text-datefix-green",
    border: "border-datefix-green/20",
    glow: "hover:shadow-datefix-green/10",
  },
  {
    bg: "bg-datefix-blue/10",
    text: "text-datefix-blue",
    border: "border-datefix-blue/20",
    glow: "hover:shadow-datefix-blue/10",
  },
];

interface TutorialStepProps {
  step: TutorialStepType;
}

export function TutorialStep({ step }: TutorialStepProps) {
  const [copied, setCopied] = useState(false);
  const accent = stepAccents[(step.id - 1) % stepAccents.length];

  const handleCopy = async () => {
    if (!step.code) return;
    await navigator.clipboard.writeText(step.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`hover-lift group relative overflow-hidden rounded-2xl border bg-card p-5 ${accent.border}`}
    >
      {/* Subtle gradient accent at top */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent ${accent.bg} to-transparent opacity-60`}
      />

      <div className="flex items-start gap-4">
        {/* Step number — fun rounded square */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.bg} text-base font-black ${accent.text}`}
        >
          {step.id}
        </div>

        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="mb-2 flex items-center gap-2.5">
            <span className={accent.text}>
              {iconMap[step.icon] ?? <Sparkles className="h-5 w-5" />}
            </span>
            <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>

          {/* Code snippet — dark terminal with personality */}
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

          {/* Link — pill style */}
          {step.link && (
            <a
              href={step.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${accent.bg} ${accent.text} hover:scale-[1.02]`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {step.link.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
