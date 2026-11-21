"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart } from "lucide-react";
import { playPaper, playSealCrack } from "@/lib/sfx";
import { triggerHaptic } from "@/lib/haptics";
import toast from "react-hot-toast";
import HandwrittenLetter from "./HandwrittenLetter";
import type { GiftBoxSurpriseProps } from "@/lib/types";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function GiftBoxSurprise({
  sender,
  message,
  name,
  letterFont,
  onOpenComplete,
}: GiftBoxSurpriseProps) {
  const [state, setState] = useState<"idle" | "breaking" | "opened">("idle");

  const handleOpen = () => {
    if (state !== "idle") return;
    setState("breaking");
    playSealCrack();
    window.setTimeout(playPaper, 520);
    triggerHaptic("wax");
    toast("Breaking the wax seal…");

    setTimeout(() => setState("opened"), 1000);
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
              className="relative w-full aspect-1.5/1 cursor-pointer group"
              style={{ perspective: "1000px" }}
            >
              {/* Gold outer backing glow */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 blur-xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(201,123,132,0.2) 0%, transparent 70%)",
                }}
              />

              {/* Envelope Back Shell */}
              <div
                className="absolute inset-0 rounded-xl bg-[#EADDC9] border border-[#E3D4B8] overflow-hidden"
                style={{
                  boxShadow: "0 12px 40px rgba(46,42,39,0.12)",
                  backgroundImage:
                    'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.02"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23n)"/%3E%3C/svg%3E\')',
                }}
              >
                {/* 3D Paper Folds (Left, Right, Bottom Flaps) */}
                {/* Left Flap */}
                <div
                  className="absolute inset-y-0 left-0 w-1/2 origin-left bg-linear-to-tr from-[#dfceb5] to-[#d6c4aa] opacity-80 border-r border-[#E3D4B8]"
                  style={{
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
                  }}
                />

                {/* Right Flap */}
                <div
                  className="absolute inset-y-0 right-0 w-1/2 origin-right bg-linear-to-tl from-[#dfceb5] to-[#d6c4aa] opacity-80 border-l border-[#E3D4B8]"
                  style={{
                    clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                    boxShadow: "-2px 0 10px rgba(0,0,0,0.05)",
                  }}
                />

                {/* Bottom Flap (Overlaps Left & Right) */}
                <div
                  className="absolute bottom-0 inset-x-0 h-[65%] bg-linear-to-t from-[#dfceb5] via-[#d6c4aa] to-[#d6c4aa] opacity-90 border-t border-[#E3D4B8]"
                  style={{
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    boxShadow: "0 -4px 12px rgba(46,42,39,0.05)",
                  }}
                />
              </div>

              {/* Top Flap (CSS 3D Rotate Flap) */}
              <motion.div
                animate={
                  state === "breaking" ? { rotateX: 135 } : { rotateX: 0 }
                }
                transition={{ duration: 0.75, ease: EASE }}
                className="absolute top-0 left-0 w-full h-[62%] origin-top z-30"
                style={{
                  transformStyle: "preserve-3d",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background:
                    "linear-gradient(180deg, #ebdcb7 0%, #EADDC9 100%)",
                  borderTop: "1px solid rgba(62,45,47,0.12)",
                  boxShadow: "0 4px 15px rgba(62,45,47,0.08)",
                }}
              />

              {/* The Wax Seal (Cracks/crumbles on break) */}
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.div
                  animate={
                    state === "breaking"
                      ? {
                          scale: [1, 1.15, 0],
                          opacity: [1, 1, 0],
                          rotate: [0, -12, 12],
                        }
                      : state === "idle"
                        ? { y: [0, -3, 0] }
                        : {}
                  }
                  transition={
                    state === "breaking"
                      ? { duration: 0.9, ease: "easeInOut" }
                      : { repeat: Infinity, duration: 4, ease: "easeInOut" }
                  }
                  className="w-16 h-16 rounded-full relative flex items-center justify-center cursor-pointer wax-seal-shadow"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #A33B49 0%, #8B2635 60%, #5A121E 100%)",
                    border: "1.5px solid rgba(255, 255, 255, 0.25)",
                  }}
                >
                  {/* Embossed Heart Monogram */}
                  <Heart className="w-7 h-7 text-white/90 fill-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />

                  {/* Cracked lines overlay during break */}
                  {state === "breaking" && (
                    <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-65">
                      <div className="w-full h-px bg-amber-950 rotate-45 absolute" />
                      <div className="w-full h-px bg-amber-950 -rotate-45 absolute" />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Ribbon Accent */}
              <div className="absolute top-0 bottom-0 left-[48%] w-[4%] bg-linear-to-r from-stone-500/5 via-stone-500/10 to-stone-500/5 z-20 pointer-events-none" />
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, ease: EASE }}
              className="text-lg sm:text-xl font-bold text-[#2E2A27] text-center mt-8 tracking-tight font-serif italic"
            >
              Surprise invitation for{" "}
              <span className="text-[#B05463]">{name}</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-[#6F655E] mt-2 flex items-center gap-1.5 font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-[#B05463]" /> Tap wax seal to
              open surprise
            </motion.p>
          </motion.div>
        ) : (
          /* High-Fidelity Photorealistic Deckle-Edge Letter */
          <HandwrittenLetter
            name={name}
            sender={sender}
            message={message}
            letterFont={letterFont}
            onProceed={onOpenComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
