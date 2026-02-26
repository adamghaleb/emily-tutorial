"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { playStart } from "@/lib/sounds";
import {
  Sparkles,
  Heart,
  Rocket,
  Star,
  Zap,
  PartyPopper,
  ExternalLink,
} from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

/** Sparkle particle state */
interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const SPARKLE_COLORS = [
  "rgba(148, 184, 242, 0.8)", // blue
  "rgba(214, 132, 204, 0.8)", // pink
  "rgba(224, 169, 88, 0.8)", // gold
  "rgba(160, 199, 93, 0.8)", // green
  "rgba(255, 255, 255, 0.6)", // white
];

let sparkleId = 0;

export function Hero({ onStart }: HeroProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [fading, setFading] = useState(false);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const lastSparkleTime = useRef(0);

  // Clean up expired sparkles
  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      setSparkles((prev) => prev.slice(-20));
    }, 800);
    return () => clearTimeout(timer);
  }, [sparkles]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;

    if (blobRef.current) {
      blobRef.current.style.transform = `translate(${dx * 20}px, ${dy * 15}px)`;
    }
    if (iconRef.current) {
      iconRef.current.style.transform = `translate(${dx * -12}px, ${dy * -10}px)`;
    }

    // Throttle sparkle creation to every 50ms
    const now = Date.now();
    if (now - lastSparkleTime.current < 50) return;
    lastSparkleTime.current = now;

    const particle: SparkleParticle = {
      id: sparkleId++,
      x: clientX,
      y: clientY,
      size: Math.random() * 6 + 3,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    };

    setSparkles((prev) => [...prev.slice(-30), particle]);
  }, []);

  const handleStart = () => {
    playStart();
    setFading(true);
    setTimeout(onStart, 500);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {/* Rich layered background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1d1644] via-[#120e2e] to-[#0c0a17]" />

      {/* Mouse sparkle particles */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="animate-sparkle-trail absolute rounded-full"
            style={{
              left: s.x - s.size / 2,
              top: s.y - s.size / 2,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>

      {/* Animated aurora blobs — follow cursor */}
      <div
        ref={blobRef}
        className="pointer-events-none absolute inset-0 overflow-hidden transition-transform duration-700 ease-out"
      >
        <div className="animate-float-slow absolute -left-20 top-[10%] h-[500px] w-[500px] rounded-full bg-datefix-blue/15 blur-[100px]" />
        <div className="animate-float-delayed absolute -right-16 top-[30%] h-[400px] w-[400px] rounded-full bg-datefix-pink/15 blur-[100px]" />
        <div className="animate-float absolute bottom-[10%] left-[20%] h-[350px] w-[350px] rounded-full bg-datefix-gold/10 blur-[80px]" />
        <div className="animate-float-delayed absolute bottom-[30%] right-[10%] h-[250px] w-[250px] rounded-full bg-datefix-green/8 blur-[60px]" />
      </div>

      {/* Floating decorative icons — counter-follow cursor */}
      <div
        ref={iconRef}
        className="pointer-events-none absolute inset-0 overflow-hidden transition-transform duration-500 ease-out"
      >
        <Star className="animate-sparkle absolute left-[12%] top-[18%] h-4 w-4 text-datefix-gold/40" />
        <Star className="animate-sparkle absolute right-[18%] top-[22%] h-3 w-3 text-datefix-pink/40 [animation-delay:0.5s]" />
        <Star className="animate-sparkle absolute left-[25%] top-[70%] h-3.5 w-3.5 text-datefix-blue/40 [animation-delay:1s]" />
        <Star className="animate-sparkle absolute right-[22%] top-[65%] h-4 w-4 text-datefix-green/30 [animation-delay:1.5s]" />
        <Zap className="animate-float absolute left-[8%] top-[50%] h-5 w-5 text-datefix-gold/20 [animation-delay:0.3s]" />
        <Heart className="animate-float-delayed absolute right-[10%] top-[45%] h-5 w-5 text-datefix-pink/20" />
        <Star className="animate-sparkle absolute left-[45%] top-[12%] h-3 w-3 text-datefix-blue/30 [animation-delay:0.8s]" />
        <Sparkles className="animate-float absolute right-[30%] top-[80%] h-4 w-4 text-datefix-gold/20 [animation-delay:0.7s]" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        {/* Playful party icon */}
        <div className="animate-bounce-in mb-6">
          <div className="flex items-center gap-4">
            <Heart className="h-5 w-5 animate-pulse text-datefix-pink" />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-datefix-blue/20 to-datefix-pink/20 backdrop-blur-sm">
              <PartyPopper className="h-8 w-8 text-datefix-gold" />
            </div>
            <Heart className="h-5 w-5 animate-pulse text-datefix-pink [animation-delay:0.5s]" />
          </div>
        </div>

        {/* Script font name */}
        <h1 className="animate-slide-up mb-2">
          <span className="font-display text-6xl text-datefix-pink sm:text-7xl md:text-8xl">
            Emily
          </span>
        </h1>

        {/* Bold heading */}
        <h2 className="animate-slide-up mb-3 text-3xl font-extrabold tracking-tight text-white [animation-delay:100ms] sm:text-4xl md:text-5xl">
          you got this!
        </h2>

        {/* Gradient subtext */}
        <p className="animate-slide-up gradient-text mb-2 text-xl font-bold [animation-delay:200ms] sm:text-2xl">
          Let&apos;s get this job!
        </p>

        <p className="animate-slide-up mb-10 max-w-md text-base leading-relaxed text-white/50 [animation-delay:300ms] sm:text-lg">
          Your step-by-step guide to GitHub, Claude Code, &amp; everything
          DateFix. Built with love, by Adam.
        </p>

        {/* CTA Button */}
        <div className="animate-slide-up [animation-delay:400ms]">
          <Button
            onClick={handleStart}
            size="lg"
            className="animate-glow group h-16 cursor-pointer gap-3 rounded-full bg-gradient-to-r from-datefix-blue via-datefix-pink to-datefix-gold px-12 text-lg font-bold text-white transition-all hover:scale-110"
          >
            <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:rotate-[-15deg]" />
            Let&apos;s Go!
            <Sparkles className="h-4 w-4 animate-sparkle" />
          </Button>
        </div>

        {/* Visit demo link */}
        <a
          href="https://datefix-demo.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-slide-up mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/60 transition-all hover:border-white/25 hover:text-white [animation-delay:500ms]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Visit DateFix Demo
        </a>

        {/* Fun tag */}
        <p className="animate-slide-up mt-6 text-sm font-medium tracking-widest text-white/30 uppercase [animation-delay:600ms]">
          10 steps to becoming a pro
        </p>
      </div>
    </div>
  );
}
