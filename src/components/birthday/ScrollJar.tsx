"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw, Check } from "lucide-react";
import type { ScrollNote } from "@/lib/types";
import confetti from "canvas-confetti";

interface ScrollJarProps {
  scrolls: ScrollNote[];
  title?: string;
  senderName: string;
  onComplete: () => void;
}

export default function ScrollJar({
  scrolls,
  title = "Jar of Little Scrolls",
  senderName,
  onComplete,
}: ScrollJarProps) {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [readScrolls, setReadScrolls] = useState<Set<number>>(new Set());

  const handleOpenScroll = (index: number) => {
    setOpenedIndex(index);
    setReadScrolls((prev) => new Set(prev).add(index));

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
      colors: ["#C5A059", "#8B2635", "#FAF6F0"],
    });
  };

  const handleNextScroll = () => {
    if (openedIndex === null) return;
    const nextIdx = (openedIndex + 1) % scrolls.length;
    handleOpenScroll(nextIdx);
  };

  const allRead = readScrolls.size === scrolls.length;

  return (
    <div className="flex flex-col items-center justify-center flex-1 max-w-xl mx-auto w-full my-auto animate-reveal-up px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B2635] font-semibold">
          Handwritten Memories &bull; From {senderName}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2A231F] mt-1 font-normal">
          {title}
        </h2>
        <p className="text-xs text-[#7A6F62] mt-1 max-w-sm mx-auto">
          {openedIndex === null
            ? "Tap the glass jar to draw a rolled parchment scroll."
            : `Scroll ${openedIndex + 1} of ${scrolls.length}`}
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative w-full flex flex-col items-center min-h-[380px] justify-center">
        <AnimatePresence mode="wait">
          {openedIndex === null ? (
            /* ── THE CLOSED JAR VIEW ── */
            <motion.div
              key="closed-jar"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => handleOpenScroll(0)}
              className="cursor-pointer group flex flex-col items-center select-none"
            >
              {/* Antique Apothecary Jar Illustration */}
              <div className="relative w-48 h-64 flex flex-col items-center">
                {/* Cork Lid */}
                <div
                  className="w-20 h-6 rounded-t-md border border-[#8A6A4B] shadow-sm z-10"
                  style={{
                    background:
                      "linear-gradient(90deg, #A8835C 0%, #C4A47C 40%, #8A6A4B 100%)",
                  }}
                />
                {/* Twine String around neck */}
                <div className="w-24 h-2.5 bg-[#785E42] rounded-xs -mt-0.5 z-10 border-b border-[#5E4730]" />

                {/* Glass Bottle Body */}
                <div
                  className="relative w-44 h-56 rounded-b-[2.5rem] rounded-t-lg border-2 border-white/60 overflow-hidden flex flex-col items-center justify-end p-4 shadow-xl group-hover:scale-105 transition-transform duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(244,239,230,0.2) 50%, rgba(197,160,89,0.15) 100%)",
                    backdropFilter: "blur(4px)",
                    boxShadow:
                      "inset 0 0 25px rgba(255,255,255,0.7), 0 20px 40px rgba(59,39,30,0.15)",
                  }}
                >
                  {/* Glass Reflection Glint */}
                  <div className="absolute top-2 left-3 w-4 h-36 bg-gradient-to-b from-white/70 to-transparent rounded-full rotate-3 pointer-events-none" />

                  {/* Inside Rolled Scrolls */}
                  <div className="relative w-full h-36 flex flex-wrap items-end justify-center gap-1.5 pb-2">
                    {scrolls.map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-16 rounded-sm shadow-sm transform transition-transform"
                        style={{
                          background:
                            "linear-gradient(180deg, #FDFBF7 0%, #EBDBC1 50%, #D4BE98 100%)",
                          border: "1px solid #C4A47C",
                          rotate: `${((i * 19) % 36) - 18}deg`,
                          opacity: readScrolls.has(i) ? 0.45 : 1,
                        }}
                      />
                    ))}
                  </div>

                  {/* Antique Label on Jar */}
                  <div
                    className="absolute top-14 px-3 py-1 rounded bg-[#FBF8F2] border border-[#D4BE98] shadow-xs text-center pointer-events-none"
                    style={{ transform: "rotate(-1deg)" }}
                  >
                    <span className="font-serif text-[10px] uppercase tracking-wider text-[#6F655E] block font-semibold">
                      {scrolls.length} Keepsakes
                    </span>
                  </div>
                </div>
              </div>

              {/* Tap Prompt Button */}
              <div className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B2635] text-white text-xs font-serif shadow-md group-hover:bg-[#721C28] transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Tap jar to draw a scroll</span>
              </div>
            </motion.div>
          ) : (
            /* ── THE UNFURLED SCROLL VIEW ── */
            <motion.div
              key={`opened-scroll-${openedIndex}`}
              initial={{ scale: 0.7, y: 50, rotateX: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -40, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="relative w-full max-w-md select-none"
            >
              {/* Unrolled Parchment Paper */}
              <div
                className="paper-deckle p-8 sm:p-10 rounded-sm relative text-center shadow-2xl"
                style={{
                  background: "#F4EFE6",
                  border: "1px solid #E3D4B8",
                  boxShadow:
                    "0 20px 45px rgba(59, 39, 30, 0.18), inset 0 0 40px rgba(197, 160, 89, 0.12)",
                }}
              >
                {/* Scroll Ribbon Tie Accent */}
                <div className="w-6 h-6 rounded-full bg-[#8B2635] text-white text-[11px] font-bold mx-auto -mt-12 mb-4 flex items-center justify-center shadow-sm">
                  #{openedIndex + 1}
                </div>

                {/* Decorative Quotes */}
                <span className="font-serif text-4xl text-[#C5A059] opacity-40 block -mb-4">
                  &ldquo;
                </span>

                {/* The Handwritten Note */}
                <p className="font-serif italic text-lg sm:text-xl text-[#2A231F] leading-relaxed my-3 px-2">
                  {scrolls[openedIndex].text}
                </p>

                <span className="font-serif text-4xl text-[#C5A059] opacity-40 block -mt-2">
                  &rdquo;
                </span>

                <div className="mt-4 pt-3 border-t border-[#E3D4B8] flex items-center justify-between text-[11px] text-[#7A6F62]">
                  <span>From {senderName}</span>
                  <span>
                    Scroll {openedIndex + 1} of {scrolls.length}
                  </span>
                </div>
              </div>

              {/* Actions below scroll */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpenedIndex(null)}
                  className="btn-ghost text-xs py-2 px-3.5 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Back to Jar
                </button>

                <button
                  type="button"
                  onClick={handleNextScroll}
                  className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
                >
                  <span>Draw Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 mt-8 mb-4">
        {scrolls.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleOpenScroll(i)}
            title={`Scroll #${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              openedIndex === i
                ? "bg-[#8B2635] scale-125 ring-2 ring-[#8B2635]/30"
                : readScrolls.has(i)
                  ? "bg-[#C5A059]"
                  : "bg-[#D4C4A8]"
            }`}
          />
        ))}
      </div>

      {/* Completion Button */}
      <button
        type="button"
        onClick={onComplete}
        className="mt-2 text-xs font-serif font-semibold text-[#8B2635] hover:text-[#721C28] underline underline-offset-4 flex items-center gap-1 transition-colors"
      >
        <span>
          {allRead ? "Continue to Next Chapter" : "Continue anyway"}
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
