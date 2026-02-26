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
  radius: number;
  status: "idle" | "correct" | "wrong" | "fading";
}

interface Bullet {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface LevelConfig {
  level: number;
  questions: number;
  asteroidCount: number;
  speed: number;
  timePerQuestion: number;
  label: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LEVELS: LevelConfig[] = [
  {
    level: 1,
    questions: 5,
    asteroidCount: 4,
    speed: 0.3,
    timePerQuestion: 15,
    label: "Cadet",
  },
  {
    level: 2,
    questions: 5,
    asteroidCount: 5,
    speed: 0.45,
    timePerQuestion: 12,
    label: "Pilot",
  },
  {
    level: 3,
    questions: 5,
    asteroidCount: 6,
    speed: 0.6,
    timePerQuestion: 10,
    label: "Commander",
  },
];

const ASTEROID_RAW_COLORS = [
  "#94b8f2", // datefix-blue
  "#d684cc", // datefix-pink
  "#e0a958", // datefix-gold
  "#a0c75d", // datefix-green
  "#b0c8f5", // lighter blue
  "#e0a0d8", // lighter pink
];

const BULLET_SPEED = 8;
const BULLET_RADIUS = 5;
const TURRET_HEIGHT = 40;
const TURRET_WIDTH = 8;

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

function buildQuestionQueue() {
  const shuffled = shuffle([...quizCards]);
  return shuffled.slice(0, 15);
}

function generateAsteroids(
  correctCard: (typeof quizCards)[number],
  count: number,
  areaW: number,
  areaH: number,
  speed: number,
): Asteroid[] {
  const distractorTexts = shuffle([...correctCard.distractors]).slice(
    0,
    count - 1,
  );

  const allOptions = shuffle([
    { text: correctCard.shortDef, cardId: correctCard.id, isCorrect: true },
    ...distractorTexts.map((text, i) => ({
      text,
      cardId: -(correctCard.id * 10 + i),
      isCorrect: false,
    })),
  ]);

  const padding = 80;
  const usableW = Math.max(areaW - padding * 2, 200);
  // Keep asteroids in top 75% of area (leave room for turret)
  const usableH = Math.max((areaH - padding * 2) * 0.75, 150);

  return allOptions.map((item, i) => {
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = speed * (0.6 + Math.random() * 0.8);
    // Size based on text length to avoid truncation
    const radius = Math.max(55, Math.min(80, 45 + item.text.length * 0.6));

    return {
      id: `asteroid-${item.cardId}-${i}-${Date.now()}`,
      text: item.text,
      cardId: item.cardId,
      isCorrect: item.isCorrect,
      x: padding + Math.random() * usableW,
      y: padding + Math.random() * usableH,
      dx: Math.cos(angle) * baseSpeed,
      dy: Math.sin(angle) * baseSpeed,
      color: ASTEROID_RAW_COLORS[i % ASTEROID_RAW_COLORS.length],
      radius,
      status: "idle" as const,
    };
  });
}

function getMultiplier(streak: number): number {
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

/** Check circle-circle overlap */
function circlesOverlap(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < r1 + r2;
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
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [turretAngle, setTurretAngle] = useState(-Math.PI / 2); // pointing up

  const areaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const bulletIdRef = useRef(0);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const handleAsteroidHitRef = useRef<(id: string) => void>(() => {});

  const stars = useStars(80);

  /* ---- derived ---- */
  const currentLevel = LEVELS[currentLevelIdx];
  const globalQuestionIdx = currentLevelIdx * 5 + questionIdx;
  const currentQuestion = questions[globalQuestionIdx];
  const multiplier = getMultiplier(streak);
  const totalQuestions = 15;

  // Keep ref in sync for bullet collision checks
  useEffect(() => {
    asteroidsRef.current = asteroids;
  }, [asteroids]);

  /* ---- turret position (bottom center of area) ---- */
  const getTurretPos = useCallback(() => {
    const area = areaRef.current;
    if (!area) return { x: 0, y: 0 };
    const rect = area.getBoundingClientRect();
    return { x: rect.width / 2, y: rect.height - 20 };
  }, []);

  /* ---- mouse tracking for turret aim ---- */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const area = areaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };

      const turret = getTurretPos();
      const angle = Math.atan2(my - turret.y, mx - turret.x);
      setTurretAngle(angle);
    },
    [getTurretPos],
  );

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
    setBullets([]);
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
    setBullets([]);
    lockedRef.current = false;
  }, []);

  /* ---- spawn on question change + start countdown ---- */
  useEffect(() => {
    if (gamePhase === "playing" && currentQuestion) {
      const t = setTimeout(() => spawnAsteroids(), 100);

      setTimeLeft(currentLevel.timePerQuestion);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(t);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [
    gamePhase,
    globalQuestionIdx,
    spawnAsteroids,
    currentQuestion,
    currentLevel,
  ]);

  /* ---- handle timeout ---- */
  const advanceRef = useRef<() => void>(() => {});

  /* ---- animation loop: asteroids + bullets + collisions ---- */
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

      // Move asteroids with wall bouncing + asteroid-asteroid collision
      setAsteroids((prev) => {
        const updated = prev.map((a) => {
          if (a.status !== "idle") return a;

          let nx = a.x + a.dx;
          let ny = a.y + a.dy;
          let ndx = a.dx;
          let ndy = a.dy;

          // Bounce off walls
          if (nx - a.radius < 0) {
            nx = a.radius;
            ndx = Math.abs(ndx);
          } else if (nx + a.radius > w) {
            nx = w - a.radius;
            ndx = -Math.abs(ndx);
          }
          if (ny - a.radius < 0) {
            ny = a.radius;
            ndy = Math.abs(ndy);
          } else if (ny + a.radius > h - 50) {
            // keep above turret area
            ny = h - 50 - a.radius;
            ndy = -Math.abs(ndy);
          }

          return { ...a, x: nx, y: ny, dx: ndx, dy: ndy };
        });

        // Asteroid-asteroid collisions
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i];
            const b = updated[j];
            if (a.status !== "idle" || b.status !== "idle") continue;

            const ddx = b.x - a.x;
            const ddy = b.y - a.y;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            const minDist = a.radius + b.radius;

            if (dist < minDist && dist > 0) {
              // Normalize
              const nx = ddx / dist;
              const ny = ddy / dist;

              // Relative velocity along collision normal
              const dvx = a.dx - b.dx;
              const dvy = a.dy - b.dy;
              const dvn = dvx * nx + dvy * ny;

              // Only resolve if moving toward each other
              if (dvn > 0) {
                updated[i] = {
                  ...a,
                  dx: a.dx - dvn * nx,
                  dy: a.dy - dvn * ny,
                };
                updated[j] = {
                  ...b,
                  dx: b.dx + dvn * nx,
                  dy: b.dy + dvn * ny,
                };
              }

              // Separate overlapping asteroids
              const overlap = minDist - dist;
              const sepX = (nx * overlap) / 2;
              const sepY = (ny * overlap) / 2;
              updated[i] = {
                ...updated[i],
                x: updated[i].x - sepX,
                y: updated[i].y - sepY,
              };
              updated[j] = {
                ...updated[j],
                x: updated[j].x + sepX,
                y: updated[j].y + sepY,
              };
            }
          }
        }

        return updated;
      });

      // Move bullets and check for hits against asteroid ref
      setBullets((prev) => {
        const remaining: Bullet[] = [];
        const hitAsteroidIds: string[] = [];
        const currentAsteroids = asteroidsRef.current;

        for (const b of prev) {
          const nx = b.x + b.dx;
          const ny = b.y + b.dy;

          // Off screen?
          if (nx < -10 || nx > w + 10 || ny < -10 || ny > h + 10) continue;

          // Check hit against asteroids
          let hit = false;
          for (const a of currentAsteroids) {
            if (a.status !== "idle") continue;
            if (circlesOverlap(nx, ny, BULLET_RADIUS, a.x, a.y, a.radius)) {
              hitAsteroidIds.push(a.id);
              hit = true;
              break;
            }
          }

          if (!hit) {
            remaining.push({ ...b, x: nx, y: ny });
          }
        }

        // Process hits outside of this setter
        if (hitAsteroidIds.length > 0) {
          // Use setTimeout to escape the setBullets updater
          setTimeout(() => {
            for (const id of hitAsteroidIds) {
              handleAsteroidHitRef.current(id);
            }
          }, 0);
        }

        return remaining;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase]);

  /* ---- advance to next question or next level ---- */
  const advanceQuestion = useCallback(() => {
    const nextQ = questionIdx + 1;

    if (nextQ >= currentLevel.questions) {
      if (currentLevelIdx < LEVELS.length - 1) {
        playCelebration();
        setGamePhase("levelComplete");
      } else {
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

  advanceRef.current = advanceQuestion;

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && gamePhase === "playing" && !lockedRef.current) {
      lockedRef.current = true;
      playUncheck();
      setStreak(0);
      setTotalAnswered((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev + POINTS_WRONG));

      setTimeout(() => {
        lockedRef.current = false;
        advanceRef.current();
      }, 400);
    }
  }, [timeLeft, gamePhase]);

  /* ---- proceed to next level ---- */
  const startNextLevel = useCallback(() => {
    playClick();
    setCurrentLevelIdx((prev) => prev + 1);
    setQuestionIdx(0);
    setGamePhase("playing");
  }, []);

  /* ---- handle asteroid hit (from bullet or click) ---- */
  const handleAsteroidHit = useCallback(
    (asteroidId: string) => {
      if (lockedRef.current) return;
      if (gamePhase !== "playing") return;

      setAsteroids((prev) => {
        const asteroid = prev.find((a) => a.id === asteroidId);
        if (!asteroid || asteroid.status !== "idle") return prev;

        lockedRef.current = true;

        if (asteroid.isCorrect) {
          if (timerRef.current) clearInterval(timerRef.current);
          playCheckOff();
          const points = Math.round(POINTS_CORRECT * multiplier);
          setScore((s) => s + points);
          setStreak((s) => s + 1);
          setTotalCorrect((s) => s + 1);
          setTotalAnswered((s) => s + 1);

          setTimeout(() => {
            setAsteroids((p) =>
              p.map((a) =>
                a.id === asteroidId ? { ...a, status: "fading" as const } : a,
              ),
            );
          }, 300);

          setTimeout(() => {
            lockedRef.current = false;
            advanceRef.current();
          }, 600);

          return prev.map((a) =>
            a.id === asteroidId ? { ...a, status: "correct" as const } : a,
          );
        } else {
          playUncheck();
          setScore((s) => Math.max(0, s + POINTS_WRONG));
          setStreak(0);
          setTotalAnswered((s) => s + 1);

          setTimeout(() => {
            setAsteroids((p) =>
              p.map((a) =>
                a.id === asteroidId ? { ...a, status: "idle" as const } : a,
              ),
            );
            lockedRef.current = false;
          }, 500);

          return prev.map((a) =>
            a.id === asteroidId ? { ...a, status: "wrong" as const } : a,
          );
        }
      });
    },
    [gamePhase, multiplier],
  );

  // Keep ref in sync for animation loop
  handleAsteroidHitRef.current = handleAsteroidHit;

  /* ---- fire bullet from turret ---- */
  const handleFire = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (lockedRef.current || gamePhase !== "playing") return;

      const area = areaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const turret = getTurretPos();
      const angle = Math.atan2(my - turret.y, mx - turret.x);

      setBullets((prev) => [
        ...prev,
        {
          id: `bullet-${++bulletIdRef.current}`,
          x: turret.x,
          y: turret.y - 20,
          dx: Math.cos(angle) * BULLET_SPEED,
          dy: Math.sin(angle) * BULLET_SPEED,
        },
      ]);
    },
    [gamePhase, getTurretPos],
  );

  /* ---- also allow direct clicking ---- */
  const handleAsteroidClick = useCallback(
    (asteroidId: string) => {
      handleAsteroidHit(asteroidId);
    },
    [handleAsteroidHit],
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
    setBullets([]);
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

      {/* Header */}
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
            Shoot the correct definition before time runs out!
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
              Aim your turret and shoot the asteroid with the correct
              definition. Click to fire! 3 levels, 15 questions.
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
          {/* HUD */}
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card px-4 py-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-datefix-gold" />
              <span className="text-xs font-bold text-foreground">
                Lv.{currentLevel.level}{" "}
                <span className="text-muted-foreground">
                  {currentLevel.label}
                </span>
              </span>
            </div>

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

            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-datefix-blue" />
              <span className="font-mono text-lg font-extrabold tabular-nums text-foreground">
                {score}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="relative">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-linear",
                  timeLeft <= 3
                    ? "bg-red-500"
                    : timeLeft <= 5
                      ? "bg-datefix-gold"
                      : "bg-gradient-to-r from-datefix-blue via-datefix-pink to-datefix-gold",
                )}
                style={{
                  width: `${(timeLeft / currentLevel.timePerQuestion) * 100}%`,
                }}
              />
            </div>
            <span
              className={cn(
                "absolute -top-0.5 right-0 font-mono text-sm font-extrabold tabular-nums",
                timeLeft <= 3
                  ? "animate-pulse text-red-400"
                  : timeLeft <= 5
                    ? "text-datefix-gold"
                    : "text-muted-foreground",
              )}
            >
              {timeLeft}
            </span>
          </div>

          {/* Prompt */}
          <div className="rounded-2xl border border-datefix-pink/20 bg-gradient-to-r from-datefix-pink/5 to-datefix-blue/5 px-5 py-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-datefix-pink/70">
              Shoot the correct definition
            </p>
            <p className="text-center text-xl font-extrabold leading-relaxed text-foreground">
              {currentQuestion.term}
            </p>
          </div>

          {/* Game area */}
          <div
            ref={areaRef}
            className="relative min-h-[500px] overflow-hidden rounded-2xl border border-white/5 bg-[#0c0a17]"
            style={{ cursor: "crosshair" }}
            onMouseMove={handleMouseMove}
            onClick={handleFire}
          >
            {/* Stars */}
            {stars.map((star) => (
              <div
                key={star.id}
                className="animate-sparkle absolute rounded-full bg-white"
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

            {/* Bullets */}
            {bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="absolute rounded-full bg-datefix-gold shadow-[0_0_12px_rgba(224,169,88,0.8)]"
                style={{
                  left: bullet.x - BULLET_RADIUS,
                  top: bullet.y - BULLET_RADIUS,
                  width: BULLET_RADIUS * 2,
                  height: BULLET_RADIUS * 2,
                }}
              />
            ))}

            {/* Asteroids */}
            {asteroids.map((asteroid) => {
              const isCorrect = asteroid.status === "correct";
              const isWrong = asteroid.status === "wrong";
              const isFading = asteroid.status === "fading";
              const diameter = asteroid.radius * 2;

              return (
                <button
                  key={asteroid.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAsteroidClick(asteroid.id);
                  }}
                  disabled={asteroid.status !== "idle"}
                  className={cn(
                    "absolute flex cursor-pointer items-center justify-center rounded-full border-2 p-3 text-center font-bold shadow-lg transition-all duration-300",
                    asteroid.status === "idle" &&
                      "hover:scale-105 hover:brightness-110 active:scale-95",
                    isCorrect &&
                      "scale-110 border-datefix-green shadow-[0_0_30px_rgba(160,199,93,0.6)]",
                    isWrong &&
                      "animate-wiggle border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]",
                    isFading && "scale-0 opacity-0",
                  )}
                  style={{
                    left: asteroid.x - asteroid.radius,
                    top: asteroid.y - asteroid.radius,
                    width: diameter,
                    height: diameter,
                    backgroundColor: isCorrect
                      ? "#a0c75d"
                      : isWrong
                        ? "rgba(239,68,68,0.8)"
                        : asteroid.color,
                    borderColor: isCorrect
                      ? "#a0c75d"
                      : isWrong
                        ? "#ef4444"
                        : `${asteroid.color}99`,
                    transition: isFading
                      ? "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                      : isCorrect || isWrong
                        ? "all 0.2s ease"
                        : undefined,
                  }}
                >
                  <span
                    className={cn(
                      "text-[10px] font-bold leading-tight sm:text-[11px]",
                      isCorrect || isFading || isWrong
                        ? "text-white"
                        : "text-[#1d1644]",
                    )}
                  >
                    {asteroid.text}
                  </span>
                </button>
              );
            })}

            {/* Turret */}
            <div
              className="pointer-events-none absolute"
              style={{
                left: "50%",
                bottom: 8,
                transform: "translateX(-50%)",
              }}
            >
              {/* Turret base */}
              <div className="relative flex flex-col items-center">
                {/* Barrel */}
                <div
                  className="absolute origin-bottom rounded-full bg-gradient-to-t from-white/60 to-white/20"
                  style={{
                    width: TURRET_WIDTH,
                    height: TURRET_HEIGHT,
                    bottom: 12,
                    left: `calc(50% - ${TURRET_WIDTH / 2}px)`,
                    transform: `rotate(${turretAngle + Math.PI / 2}rad)`,
                    transformOrigin: "bottom center",
                  }}
                />
                {/* Base dome */}
                <div className="h-6 w-10 rounded-t-full bg-gradient-to-t from-white/30 to-white/50" />
                {/* Platform */}
                <div className="h-2 w-14 rounded-sm bg-white/20" />
              </div>
            </div>

            {/* Q counter overlay */}
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
