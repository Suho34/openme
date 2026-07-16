"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles } from "lucide-react";

export interface StarMemory {
  id: number;
  label: string; // "First Date", "Late Night Talks"
  date: string;
  description: string;
  x: number; // percentage coordinate 10-90
  y: number; // percentage coordinate 10-90
}

interface MemoryStarsProps {
  stars?: StarMemory[];
}

const DEFAULT_STARS: StarMemory[] = [
  { id: 1, label: "The First Hello", date: "Jan 12, 2021", description: "Our eyes met across the crowded cafe, and a smile started everything.", x: 25, y: 35 },
  { id: 2, label: "Under the City Lights", date: "Jul 18, 2022", description: "A late-night drive, listening to music on loop, wishing the drive would never end.", x: 60, y: 20 },
  { id: 3, label: "Gazing the Horizons", date: "Nov 05, 2023", description: "Standing at the peak of the world, watching the sun fade behind mountains together.", x: 45, y: 70 },
];

export default function MemoryStars({ stars = DEFAULT_STARS }: MemoryStarsProps) {
  const [selectedStar, setSelectedStar] = useState<StarMemory | null>(null);

  return (
    <div
      className="relative w-full h-[400px] border border-white/[0.06] bg-slate-950/20 rounded-2xl overflow-hidden select-none flex flex-col justify-between p-5"
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" opacity=\"0.015\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\"/%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
      }}
    >
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between glass px-4 py-2 rounded-xl border border-white/[0.06] max-w-xs mx-auto w-full">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Memory Constellations
        </span>
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-current animate-pulse" />
          Click Stars
        </span>
      </div>

      {/* Constellation SVG Lines connection */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {stars.map((star, i) => {
          if (i === 0) return null;
          const prev = stars[i - 1];
          return (
            <line
              key={star.id}
              x1={`${prev.x}%`}
              y1={`${prev.y}%`}
              x2={`${star.x}%`}
              y2={`${star.y}%`}
              stroke="#F59E0B"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          );
        })}
      </svg>

      {/* Star Nodes */}
      <div className="absolute inset-0 z-10">
        {stars.map((star) => {
          const isSelected = selectedStar?.id === star.id;
          return (
            <div
              key={star.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              onClick={() => setSelectedStar(isSelected ? null : star)}
            >
              {/* Star Ring Glow */}
              <div
                className={`absolute -inset-4 rounded-full transition-all duration-300 pointer-events-none ${
                  isSelected ? "bg-amber-400/10 scale-125 opacity-100" : "bg-blue-400/0 opacity-0 group-hover:opacity-40 group-hover:bg-blue-400/5 group-hover:scale-105"
                }`}
              />

              {/* Sparkle Glow Dot */}
              <motion.div
                animate={{
                  scale: isSelected ? [1, 1.25, 1] : [1, 1.35, 1],
                  opacity: isSelected ? 1 : [0.4, 0.9, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isSelected ? 1.5 : 2 + (star.id % 3),
                  ease: "easeInOut",
                }}
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border shadow-lg ${
                  isSelected ? "bg-amber-400 border-amber-300 shadow-amber-400/30" : "bg-blue-500/20 border-blue-400/60"
                }`}
              >
                <Star className={`w-2 h-2 ${isSelected ? "text-slate-900 fill-current" : "text-blue-300"}`} />
              </motion.div>

              {/* Mini tag indicator */}
              <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold text-slate-500 uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                {star.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Star Popover Info Display */}
      <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none px-6">
        <AnimatePresence mode="wait">
          {selectedStar ? (
            <motion.div
              key={selectedStar.id}
              initial={{ scale: 0.94, opacity: 0, y: 6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="glass rounded-2xl p-4.5 border border-white/[0.08] text-center max-w-xs flex flex-col items-center gap-1.5 glow-blue bg-[#0c0d14]/90"
              style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05) inset" }}
            >
              <div className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">{selectedStar.date}</span>
              </div>
              <h4 className="text-slate-100 font-bold text-xs leading-normal">{selectedStar.label}</h4>
              <p
                className="text-slate-400 text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}
              >
                &ldquo;{selectedStar.description}&rdquo;
              </p>
            </motion.div>
          ) : (
            <div className="text-[10px] text-slate-600 font-semibold tracking-wider uppercase text-center max-w-xs mt-20">
              Click floating stars to read the micro-memories encoded inside them
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Background guide */}
      <div className="text-center relative z-20 text-[9px] text-slate-700 font-semibold tracking-wider uppercase">
        Memory Map Coordinates
      </div>
    </div>
  );
}
