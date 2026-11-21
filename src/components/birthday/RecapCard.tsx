"use client";

import React from "react";
import { Heart, Download, Sparkles } from "lucide-react";
import Link from "next/link";

export interface RecapStats {
  candlesTries?: number;
  usedMicrophone?: boolean;
  balloonsPopped?: number;
  triviaCorrect?: number;
  triviaTotal?: number;
}

interface RecapCardProps {
  name: string;
  sender: string;
  stats?: RecapStats;
  onCopied?: () => void;
  onDownloadVault?: () => void;
}

export default function RecapCard({
  name,
  sender,
  onDownloadVault,
}: RecapCardProps) {
  return (
    <div
      className="w-full max-w-md mx-auto paper-deckle p-6 sm:p-8 text-center rounded-sm relative overflow-hidden"
      style={{
        background: "#F8F5EE",
        border: "1px solid rgba(227, 212, 184, 0.8)",
        boxShadow: "0 20px 45px -12px rgba(59, 39, 30, 0.18)",
      }}
    >
      {/* Keepsake Header */}
      <div className="mb-6">
        <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-[#8B2635]/10 flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#8B2635] fill-current" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B2635] block mb-1">
          A Moment Sealed in Time
        </span>
        <h3 className="font-serif italic text-2xl sm:text-3xl text-[#2A231F]">
          Happy Birthday, {name}! ✨
        </h3>
        <p className="text-xs text-[#7A6F62] font-serif mt-1.5">
          A personal keepsake crafted with love by {sender}.
        </p>
      </div>

      {/* Save Keepsake Vault to Device */}
      {onDownloadVault && (
        <button
          type="button"
          onClick={onDownloadVault}
          className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-[#C5A059] bg-[#FAF6F0] text-sm font-serif font-semibold text-[#3B271E] hover:bg-[#F4EFE6] transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Save Keepsake Vault to Device (.html)</span>
        </button>
      )}

      {/* Make a Keepsake CTA */}
      <div className="mt-5 pt-5 border-t border-[#E3D4B8] text-center space-y-3">
        <p className="text-xs font-serif italic text-[#7A6F62]">
          Want to make someone feel this special on their birthday?
        </p>

        <Link
          href="/create"
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-semibold text-white cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #8B2635 0%, #721C28 100%)",
            boxShadow: "0 4px 16px rgba(139, 38, 53, 0.35)",
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Create a Birthday Surprise</span>
        </Link>
      </div>
    </div>
  );
}
