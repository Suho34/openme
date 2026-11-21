"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";

interface HandwrittenLetterProps {
  name: string;
  sender: string;
  message: string;
  onProceed: () => void;
}

export default function HandwrittenLetter({
  name,
  sender,
  message,
  onProceed,
}: HandwrittenLetterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-auto my-auto select-none"
    >
      {/* ── Soft Ambient Glow behind parchment ── */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-35 blur-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(197,160,89,0.3) 0%, rgba(139,38,53,0.15) 50%, transparent 75%)",
        }}
      />

      {/* ── Deckle-Edge Cotton Rag Parchment ── */}
      <div
        className="paper-deckle relative rounded-sm p-7 sm:p-9 overflow-hidden transition-shadow"
        style={{
          background: "#F4EFE6",
          border: "1px solid rgba(227, 212, 184, 0.8)",
          boxShadow:
            "0 20px 45px -12px rgba(59, 39, 30, 0.16), 0 0 0 1px rgba(227, 212, 184, 0.5), inset 0 0 60px rgba(214, 196, 170, 0.22)",
        }}
      >
        {/* ── Dried Botanical Lavender Accent (SVG illustration) ── */}
        <div
          className="absolute -top-3 -right-3 w-28 h-28 pointer-events-none opacity-85 rotate-12"
          aria-hidden
        >
          <svg viewBox="0 0 120 120" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Lavender stem */}
            <path
              d="M30 110 C 45 80, 70 50, 95 15"
              stroke="#6B7861"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Side leaves */}
            <path d="M42 90 C 35 85, 30 82, 24 85 C 32 88, 38 89, 45 92" fill="#7D8B75" />
            <path d="M55 72 C 63 68, 70 66, 76 70 C 69 72, 63 73, 57 74" fill="#7D8B75" />
            {/* Lavender flower buds */}
            <ellipse cx="65" cy="55" rx="3.5" ry="5.5" transform="rotate(25 65 55)" fill="#8F819A" />
            <ellipse cx="72" cy="46" rx="3.5" ry="5.5" transform="rotate(-15 72 46)" fill="#7E6F89" />
            <ellipse cx="76" cy="38" rx="3.2" ry="5" transform="rotate(30 76 38)" fill="#8F819A" />
            <ellipse cx="83" cy="30" rx="3" ry="4.5" transform="rotate(-20 83 30)" fill="#9A8CA7" />
            <ellipse cx="89" cy="22" rx="2.8" ry="4.2" transform="rotate(15 89 22)" fill="#8F819A" />
            <ellipse cx="94" cy="15" rx="2.2" ry="3.5" transform="rotate(-5 94 15)" fill="#A799B5" />
          </svg>
        </div>

        {/* ── Long-Distance Postmark Stamp ── */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E3D4B8]/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-dashed border-[#8B2635]/40 flex items-center justify-center text-[#8B2635]">
              <Heart className="w-3.5 h-3.5 fill-current opacity-80" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#8B2635]">
                Special Delivery
              </p>
              <p className="text-[10px] text-[#7A6F62] font-serif italic">
                From across the miles • Sealed with love
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-mono font-medium">
              № 01 • FOR YOU
            </span>
          </div>
        </div>

        {/* ── Handwritten Letter Content ── */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 select-text">
          {/* Salutation */}
          <h3
            className="font-handwriting text-3xl sm:text-4xl text-[#2A231F] leading-tight ink-bleed"
            style={{ fontWeight: 400 }}
          >
            My Dearest {name},
          </h3>

          {/* Body in authentic cursive calligraphy */}
          <div
            className="font-handwriting text-2xl sm:text-[1.75rem] text-[#2A231F] leading-[1.8] whitespace-pre-line ink-bleed tracking-wide"
            style={{ fontWeight: 400 }}
          >
            {message}
          </div>

          {/* Valediction */}
          <div className="pt-6 text-right font-handwriting text-2xl sm:text-3xl text-[#2A231F] ink-bleed">
            <p className="text-sm font-serif italic text-[#7A6F62] not-italic">
              Forever yours,
            </p>
            <p className="mt-1 text-[#8B2635] text-3xl sm:text-4xl">
              {sender}
            </p>
          </div>
        </div>

        {/* ── Decorative Corner Flourishes ── */}
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C5A059]/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C5A059]/40" />
      </div>

      {/* ── Action: Proceed to Cake & Candles ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 flex justify-center"
      >
        <button
          onClick={onProceed}
          className="group relative inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.96] cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #8B2635 0%, #721C28 100%)",
            boxShadow:
              "0 4px 14px rgba(139, 38, 53, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          }}
        >
          <span>Light the Birthday Candles</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </motion.div>
  );
}
