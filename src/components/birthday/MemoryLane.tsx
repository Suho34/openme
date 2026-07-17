"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X, Heart } from "lucide-react";

interface Memory {
  url: string;
  caption: string;
}

interface MemoryLaneProps {
  memories: Memory[];
}

export default function MemoryLane({ memories }: MemoryLaneProps) {
  const [activeSlide, setActiveSlide] = useState<number | null>(null);

  if (!memories || memories.length === 0) return null;

  const handleNext = () => {
    if (activeSlide === null) return;
    setActiveSlide((activeSlide + 1) % memories.length);
  };

  const handlePrev = () => {
    if (activeSlide === null) return;
    setActiveSlide((activeSlide - 1 + memories.length) % memories.length);
  };

  // Pre-calculated rotation offsets for realistic polaroid tilts
  const tilts = [-3, 2, -1.5, 3, -2, 1.5, -4, 2.5];

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 select-none">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif text-[#2E2A27] flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-[#C97B84] animate-pulse" />
          Our Memory Lane
        </h3>
        <p className="text-xs text-[#6F655E] mt-1">Click a polaroid to open the full picture memories scrapbook.</p>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {memories.map((memory, index) => {
          const tilt = tilts[index % tilts.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 80 }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                y: -5,
                zIndex: 10,
                boxShadow: "0 20px 25px -5px rgba(46,42,39, 0.05), 0 8px 10px -6px rgba(46,42,39, 0.05)"
              }}
              style={{ rotate: `${tilt}deg` }}
              className="bg-white p-4 pb-6 rounded-sm shadow-md border border-[#ECE3DA] w-64 cursor-pointer transition-shadow"
              onClick={() => setActiveSlide(index)}
            >
              {/* Image box */}
              <div className="w-full h-48 bg-[#F9F5F0] overflow-hidden relative border border-[#ECE3DA] rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memory.url}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                
                {/* Love tape on top of polaroid */}
                <div className="absolute -top-3 left-[35%] right-[35%] h-6 bg-[#C97B84]/20 backdrop-blur-[1px] border border-white/40 rotate-[2deg] shadow-sm flex items-center justify-center text-[10px] text-[#C97B84] font-bold">
                  <Heart className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>

              {/* Caption text */}
              <p className="text-center font-cursive text-lg text-[#2E2A27] leading-normal mt-4 line-clamp-2 px-1">
                {memory.caption}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Slideshow Modal */}
      <AnimatePresence>
        {activeSlide !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2E2A27]/90 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Close Overlay Area */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveSlide(null)} />

            {/* Lightbox Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="bg-white p-4 pb-8 rounded-lg shadow-2xl relative z-10 max-w-xl w-full flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveSlide(null)}
                className="absolute -top-12 right-0 sm:right-[-12px] bg-white/20 hover:bg-white/30 text-white rounded-full p-2 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Frame */}
              <div className="relative w-full h-[320px] sm:h-[400px] bg-[#F9F5F0] rounded overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    src={memories[activeSlide].url}
                    alt="Active Memory"
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>

                {/* Left/Right buttons */}
                {memories.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#2E2A27]/40 hover:bg-[#2E2A27]/60 text-white p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2E2A27]/40 hover:bg-[#2E2A27]/60 text-white p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Lightbox Caption */}
              <motion.div
                key={`caption-${activeSlide}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-6 px-4"
              >
                <p className="font-cursive text-2xl text-[#C97B84] leading-normal">
                  {memories[activeSlide].caption}
                </p>
                <span className="text-[10px] text-[#B5ADA5] font-bold uppercase tracking-wider block mt-2">
                  Memory {activeSlide + 1} of {memories.length}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
