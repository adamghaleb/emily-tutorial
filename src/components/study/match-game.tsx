"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { quizCards } from "@/data/quiz-cards";
import {
  playClick,
  playFlip,
  playCheckOff,
  playCelebration,
} from "@/lib/sounds";
import { Confetti } from "@/components/confetti";
import { ArrowLeft, RotateCcw, Timer, Zap } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Tile {
  /** Unique key for this tile instance */
  uid: string;
  /** The quiz-card id this tile belongs to */
  cardId: number;
  /** "question" or "answer" — determines which text shows */
  side: "question" | "answer";
  /** The visible text on the tile */
  text: string;
}

type TileStatus = "idle" | "selected" | "matched" | "wrong";

interface MatchGameProps {
  onBack: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Fisher-Yates shuffle (immutable) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `n` random items from `arr` */
function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

const PAIR_COUNT = 8;

function buildTiles(): Tile[] {
  const cards = pickRandom(quizCards, PAIR_COUNT);
  const tiles: Tile[] = [];
  for (const card of cards) {
    tiles.push({
      uid: `q-${card.id}`,
      cardId: card.id,
      side: "question",
      text: card.question,
    });
    tiles.push({
      uid: `a-${card.id}`,
      cardId: card.id,
      side: "answer",
      text: card.answer,
    });
  }
  return shuffle(tiles);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MatchGame({ onBack }: MatchGameProps) {
  /* ---- game state ---- */
  const [tiles, setTiles] = useState<Tile[]>(() => buildTiles());
  const [statuses, setStatuses] = useState<Record<string, TileStatus>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  /* ---- timer ---- */
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Start the timer on mount
  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 50);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tiles]); // restart whenever tiles change (new game)

  // Stop the timer when finished
  useEffect(() => {
    if (finished && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [finished]);

  const formattedTime = useMemo(() => {
    const seconds = elapsed / 1000;
    return seconds.toFixed(1);
  }, [elapsed]);

  /* ---- lock flag to prevent clicks during wrong-flash ---- */
  const lockedRef = useRef(false);

  /* ---- tile click handler ---- */
  const handleTileClick = useCallback(
    (uid: string) => {
      if (lockedRef.current) return;
      if (finished) return;

      const currentStatus = statuses[uid];
      if (currentStatus === "matched" || currentStatus === "selected") return;

      playFlip();

      // Nothing selected yet — select this tile
      if (!selected) {
        setSelected(uid);
        setStatuses((prev) => ({ ...prev, [uid]: "selected" }));
        return;
      }

      // Same tile clicked again — deselect
      if (selected === uid) {
        setSelected(null);
        setStatuses((prev) => ({ ...prev, [uid]: "idle" }));
        return;
      }

      // Second tile selected — check match
      const first = tiles.find((t) => t.uid === selected)!;
      const second = tiles.find((t) => t.uid === uid)!;

      if (first.cardId === second.cardId && first.side !== second.side) {
        // Correct match!
        setStatuses((prev) => ({
          ...prev,
          [selected]: "matched",
          [uid]: "matched",
        }));
        setSelected(null);
        playCheckOff();

        const newCount = matchedCount + 1;
        setMatchedCount(newCount);

        if (newCount === PAIR_COUNT) {
          setFinished(true);
          playCelebration();
          setShowConfetti(true);
        }
      } else {
        // Wrong match
        lockedRef.current = true;
        setStatuses((prev) => ({
          ...prev,
          [selected]: "wrong",
          [uid]: "wrong",
        }));
        playClick();

        const prevSelected = selected;
        setSelected(null);

        setTimeout(() => {
          setStatuses((prev) => ({
            ...prev,
            [prevSelected]: "idle",
            [uid]: "idle",
          }));
          lockedRef.current = false;
        }, 500);
      }
    },
    [selected, statuses, tiles, matchedCount, finished],
  );

  /* ---- play again ---- */
  const handlePlayAgain = useCallback(() => {
    playClick();
    const newTiles = buildTiles();
    setTiles(newTiles);
    setStatuses({});
    setSelected(null);
    setMatchedCount(0);
    setFinished(false);
    setShowConfetti(false);
    setElapsed(0);
    startTimeRef.current = Date.now();
    lockedRef.current = false;
  }, []);

  /* ---- render ---- */
  return (
    <div className="space-y-5">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Header row: back + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border/50 bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Match
          </h2>
          <p className="text-xs text-muted-foreground">
            Find all matching pairs as fast as you can!
          </p>
        </div>
      </div>

      {/* Stats bar: timer + matched counter */}
      <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-datefix-pink" />
          <span className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
            {formattedTime}
            <span className="ml-0.5 text-sm font-medium text-muted-foreground">
              s
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-datefix-gold" />
          <span className="text-sm font-bold text-foreground">
            {matchedCount}{" "}
            <span className="text-muted-foreground">/ {PAIR_COUNT}</span>
          </span>
        </div>
      </div>

      {/* 4x4 tile grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {tiles.map((tile) => {
          const status = statuses[tile.uid] ?? "idle";
          const isMatched = status === "matched";
          const isSelected = status === "selected";
          const isWrong = status === "wrong";

          return (
            <button
              key={tile.uid}
              onClick={() => handleTileClick(tile.uid)}
              disabled={isMatched}
              className={`
                relative flex min-h-[5rem] cursor-pointer items-center justify-center rounded-xl border p-2 text-center transition-all duration-200 sm:min-h-[6rem] sm:p-3
                ${
                  isMatched
                    ? "pointer-events-none scale-90 border-datefix-green/40 bg-datefix-green/10 opacity-0"
                    : isSelected
                      ? "scale-[1.03] border-datefix-blue ring-2 ring-datefix-blue/50 bg-card shadow-lg"
                      : isWrong
                        ? "border-red-500/60 bg-red-500/10 ring-2 ring-red-500/40"
                        : "border-border/50 bg-card hover:border-datefix-blue/30 hover:shadow-md"
                }
              `}
            >
              <span
                className={`
                  text-[11px] leading-tight font-medium sm:text-xs
                  ${
                    isMatched
                      ? "text-datefix-green"
                      : isSelected
                        ? "text-datefix-blue"
                        : isWrong
                          ? "text-red-400"
                          : "text-foreground"
                  }
                `}
              >
                {tile.text}
              </span>

              {/* Side indicator */}
              <span
                className={`
                  absolute bottom-1 right-1.5 text-[9px] font-bold uppercase tracking-wider
                  ${
                    isMatched
                      ? "text-datefix-green/50"
                      : tile.side === "question"
                        ? "text-datefix-pink/40"
                        : "text-datefix-blue/40"
                  }
                `}
              >
                {tile.side === "question" ? "Q" : "A"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Celebration card */}
      {finished && (
        <div className="animate-bounce-in space-y-4 rounded-2xl border border-datefix-gold/30 bg-gradient-to-r from-datefix-gold/5 via-datefix-pink/5 to-datefix-blue/5 p-6 text-center">
          <p className="text-3xl font-extrabold text-foreground">
            {formattedTime}s
          </p>
          <p className="text-sm text-muted-foreground">
            All {PAIR_COUNT} pairs matched! Can you beat your time?
          </p>
          <button
            onClick={handlePlayAgain}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-datefix-blue px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      )}

      {/* Floating play-again when not finished */}
      {!finished && (
        <div className="flex justify-center">
          <button
            onClick={handlePlayAgain}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Cards
          </button>
        </div>
      )}
    </div>
  );
}
