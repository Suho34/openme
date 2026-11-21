"use client";

import React from "react";
import { Share, PlusSquare, X, Heart } from "lucide-react";

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IOSInstallModal({
  isOpen,
  onClose,
}: IOSInstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 text-center paper-deckle animate-reveal-up"
        style={{
          background: "#FAF6F0",
          border: "1px solid #E3D4B8",
          boxShadow: "0 20px 45px rgba(59, 39, 30, 0.2)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#7A6F62] hover:text-[#2A231F] hover:bg-[#EADDC9]/50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-[#8B2635]/10 flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#8B2635] fill-current" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8B2635] block mb-1">
          Add to Your iPhone
        </span>
        <h3 className="font-serif text-xl sm:text-2xl text-[#2A231F] mb-2 font-medium">
          Install WishMaker
        </h3>
        <p className="text-xs text-[#7A6F62] font-serif leading-relaxed mb-5">
          Keep your birthday surprises and wax-sealed keepsakes on your home screen for quick access.
        </p>

        {/* 2 Simple Steps */}
        <div className="space-y-3 text-left mb-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4EFE6] border border-[#E3D4B8]">
            <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#8B2635] flex-shrink-0 shadow-xs">
              <Share className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#2A231F] block">1. Tap Share</span>
              <span className="text-[#7A6F62]">Tap the Share icon at the bottom of Safari.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4EFE6] border border-[#E3D4B8]">
            <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#8B2635] flex-shrink-0 shadow-xs">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#2A231F] block">2. Add to Home Screen</span>
              <span className="text-[#7A6F62]">Scroll down and choose &ldquo;Add to Home Screen&rdquo;.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary py-3 text-xs font-semibold rounded-xl"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
