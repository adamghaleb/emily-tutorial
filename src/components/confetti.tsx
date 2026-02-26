"use client";

import { useEffect, useState } from "react";

const COLORS = ["#94b8f2", "#d684cc", "#e0a958", "#a0c75d", "#fff"];
const SHAPES = ["circle", "square", "triangle"];
const PARTICLE_COUNT = 60;

interface Particle {
  id: number;
  x: number;
  color: string;
  shape: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

export function Confetti({ onDone }: { onDone?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const p: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.6,
      duration: 1.5 + Math.random() * 1.5,
      drift: -30 + Math.random() * 60,
    }));
    setParticles(p);

    const timer = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={
            {
              left: `${p.x}%`,
              top: "-10px",
              width: p.size,
              height: p.shape === "triangle" ? 0 : p.size,
              backgroundColor: p.shape === "triangle" ? "transparent" : p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              borderLeft:
                p.shape === "triangle"
                  ? `${p.size / 2}px solid transparent`
                  : undefined,
              borderRight:
                p.shape === "triangle"
                  ? `${p.size / 2}px solid transparent`
                  : undefined,
              borderBottom:
                p.shape === "triangle"
                  ? `${p.size}px solid ${p.color}`
                  : undefined,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
