"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import type { Memory } from "@/lib/types";

interface ScrapbookAlbumProps {
  memories: Memory[];
  onFinish?: () => void;
}

export default function ScrapbookAlbum({
  memories,
  onFinish,
}: ScrapbookAlbumProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!memories || memories.length === 0) return null;

  const currentMemory = memories[currentIndex];

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto px-4 select-none relative z-10 flex flex-col items-center">
      {/* ── Album Page Counter ── */}
      <div className="flex items-center justify-between w-full mb-3 px-2">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8B2635]">
          Memory Keepsake
        </span>
        <span className="text-xs font-mono text-[#7A6F62]">
          {currentIndex + 1} / {memories.length}
        </span>
      </div>

      {/* ── Tactile Polaroid Card with Brass Photo Corners ── */}
      <div className="relative w-full aspect-3/4 max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -40, rotate: -2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) handleNext();
              if (info.offset.x > 40) handlePrev();
            }}
            className="w-full h-full paper-deckle p-4 sm:p-5 flex flex-col justify-between rounded-sm cursor-grab active:cursor-grabbing"
            style={{
              background: "#F8F5EE",
              boxShadow:
                "0 18px 40px -10px rgba(59, 39, 30, 0.18), 0 0 0 1px rgba(227, 212, 184, 0.7)",
            }}
          >
            {/* ── Rose-Gold Washi Tape at Top ── */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 opacity-80 rotate-1 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(216,164,158,0.75) 0%, rgba(200,106,118,0.7) 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                clipPath: "polygon(0 0, 95% 2%, 100% 100%, 3% 98%)",
              }}
            />

            {/* ── Photo Mount with Antique Brass Corners ── */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative w-full aspect-square rounded-xs overflow-hidden cursor-pointer group bg-stone-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentMemory.url}
                alt={currentMemory.caption || "Special memory"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />

              {/* Antique Brass Photo Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C5A059] shadow-xs" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C5A059] shadow-xs" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C5A059] shadow-xs" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C5A059] shadow-xs" />

              {/* Zoom pill */}
              <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-xs text-white/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* ── Handwritten Cursive Caption ── */}
            <div className="pt-4 pb-2 text-center select-text">
              <p
                className="font-handwriting text-2xl sm:text-3xl text-[#2A231F] leading-snug ink-bleed"
                style={{ fontWeight: 400 }}
              >
                {currentMemory.caption || "A moment I treasure with you"}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Album Navigation Controls ── */}
      <div className="flex items-center justify-between w-full max-w-sm mt-6 px-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`w-10 h-10 rounded-full border border-[#E3D4B8] flex items-center justify-center transition-all ${
            currentIndex === 0
              ? "opacity-30 cursor-not-allowed text-stone-400"
              : "bg-white/80 text-[#2A231F] hover:bg-[#FAF6F0] cursor-pointer shadow-xs active:scale-95"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs text-[#7A6F62] font-serif italic">
          Swipe or tap to turn page
        </span>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-[#E3D4B8] bg-white/80 text-[#2A231F] hover:bg-[#FAF6F0] flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1A0D07]/90 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setLightboxOpen(false)}
            />
            <div className="relative z-10 max-w-lg w-full bg-[#F4EFE6] p-4 sm:p-6 rounded-lg shadow-2xl">
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentMemory.url}
                alt={currentMemory.caption}
                className="w-full max-h-[70vh] object-contain rounded-xs"
              />
              <p className="font-handwriting text-2xl sm:text-3xl text-center text-[#2A231F] mt-4 ink-bleed">
                {currentMemory.caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
