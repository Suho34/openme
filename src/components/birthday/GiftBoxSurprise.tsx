"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Compass } from "lucide-react";
import { playChime } from "@/lib/audio";
import toast from "react-hot-toast";

interface GiftBoxSurpriseProps {
  sender: string;
  message: string;
  name: string;
  theme: string;
  onOpenComplete: () => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function GiftBoxSurprise({ sender, message, name, onOpenComplete }: GiftBoxSurpriseProps) {
  const [state, setState] = useState<"idle" | "breaking" | "opened">("idle");
  const [showCard, setShowCard] = useState(false);

  const handleOpen = () => {
    if (state !== "idle") return;
    setState("breaking");
    playChime();
    toast("Unsealing your invitation…", { icon: "✉️" });
    
    setTimeout(() => {
      setState("opened");
      setTimeout(() => setShowCard(true), 600);
    }, 1100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 select-none relative z-10">
      <AnimatePresence mode="wait">
        {state !== "opened" ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.9, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col items-center w-full max-w-md"
          >
            {/* 3D Envelope Wrapper */}
            <div
              onClick={handleOpen}
              className="relative w-full aspect-[1.5/1] cursor-pointer group"
              style={{ perspective: "1000px" }}
            >
              {/* Gold outer backing glow */}
              <div className="absolute -inset-1 rounded-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 blur-xl"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)" }} />

              {/* Envelope Back Shell */}
              <div
                className="absolute inset-0 rounded-xl bg-slate-900 border border-white/[0.04] overflow-hidden"
                style={{
                  boxShadow: "0 12px 40px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.06) inset",
                  backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" opacity=\"0.02\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\"/%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
                }}
              >
                {/* 3D Paper Folds (Left, Right, Bottom Flaps) */}
                {/* Left Flap */}
                <div className="absolute inset-y-0 left-0 w-1/2 origin-left bg-gradient-to-tr from-slate-950 to-slate-900 border-r border-white/[0.02]"
                  style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)", boxShadow: "2px 0 10px rgba(0,0,0,0.5)" }} />

                {/* Right Flap */}
                <div className="absolute inset-y-0 right-0 w-1/2 origin-right bg-gradient-to-tl from-slate-950 to-slate-900 border-l border-white/[0.02]"
                  style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)", boxShadow: "-2px 0 10px rgba(0,0,0,0.5)" }} />

                {/* Bottom Flap (Overlaps Left & Right) */}
                <div className="absolute bottom-0 inset-x-0 h-[65%] bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900 border-t border-white/[0.03]"
                  style={{
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    boxShadow: "0 -4px 12px rgba(0,0,0,0.6)"
                  }}
                />
              </div>

              {/* Top Flap (CSS 3D Rotate Flap) */}
              <motion.div
                animate={state === "breaking" ? { rotateX: 135 } : { rotateX: 0 }}
                transition={{ duration: 0.75, ease: EASE }}
                className="absolute top-0 left-0 w-full h-[62%] origin-top z-30"
                style={{
                  transformStyle: "preserve-3d",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #1C1E2D 0%, #11121C 100%)",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.55)",
                }}
              />

              {/* The Wax Seal (Cracks/crumbles on break) */}
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.div
                  animate={
                    state === "breaking"
                      ? { scale: [1, 1.15, 0], opacity: [1, 1, 0], rotate: [0, -12, 12] }
                      : state === "idle"
                      ? { y: [0, -3, 0] }
                      : {}
                  }
                  transition={
                    state === "breaking"
                      ? { duration: 0.9, ease: "easeInOut" }
                      : { repeat: Infinity, duration: 4, ease: "easeInOut" }
                  }
                  className="w-14 h-14 rounded-full relative flex items-center justify-center border border-amber-400/40"
                  style={{
                    background: "radial-gradient(circle, #F59E0B 0%, #D97706 70%, #92400E 100%)",
                    boxShadow: "0 4px 16px rgba(245,158,11,0.38), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Embossed Star */}
                  <span className="text-white/80 font-bold text-lg text-glow-gold">✦</span>

                  {/* Cracked lines overlay during break */}
                  {state === "breaking" && (
                    <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-65">
                      <div className="w-full h-[1px] bg-amber-950 rotate-45 absolute" />
                      <div className="w-full h-[1px] bg-amber-950 -rotate-45 absolute" />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Ribbon Accent */}
              <div className="absolute top-0 bottom-0 left-[48%] w-[4%] bg-gradient-to-r from-amber-500/10 via-amber-500/25 to-amber-500/10 z-20 pointer-events-none" />
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, ease: EASE }}
              className="text-lg sm:text-xl font-bold text-slate-100 text-center mt-8 tracking-tight"
            >
              Surprise invitation for <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #FCD34D, #F59E0B)" }}>{name}</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-slate-500 mt-2 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Tap wax seal to open surprise
            </motion.p>
          </motion.div>
        ) : (
          /* High-Fidelity Paper Card Slide-Out */
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="w-full max-w-lg flex flex-col items-center"
          >
            <AnimatePresence>
              {showCard && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  className="w-full surface-raised rounded-2xl p-8 sm:p-11 shadow-3xl mb-8 relative overflow-hidden"
                  style={{
                    borderColor: "rgba(245,158,11,0.18)",
                    background: "linear-gradient(160deg, #10121D 0%, #09090F 100%)",
                  }}
                >
                  {/* Delicate corner ornaments (gold line corners) */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-amber-500/25" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-amber-500/25" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-amber-500/25" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-amber-500/25" />

                  {/* Soft gold glow */}
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none opacity-20"
                    style={{ background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)", filter: "blur(30px)" }} />

                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-white/[0.06] pb-5 mb-7">
                    <Compass className="w-4 h-4 text-amber-500/80" />
                    <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">A SURPRISE SURPRISE</span>
                  </div>

                  {/* Letter content */}
                  <div className="space-y-5 text-slate-200">
                    <p className="font-semibold text-base text-slate-100">Dear {name},</p>
                    <p
                      className="text-slate-300 whitespace-pre-line leading-relaxed tracking-wide italic"
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "1.12rem",
                        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                      }}
                    >
                      {message}
                    </p>
                    <div className="text-right pt-4 border-t border-white/[0.04]">
                      <span className="text-xs text-slate-500">Sent with warmth by</span>
                      <p className="text-sm font-bold text-amber-400 mt-1">{sender}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.6, ease: EASE }}
            >
              <button
                onClick={onOpenComplete}
                className="btn-primary px-8 py-3.5 flex items-center gap-2 text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                Time to make a wish →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
