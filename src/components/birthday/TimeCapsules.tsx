"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ArrowRight, Play, Pause, Gift, Lock, Unlock, X } from "lucide-react";
import type { TimeCapsule } from "@/lib/types";
import confetti from "canvas-confetti";

interface TimeCapsulesProps {
  capsules: TimeCapsule[];
  senderName: string;
  recipientName: string;
  onComplete: () => void;
}

export default function TimeCapsules({
  capsules,
  senderName,
  recipientName,
  onComplete,
}: TimeCapsulesProps) {
  const [activeCapsule, setActiveCapsule] = useState<TimeCapsule | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  // Load unlocked state from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishmaker_unlocked_capsules");
      if (stored) {
        setUnlockedIds(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  const handleOpen = (capsule: TimeCapsule) => {
    setActiveCapsule(capsule);

    const nextSet = new Set(unlockedIds).add(capsule.id);
    setUnlockedIds(nextSet);
    try {
      localStorage.setItem(
        "wishmaker_unlocked_capsules",
        JSON.stringify(Array.from(nextSet)),
      );
    } catch {}

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#8B2635", "#C5A059", "#FAF6F0"],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 max-w-xl mx-auto w-full my-auto animate-reveal-up px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B2635] font-semibold">
          Digital Keepsake Capsules
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2A231F] mt-1 font-normal">
          &ldquo;Open When&hellip;&rdquo; Letters
        </h2>
        <p className="text-xs text-[#7A6F62] mt-1.5 max-w-sm mx-auto">
          Notes from {senderName} to stay with you long after today. Open one now,
          or save them on your phone for when you need them most.
        </p>
      </div>

      {/* Grid of Mini Sealed Envelopes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {capsules.map((capsule) => {
          const isUnlocked = unlockedIds.has(capsule.id);
          return (
            <motion.div
              key={capsule.id}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpen(capsule)}
              className="relative cursor-pointer p-5 rounded-lg border border-[#E3D4B8] shadow-sm select-none transition-colors"
              style={{
                background: isUnlocked ? "#FBF8F2" : "#F4EFE6",
                boxShadow: isUnlocked
                  ? "0 4px 15px rgba(59, 39, 30, 0.05)"
                  : "0 8px 24px rgba(59, 39, 30, 0.09)",
              }}
            >
              {/* Wax Seal Stamp on Top Left */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs"
                  style={{
                    background: isUnlocked
                      ? "#C5A059"
                      : "radial-gradient(circle at 35% 35%, #A23545, #5A121E)",
                  }}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A6F62] flex items-center gap-1">
                  {isUnlocked ? (
                    <>
                      <Unlock className="w-3 h-3 text-[#C5A059]" /> Unsealed
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-[#8B2635]" /> Sealed
                    </>
                  )}
                </span>
              </div>

              {/* Envelope Prompt */}
              <h3 className="font-serif text-base text-[#2A231F] font-medium leading-snug">
                {capsule.prompt}
              </h3>

              {/* Micro Indicators */}
              <div className="mt-3 pt-2.5 border-t border-[#E3D4B8]/60 flex items-center justify-between text-[11px] text-[#A09383]">
                <span className="italic">
                  {isUnlocked ? "Tap to re-read" : "Tap to unseal"}
                </span>
                <div className="flex items-center gap-1.5 text-[#C5A059]">
                  {capsule.voucher && (
                    <span title="Includes Promise">
                      <Gift className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {capsule.voiceNoteUrl && (
                    <span title="Includes Audio">
                      <Play className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Active Capsule Modal / Modal View ── */}
      <AnimatePresence>
        {activeCapsule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="paper-deckle relative w-full max-w-lg p-6 sm:p-8 rounded-md border border-[#E3D4B8] shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{ background: "#F4EFE6" }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveCapsule(null)}
                className="absolute top-4 right-4 text-[#7A6F62] hover:text-[#2A231F] p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prompt Tag */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#8B2635] text-white flex items-center justify-center">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs uppercase font-serif tracking-wider text-[#8B2635] font-semibold">
                  Keepsake Capsule
                </span>
              </div>

              {/* Capsule Prompt Title */}
              <h3 className="font-serif text-xl sm:text-2xl text-[#2A231F] font-semibold mb-4">
                {activeCapsule.prompt}
              </h3>

              {/* Message Body */}
              <p className="font-serif italic text-base sm:text-lg text-[#3B271E] leading-relaxed whitespace-pre-wrap mb-5">
                &ldquo;{activeCapsule.message}&rdquo;
              </p>

              {/* Optional Promise Voucher */}
              {activeCapsule.voucher && (
                <div className="p-3.5 rounded-md border border-dashed border-[#C5A059] bg-[#FAF6F0] mb-4 text-xs font-serif text-[#4A3E37]">
                  <span className="font-bold text-[#8B2635] block mb-0.5">
                    ★ An Unconditional Promise:
                  </span>
                  {activeCapsule.voucher}
                </div>
              )}

              {/* Optional Photo */}
              {activeCapsule.photoUrl && (
                <div className="relative p-1 bg-white rounded border border-[#E3D4B8] shadow-xs mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeCapsule.photoUrl}
                    alt="Locked memory"
                    className="w-full max-h-56 object-cover rounded"
                  />
                </div>
              )}

              {/* Optional Voice Note */}
              {activeCapsule.voiceNoteUrl && (
                <div className="p-3 bg-white rounded border border-[#E3D4B8] mb-4">
                  <span className="text-[11px] font-serif text-[#7A6F62] block mb-1.5">
                    Audio Memo from {senderName}:
                  </span>
                  <audio
                    src={activeCapsule.voiceNoteUrl}
                    controls
                    className="w-full h-9"
                  />
                </div>
              )}

              {/* Signoff */}
              <div className="pt-3 border-t border-[#E3D4B8] flex items-center justify-between text-xs text-[#7A6F62]">
                <span className="font-serif italic">Always with you, {senderName}</span>
                <button
                  type="button"
                  onClick={() => setActiveCapsule(null)}
                  className="btn-primary text-xs py-1.5 px-4"
                >
                  Close Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Completion CTA */}
      <button
        type="button"
        onClick={onComplete}
        className="mt-8 btn-primary px-8 py-3.5 text-sm flex items-center justify-center gap-2"
      >
        <span>Continue to Next Chapter</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
