"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { quizCards } from "@/data/quiz-cards";
import {
  playClick,
  playCheckOff,
  playUncheck,
  playCelebration,
} from "@/lib/sounds";
import { Confetti } from "@/components/confetti";
import { cn } from "@/lib/utils";
import { ArrowLeft, RotateCcw, Flame, Zap, Target, Star } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BlastGameProps {
  onBack: () => void;
}

interface Asteroid {
  id: string;
  text: string;
  cardId: number;
  isCorrect: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
  status: "idle" | "correct" | "wrong" | "fading";
}

interface LevelConfig {
  level: number;
  questions: number;
  asteroidCount: number;
  speed: number;
  label: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LEVELS: LevelConfig[] = [
  { level: 1, questions: 5, asteroidCount: 4, speed: 0.4, label: "Cadet" },
  { level: 2, questions: 5, asteroidCount: 5, speed: 0.6, label: "Pilot" },
  { level: 3, questions: 5, asteroidCount: 6, speed: 0.85, label: "Commander" },
];

const ASTEROID_COLORS = [
  "bg-datefix-blue",
  "bg-datefix-pink",
  "bg-datefix-gold",
  "bg-datefix-green",
  "bg-datefix-blue/80",
  "bg-datefix-pink/80",
];

const ASTEROID_BORDER_COLORS = [
  "border-datefix-blue/60",
  "border-datefix-pink/60",
  "border-datefix-gold/60",
  "border-datefix-green/60",
  "border-datefix-blue/40",
  "border-datefix-pink/40",
];

const POINTS_CORRECT = 5;
const POINTS_WRONG = -2;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build the full question queue for all 3 levels */
function buildQuestionQueue() {
  const shuffled = shuffle([...quizCards]);
  return shuffled.slice(0, 15);
}

/** Generate asteroids for a single question */
function generateAsteroids(
  correctCard: (typeof quizCards)[number],
  count: number,
  areaW: number,
  areaH: number,
  speed: number,
): Asteroid[] {
  // Pick wrong answers from other cards
  const wrongCards = shuffle(
    quizCards.filter((c) => c.id !== correctCard.id),
  ).slice(0, count - 1);

  const allCards = shuffle([
    { card: correctCard, isCorrect: true },
    ...wrongCards.map((c) => ({ card: c, isCorrect: false })),
  ]);

  const padding = 60;
  const usableW = Math.max(areaW - padding * 2, 200);
  const usableH = Math.max(areaH - padding * 2, 200);

  return allCards.map((item, i) => {
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = speed * (0.6 + Math.random() * 0.8);

    return {
      id: `asteroid-${item.card.id}-${i}-${Date.now()}`,
      text: item.card.question,
      cardId: item.card.id,
      isCorrect: item.isCorrect,
      x: padding + Math.random() * usableW,
      y: padding + Math.random() * usableH,
      dx: Math.cos(angle) * baseSpeed,
      dy: Math.sin(angle) * baseSpeed,
      color: ASTEROID_COLORS[i % ASTEROID_COLORS.length],
      size: 80 + Math.random() * 20,
      status: "idle" as const,
    };
  });
}

/** Get streak multiplier */
function getMultiplier(streak: number): number {
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

/* ------------------------------------------------------------------ */
/*  Stars background                                                   */
/* ------------------------------------------------------------------ */

function useStars(count: number) {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      animDelay: Math.random() * 4,
    }));
  }, [count]);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BlastGame({ onBack }: BlastGameProps) {
  /* ---- game state ---- */
  const [gamePhase, setGamePhase] = useState<
    "ready" | "playing" | "levelComplete" | "gameOver"
  >("ready");
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const [questions] = useState(() => buildQuestionQueue());
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);

  const areaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lockedRef = useRef(false);

  const stars = useStars(80);

  /* ---- derived ---- */
  const currentLevel = LEVELS[currentLevelIdx];
  const globalQuestionIdx = currentLevelIdx * 5 + questionIdx;
  const currentQuestion = questions[globalQuestionIdx];
  const multiplier = getMultiplier(streak);
  const totalQuestions = 15;

  /* ---- spawn asteroids for current question ---- */
  const spawnAsteroids = useCallback(() => {
    if (!currentQuestion) return;
    const area = areaRef.current;
    if (!area) return;

    const rect = area.getBoundingClientRect();
    const newAsteroids = generateAsteroids(
      currentQuestion,
      currentLevel.asteroidCount,
      rect.width,
      rect.height,
      currentLevel.speed,
    );
    setAsteroids(newAsteroids);
  }, [currentQuestion, currentLevel]);

  /* ---- start game ---- */
  const startGame = useCallback(() => {
    playClick();
    setGamePhase("playing");
    setCurrentLevelIdx(0);
    setQuestionIdx(0);
    setScore(0);
    setStreak(0);
    setTotalCorrect(0);
    setTotalAnswered(0);
    setShowConfetti(false);
    lockedRef.current = false;
  }, []);

  /* ---- spawn on question change ---- */
  useEffect(() => {
    if (gamePhase === "playing" && currentQuestion) {
      // Small delay so the DOM has rendered
      const t = setTimeout(() => spawnAsteroids(), 100);
      return () => clearTimeout(t);
    }
  }, [gamePhase, globalQuestionIdx, spawnAsteroids, currentQuestion]);

  /* ---- animation loop: move asteroids ---- */
  useEffect(() => {
    if (gamePhase !== "playing") return;

    const animate = () => {
      const area = areaRef.current;
      if (!area) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = area.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      setAsteroids((prev) =>
        prev.map((a) => {
          if (a.status !== "idle") return a;

          let nx = a.x + a.dx;
          let ny = a.y + a.dy;
          let ndx = a.dx;
          let ndy = a.dy;

          // Bounce off walls
          const halfSize = a.size / 2;
          if (nx - halfSize < 0) {
            nx = halfSize;
            ndx = Math.abs(ndx);
          } else if (nx + halfSize > w) {
            nx = w - halfSize;
            ndx = -Math.abs(ndx);
          }
          if (ny - halfSize < 0) {
            ny = halfSize;
            ndy = Math.abs(ndy);
          } else if (ny + halfSize > h) {
            ny = h - halfSize;
            ndy = -Math.abs(ndy);
          }

          return { ...a, x: nx, y: ny, dx: ndx, dy: ndy };
        }),
      );

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gamePhase]);

  /* ---- advance to next question or next level ---- */
  const advanceQuestion = useCallback(() => {
    const nextQ = questionIdx + 1;

    if (nextQ >= currentLevel.questions) {
      // Level complete
      if (currentLevelIdx < LEVELS.length - 1) {
        playCelebration();
        setGamePhase("levelComplete");
      } else {
        // Game over
        playCelebration();
        setGamePhase("gameOver");
        if (totalCorrect + 1 === totalQuestions) {
          setShowConfetti(true);
        }
      }
    } else {
      setQuestionIdx(nextQ);
    }
  }, [questionIdx, currentLevel, currentLevelIdx, totalCorrect]);

  /* ---- proceed to next level ---- */
  const startNextLevel = useCallback(() => {
    playClick();
    setCurrentLevelIdx((prev) => prev + 1);
    setQuestionIdx(0);
    setGamePhase("playing");
  }, []);

  /* ---- handle asteroid click ---- */
  const handleAsteroidClick = useCallback(
    (asteroidId: string) => {
      if (lockedRef.current) return;
      if (gamePhase !== "playing") return;

      const asteroid = asteroids.find((a) => a.id === asteroidId);
      if (!asteroid || asteroid.status !== "idle") return;

      lockedRef.current = true;

      if (asteroid.isCorrect) {
        // Correct!
        playCheckOff();
        const points = Math.round(POINTS_CORRECT * multiplier);
        setScore((prev) => prev + points);
        setStreak((prev) => prev + 1);
        setTotalCorrect((prev) => prev + 1);
        setTotalAnswered((prev) => prev + 1);

        // Mark asteroid as correct, then fade
        setAsteroids((prev) =>
          prev.map((a) =>
            a.id === asteroidId ? { ...a, status: "correct" as const } : a,
          ),
        );

        setTimeout(() => {
          setAsteroids((prev) =>
            prev.map((a) =>
              a.id === asteroidId ? { ...a, status: "fading" as const } : a,
            ),
          );
        }, 300);

        setTimeout(() => {
          lockedRef.current = false;
          advanceQuestion();
        }, 600);
      } else {
        // Wrong
        playUncheck();
        setScore((prev) => Math.max(0, prev + POINTS_WRONG));
        setStreak(0);
        setTotalAnswered((prev) => prev + 1);

        setAsteroids((prev) =>
          prev.map((a) =>
            a.id === asteroidId ? { ...a, status: "wrong" as const } : a,
          ),
        );

        setTimeout(() => {
          setAsteroids((prev) =>
            prev.map((a) =>
              a.id === asteroidId ? { ...a, status: "idle" as const } : a,
            ),
          );
          lockedRef.current = false;
        }, 500);
      }
    },
    [asteroids, gamePhase, multiplier, advanceQuestion],
  );

  /* ---- play again ---- */
  const handlePlayAgain = useCallback(() => {
    playClick();
    setGamePhase("ready");
    setCurrentLevelIdx(0);
    setQuestionIdx(0);
    setScore(0);
    setStreak(0);
    setTotalCorrect(0);
    setTotalAnswered(0);
    setShowConfetti(false);
    setAsteroids([]);
    lockedRef.current = false;
  }, []);

  /* ---- accuracy ---- */
  const accuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const isPerfect =
    totalCorrect === totalQuestions && totalAnswered === totalQuestions;

  /* ---- render ---- */
  return (
    <div className="space-y-4">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Header: back + title */}
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
            Blast
          </h2>
          <p className="text-xs text-muted-foreground">
            Shoot the matching term before it escapes!
          </p>
        </div>
      </div>

      {/* ============ READY SCREEN ============ */}
      {gamePhase === "ready" && (
        <div className="animate-bounce-in space-y-6 rounded-2xl border border-datefix-blue/20 bg-[#0c0a17] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-datefix-blue/10">
            <Target className="h-10 w-10 text-datefix-blue" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">
              Ready to Blast?
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">
              A definition appears at the top. Click the asteroid with the
              matching term. 3 levels, 15 questions. Go!
            </p>
          </div>
          <div className="flex justify-center gap-3">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.level}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center"
              >
                <p className="text-xs font-bold text-datefix-gold">
                  Lv.{lvl.level}
                </p>
                <p className="text-[10px] text-white/50">{lvl.label}</p>
                <p className="text-[10px] text-white/40">
                  {lvl.asteroidCount} asteroids
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={startGame}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-datefix-blue px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
          >
            <Zap className="h-4 w-4" />
            Launch
          </button>
        </div>
      )}

      {/* ============ PLAYING ============ */}
      {gamePhase === "playing" && currentQuestion && (
        <>
          {/* HUD: score, level, streak */}
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card px-4 py-3">
            {/* Level indicator */}
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-datefix-gold" />
              <span className="text-xs font-bold text-foreground">
                Lv.{currentLevel.level}{" "}
                <span className="text-muted-foreground">
                  {currentLevel.label}
                </span>
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5">
              <Flame
                className={cn(
                  "h-4 w-4 transition-colors",
                  streak >= 5
                    ? "text-red-400"
                    : streak >= 3
                      ? "text-datefix-gold"
                      : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs font-bold",
                  streak >= 3 ? "text-datefix-gold" : "text-muted-foreground",
                )}
              >
                {streak} streak
                {multiplier > 1 && (
                  <span className="ml-1 text-datefix-pink">{multiplier}x</span>
                )}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-datefix-blue" />
              <span className="font-mono text-lg font-extrabold tabular-nums text-foreground">
                {score}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-datefix-blue via-datefix-pink to-datefix-gold transition-all duration-500"
              style={{
                width: `${(globalQuestionIdx / totalQuestions) * 100}%`,
              }}
            />
          </div>

          {/* Prompt bar: shows definition */}
          <div className="rounded-2xl border border-datefix-pink/20 bg-gradient-to-r from-datefix-pink/5 to-datefix-blue/5 px-5 py-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-datefix-pink/70">
              Find the matching term
            </p>
            <p className="text-sm font-semibold leading-relaxed text-foreground">
              {currentQuestion.answer}
            </p>
          </div>

          {/* Game area */}
          <div
            ref={areaRef}
            className="relative min-h-[500px] overflow-hidden rounded-2xl border border-white/5 bg-[#0c0a17]"
            style={{ cursor: "crosshair" }}
          >
            {/* Stars */}
            {stars.map((star) => (
              <div
                key={star.id}
                className="absolute rounded-full bg-white animate-sparkle"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                  animationDelay: `${star.animDelay}s`,
                  animationDuration: `${3 + star.animDelay}s`,
                }}
              />
            ))}

            {/* Asteroids */}
            {asteroids.map((asteroid) => {
              const isCorrect = asteroid.status === "correct";
              const isWrong = asteroid.status === "wrong";
              const isFading = asteroid.status === "fading";

              return (
                <button
                  key={asteroid.id}
                  onClick={() => handleAsteroidClick(asteroid.id)}
                  disabled={asteroid.status !== "idle"}
                  className={cn(
                    "absolute flex cursor-pointer items-center justify-center rounded-full border-2 p-2 text-center font-bold shadow-lg transition-all duration-300",
                    asteroid.status === "idle" &&
                      `${asteroid.color} ${ASTEROID_BORDER_COLORS[asteroids.indexOf(asteroid) % ASTEROID_BORDER_COLORS.length]} hover:scale-110 hover:brightness-125 active:scale-95`,
                    isCorrect &&
                      "scale-125 border-datefix-green bg-datefix-green shadow-[0_0_30px_rgba(160,199,93,0.6)]",
                    isWrong &&
                      "animate-wiggle border-red-500 bg-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.5)]",
                    isFading &&
                      "scale-0 border-datefix-green/0 bg-datefix-green/0 opacity-0",
                  )}
                  style={{
                    left: asteroid.x - asteroid.size / 2,
                    top: asteroid.y - asteroid.size / 2,
                    width: asteroid.size,
                    height: asteroid.size,
                    transition: isFading
                      ? "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                      : isCorrect || isWrong
                        ? "all 0.2s ease"
                        : undefined,
                  }}
                >
                  <span
                    className={cn(
                      "line-clamp-3 text-[10px] leading-tight",
                      isCorrect || isFading
                        ? "text-white"
                        : isWrong
                          ? "text-white"
                          : "text-white/90",
                    )}
                  >
                    {asteroid.text}
                  </span>
                </button>
              );
            })}

            {/* Level label overlay */}
            <div className="pointer-events-none absolute bottom-3 left-3">
              <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-bold text-white/30">
                Q{questionIdx + 1}/{currentLevel.questions}
              </span>
            </div>
          </div>
        </>
      )}

      {/* ============ LEVEL COMPLETE ============ */}
      {gamePhase === "levelComplete" && (
        <div className="animate-bounce-in space-y-5 rounded-2xl border border-datefix-gold/30 bg-gradient-to-br from-datefix-gold/5 via-datefix-pink/5 to-datefix-blue/5 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-datefix-gold/10">
            <Star className="h-8 w-8 text-datefix-gold" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-foreground">
              Level {currentLevel.level} Complete!
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentLevel.label} rank cleared. Score so far:{" "}
              <span className="font-bold text-datefix-blue">{score}</span>
            </p>
          </div>
          <div className="flex justify-center gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-datefix-green">
                {totalCorrect}
              </p>
              <p className="text-[10px] text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-datefix-pink">
                {accuracy}%
              </p>
              <p className="text-[10px] text-muted-foreground">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-datefix-gold">
                {streak}
              </p>
              <p className="text-[10px] text-muted-foreground">Streak</p>
            </div>
          </div>
          <button
            onClick={startNextLevel}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-datefix-blue px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
          >
            <Zap className="h-4 w-4" />
            Level {currentLevelIdx + 2}
          </button>
        </div>
      )}

      {/* ============ GAME OVER ============ */}
      {gamePhase === "gameOver" && (
        <div className="animate-bounce-in space-y-5 rounded-2xl border border-datefix-blue/20 bg-[#0c0a17] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-datefix-blue/10">
            <Target className="h-10 w-10 text-datefix-blue" />
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-white">
              Mission Complete
            </h3>
            <p className="mt-1 text-sm text-white/50">
              {isPerfect
                ? "Perfect score! You nailed every single one!"
                : "Great run, Commander. Review and try again!"}
            </p>
          </div>

          <div className="flex justify-center gap-6">
            <div>
              <p className="font-mono text-3xl font-extrabold text-datefix-blue">
                {score}
              </p>
              <p className="text-[10px] text-white/40">Points</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-extrabold text-datefix-green">
                {accuracy}%
              </p>
              <p className="text-[10px] text-white/40">Accuracy</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-extrabold text-datefix-gold">
                {totalCorrect}
                <span className="text-lg text-white/30">/{totalQuestions}</span>
              </p>
              <p className="text-[10px] text-white/40">Correct</p>
            </div>
          </div>

          {isPerfect && (
            <div className="rounded-xl border border-datefix-gold/20 bg-datefix-gold/5 px-4 py-3">
              <p className="text-sm font-bold text-datefix-gold">
                Perfect Game! All 15 correct!
              </p>
            </div>
          )}

          <button
            onClick={handlePlayAgain}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-datefix-blue px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
