"use client";

import React from "react";
import { motion as motionComponent } from "framer-motion";
import { Heart } from "lucide-react";

interface DoodleAnimationProps {
  name: string;
  type?: "heart" | "rose" | "hearts" | "coffee";
}

export default function DoodleAnimation({ name, type = "heart" }: DoodleAnimationProps) {
  // SVG path transitions for sequential sketching
  const borderTransition = { duration: 1.8, ease: "easeInOut" } as const;
  const mainShapeTransition = { duration: 1.6, delay: 1.5, ease: "easeInOut" } as const;
  const secondaryShapeTransition = { duration: 1.0, delay: 2.8, ease: "easeInOut" } as const;
  const sparkleTransition = { duration: 0.8, delay: 3.5, ease: "easeInOut" } as const;

  const getDoodleLabels = () => {
    switch (type) {
      case "rose":
        return { title: "Blooming Rose", subtitle: "sketched petal by petal for you" };
      case "hearts":
        return { title: "Interlocking Hearts", subtitle: "two paths crossed in unison" };
      case "coffee":
        return { title: "Cozy Warm Coffee", subtitle: "representing shared quiet moments" };
      case "heart":
      default:
        return { title: "A Sketch of Hearts", subtitle: "drawn especially for your day" };
    }
  };

  const labels = getDoodleLabels();

  return (
    <div className="flex flex-col items-center justify-center flex-1 max-w-lg mx-auto w-full my-auto animate-reveal-up text-center space-y-6">
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.06] bg-[#0c0607]/40 w-full relative overflow-hidden flex flex-col items-center shadow-xl">
        
        {/* Soft backlighting */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-20 bg-rose-500 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full pointer-events-none opacity-20 bg-amber-500 blur-2xl" />

        {/* Doodle Drawing Canvas */}
        <svg
          className="w-full max-w-[340px] h-[220px] pointer-events-none drop-shadow-[0_2px_10px_rgba(244,63,94,0.15)]"
          viewBox="0 0 400 240"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Sketchy Border (drawn first) */}
          <motionComponent.path
            d="M 25,20 C 150,18 250,22 375,20 C 378,120 374,180 375,220 C 250,222 150,218 25,220 C 22,180 26,120 25,20"
            stroke="rgba(255, 235, 235, 0.25)"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={borderTransition}
          />

          {/* Render selected Doodle Style */}
          {type === "heart" && (
            <>
              {/* Romantic Heart */}
              <motionComponent.path
                d="M 200,85 C 170,40 120,75 200,165 C 280,75 230,40 200,85"
                stroke="#E11D48" // Primary Rose Red
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={mainShapeTransition}
              />
              {/* Arrow */}
              <motionComponent.path
                d="M 120,165 L 280,85"
                stroke="#F59E0B"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
              <motionComponent.path
                d="M 270,82 L 285,82 L 282,97"
                stroke="#F59E0B"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
              <motionComponent.path
                d="M 130,172 L 120,165 L 128,157"
                stroke="#F59E0B"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
            </>
          )}

          {type === "rose" && (
            <>
              {/* Stem */}
              <motionComponent.path
                d="M 200,140 C 200,165 190,195 200,210"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={mainShapeTransition}
              />
              {/* Leaf */}
              <motionComponent.path
                d="M 200,175 C 170,170 180,160 200,175"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
              {/* Rose Petals - Left Side */}
              <motionComponent.path
                d="M 200,75 C 170,45 130,100 200,140"
                stroke="#E11D48"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={mainShapeTransition}
              />
              {/* Rose Petals - Right Side */}
              <motionComponent.path
                d="M 200,75 C 230,45 270,100 200,140"
                stroke="#E11D48"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={mainShapeTransition}
              />
              {/* Rose Bud Core */}
              <motionComponent.path
                d="M 200,85 C 185,75 180,95 200,110 C 220,95 215,75 200,85"
                stroke="#F59E0B"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
              {/* Lower wrap petal */}
              <motionComponent.path
                d="M 175,95 C 150,120 250,120 225,95"
                stroke="#E11D48"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
            </>
          )}

          {type === "hearts" && (
            <>
              {/* Heart 1 */}
              <motionComponent.path
                d="M 170,95 C 145,55 100,85 170,165 C 240,85 195,55 170,95"
                stroke="#E11D48"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={mainShapeTransition}
              />
              {/* Heart 2 */}
              <motionComponent.path
                d="M 230,105 C 205,65 160,95 230,175 C 300,95 255,65 230,105"
                stroke="#F59E0B"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
            </>
          )}

          {type === "coffee" && (
            <>
              {/* Cup 1 */}
              <motionComponent.path
                d="M 150,110 L 150,160 C 150,175 180,175 180,160 L 180,110 Z"
                stroke="#E11D48"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={mainShapeTransition}
              />
              <motionComponent.path
                d="M 150,120 C 135,120 135,145 150,145"
                stroke="#E11D48"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={mainShapeTransition}
              />
              {/* Cup 2 */}
              <motionComponent.path
                d="M 250,110 L 250,160 C 250,175 220,175 220,160 L 220,110 Z"
                stroke="#F59E0B"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
              <motionComponent.path
                d="M 250,120 C 265,120 265,145 250,145"
                stroke="#F59E0B"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={secondaryShapeTransition}
              />
              {/* Coffee Steams */}
              <motionComponent.path
                d="M 165,95 Q 160,85 165,75"
                stroke="#FDE68A"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={sparkleTransition}
              />
              <motionComponent.path
                d="M 235,95 Q 230,85 235,75"
                stroke="#FDE68A"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={sparkleTransition}
              />
            </>
          )}

          {/* Star Sparkle Left */}
          <motionComponent.path
            d="M 90,60 Q 90,70 100,70 Q 90,70 90,80 Q 90,70 80,70 Q 90,70 90,60"
            stroke="#FDE68A"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={sparkleTransition}
          />

          {/* Star Sparkle Right */}
          <motionComponent.path
            d="M 310,160 Q 310,170 320,170 Q 310,170 310,180 Q 310,170 300,170 Q 310,170 310,160"
            stroke="#FDE68A"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={sparkleTransition}
          />
        </svg>

        {/* Narrative fading caption */}
        <div className="h-14 mt-4 flex items-center justify-center">
          <motionComponent.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[11px] text-stone-500 uppercase tracking-widest font-semibold"
          >
            <motionComponent.span
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block mr-1.5"
            >
              ✦
            </motionComponent.span>
            Drawing surprise sketch...
          </motionComponent.div>
        </div>

        {/* Final revealed romantic wish details */}
        <motionComponent.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.8, duration: 0.8, type: "spring" }}
          className="w-full pt-4 border-t border-white/[0.04] mt-2 flex flex-col items-center"
        >
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Heart className="w-3 h-3 text-rose-500 fill-current" /> {labels.title}
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-serif italic">
            Happy Birthday, {name}!
          </h4>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{labels.subtitle}</p>
        </motionComponent.div>

      </div>
    </div>
  );
}
