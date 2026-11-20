"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChapterHeaderProps {
  chapter: string;
  title: string;
  subtitle?: string;
}

export default function ChapterHeader({
  chapter,
  title,
  subtitle,
}: ChapterHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center pt-2 pb-6 select-none relative z-20"
    >
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="w-6 h-px bg-linear-to-r from-transparent to-[#C5A059]/40" />
        <span className="text-[0.6875rem] uppercase tracking-[0.25em] font-semibold text-[#8B2635]/90">
          {chapter}
        </span>
        <span className="w-6 h-px bg-linear-to-l from-transparent to-[#C5A059]/40" />
      </div>

      <h2 className="font-serif text-xl sm:text-2xl text-[#2A231F] font-normal tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs text-[#7A6F62] font-serif italic mt-0.5">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
