"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/hero";
import { AppShell } from "@/components/app-shell";

export default function Home() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("emily-tutorial-started");
    if (saved === "true") setStarted(true);
  }, []);

  const handleStart = () => {
    setStarted(true);
    localStorage.setItem("emily-tutorial-started", "true");
  };

  if (!started) {
    return <Hero onStart={handleStart} />;
  }

  const handleBack = () => {
    setStarted(false);
    localStorage.removeItem("emily-tutorial-started");
  };

  return <AppShell onBack={handleBack} />;
}
