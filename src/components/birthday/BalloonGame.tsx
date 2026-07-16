"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
import { playConfettiPop } from "@/lib/audio";

interface Balloon {
  id: number;
  x: number; // left offset (10 - 90)
  speed: number; // duration of animation
  color: string;
  glow: string;
  popped: boolean;
  wish: string;
}

// Premium color styling for metallic helium balloons
const EASE = [0.25, 0.1, 0.25, 1] as const;

const METALLIC_BALLOONS = [
  { color: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", border: "rgba(245,158,11,0.45)", glow: "rgba(245,158,11,0.22)" }, // Gold
  { color: "linear-gradient(135deg, #94A3B8 0%, #475569 100%)", border: "rgba(148,163,184,0.45)", glow: "rgba(148,163,184,0.22)" }, // Platinum Steel
  { color: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)", border: "rgba(99,102,241,0.35)", glow: "rgba(99,102,241,0.18)" }, // Indigo Obsidian
  { color: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", border: "rgba(59,130,246,0.45)", glow: "rgba(59,130,246,0.22)" }, // Ice Blue
  { color: "linear-gradient(135deg, #D97706 0%, #78350F 100%)", border: "rgba(217,119,6,0.45)", glow: "rgba(217,119,6,0.2)" }, // Bronze
];

const POETIC_QUOTES = [
  "Time is a companion that goes with us on a journey.",
  "May your days be filled with quiet wonders.",
  "Here's to another beautiful orbit around the sun.",
  "In the book of life, make this chapter your finest.",
  "Grow old along with me! The best is yet to be.",
  "May light always find you, even on the quietest nights.",
  "To live is the rarest thing in the world. Most people exist.",
  "A mind troubled by doubt cannot focus on the course to victory.",
  "Keep your face always toward the sunshine, and shadows will fall behind.",
  "Let your life lightly dance on the edges of Time like dew on the tip of a leaf."
];

export default function BalloonGame() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [revealedWish, setRevealedWish] = useState<string | null>(null);

  useEffect(() => {
    generateBalloons();
  }, []);

  const generateBalloons = () => {
    const list: Balloon[] = [];
    for (let i = 0; i < 10; i++) {
      const cfg = METALLIC_BALLOONS[i % METALLIC_BALLOONS.length];
      list.push({
        id: i,
        x: 12 + Math.random() * 76,
        speed: 8 + Math.random() * 5, // slower, more majestic floating speed
        color: cfg.color,
        glow: cfg.glow,
        popped: false,
        wish: POETIC_QUOTES[i % POETIC_QUOTES.length]
      });
    }
    setBalloons(list);
    setPoppedCount(0);
    setRevealedWish(null);
  };

  const handlePop = (id: number, wish: string) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(c => c + 1);
    setRevealedWish(wish);
    playConfettiPop();
  };

  return (
    <div className="relative w-full h-[460px] border border-white/[0.06] bg-white/[0.02] rounded-2xl shadow-inner overflow-hidden select-none flex flex-col justify-between p-4"
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" opacity=\"0.015\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\"/%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
      }}
    >
      {/* Elevated dark glass status top bar */}
      <div className="relative z-20 flex items-center justify-between glass px-4 py-2.5 rounded-xl shadow-lg border border-white/[0.07] max-w-xs mx-auto w-full">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Release Wishes
        </span>
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
          {poppedCount} / 10
        </span>
      </div>

      {/* Floating Balloons Canvas */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {balloons.map((balloon) => (
          <AnimatePresence key={balloon.id}>
            {!balloon.popped && (
              <motion.div
                initial={{ y: 480, opacity: 0 }}
                animate={{
                  y: -120,
                  opacity: [0, 1, 1, 0.9, 0],
                  // Smooth organic swaying movement (sinusoidal lateral drift)
                  x: [
                    `${balloon.x}%`,
                    `${balloon.x + 8}%`,
                    `${balloon.x - 6}%`,
                    `${balloon.x + 4}%`
                  ]
                }}
                transition={{
                  duration: balloon.speed,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: balloon.id * 1.5
                }}
                onClick={() => handlePop(balloon.id, balloon.wish)}
                className="absolute w-12 h-15 sm:w-14 sm:h-18 rounded-full cursor-pointer group"
                style={{ left: `${balloon.x}%` }}
              >
                {/* Balloon Outer Gradient */}
                <div
                  className="absolute inset-0 rounded-full border opacity-90 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: balloon.color,
                    borderColor: "rgba(255,255,255,0.12)",
                    boxShadow: `0 8px 24px rgba(0,0,0,0.55), 0 0 16px ${balloon.glow}`,
                  }}
                />

                {/* Highlight/shine */}
                <div className="absolute top-[12%] left-[20%] w-3.5 h-5 bg-white/20 rounded-full blur-[0.5px]" />
                
                {/* String tie bottom */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-sm rotate-45 border-r border-b border-white/10"
                  style={{ background: balloon.color }} />

                {/* Long swaying string */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-white/10" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Pop Message Display Center Overlay */}
      <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none px-6">
        <AnimatePresence mode="wait">
          {revealedWish && (
            <motion.div
              key={revealedWish}
              initial={{ scale: 0.94, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="glass rounded-2xl px-6 py-4.5 border border-white/[0.08] text-center max-w-xs flex flex-col items-center gap-1.5 glow-blue bg-[#0c0d14]/90"
              style={{ boxShadow: "0 10px 32px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05) inset" }}
            >
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                WISH COMMITTED
              </span>
              <span
                className="text-slate-300 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}
              >
                &ldquo;{revealedWish}&rdquo;
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game Completed State */}
      {poppedCount === 10 && (
        <div className="absolute inset-0 z-30 bg-[#07080D]/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-reveal-up">
          <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center mb-4 glow-gold">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Wishes Released</h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            All warm thoughts and poetic intentions have been scattered into the celebration space.
          </p>
          <button
            onClick={generateBalloons}
            className="mt-5 btn-primary px-5 py-2 text-xs"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Background Hint */}
      <div className="text-center relative z-20 text-[9px] text-slate-600 font-semibold tracking-wider uppercase">
        {poppedCount < 10 ? "Tap floating orbits to commit birthday wishes" : "All wishes released"}
      </div>
    </div>
  );
}
