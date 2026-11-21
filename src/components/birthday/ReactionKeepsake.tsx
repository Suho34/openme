"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getReaction } from "@/lib/reactions";

interface ReactionKeepsakeProps {
  name: string;
  sender: string;
  reaction?: string;
  onProceed: () => void;
}

/** A reply that carries no words — just the tap the recipient chose. */
export default function ReactionKeepsake({
  name,
  sender,
  reaction,
  onProceed,
}: ReactionKeepsakeProps) {
  const found = getReaction(reaction);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto my-auto select-none"
    >
      <div
        className="paper-deckle relative rounded-sm p-8 sm:p-10 text-center"
        style={{
          background: "#F4EFE6",
          border: "1px solid rgba(227, 212, 184, 0.8)",
          boxShadow:
            "0 20px 45px -12px rgba(59, 39, 30, 0.16), inset 0 0 60px rgba(214, 196, 170, 0.22)",
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8B2635]">
          Sent back to you
        </span>

        <div className="text-6xl my-5" aria-hidden>
          {found?.emoji ?? "💌"}
        </div>

        <h3 className="font-serif italic text-2xl text-[#2A231F]">
          {sender} sent {name} a feeling
        </h3>
        <p className="font-handwriting text-3xl text-[#8B2635] mt-2">
          {found?.label ?? "Reacted to it"}
        </p>
        <p className="text-sm text-[#6F655E] font-serif mt-3">
          {found?.line ?? "This landed exactly the way you hoped."}
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={onProceed} className="btn-primary px-6 py-2.5 text-xs sm:text-sm">
          Continue <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
