"use client";

import React from "react";

interface StepProgressBarProps {
  current: number; // 0-indexed
  total: number;
  labels: string[];
}

/**
 * Premium SaaS-style horizontal step progress bar.
 * Uses a smooth width transition — no bounce, no pulse.
 */
export default function StepProgressBar({ current, total, labels }: StepProgressBarProps) {
  const pct = ((current) / (total - 1)) * 100;

  return (
    <div className="w-full max-w-sm mx-auto mb-10 select-none">
      {/* Track */}
      <div className="relative h-0.5 bg-white/[0.08] rounded-full">
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #3B82F6, #818CF8)",
            boxShadow: "0 0 8px rgba(59,130,246,0.5)",
          }}
        />

        {/* Step dots */}
        {Array.from({ length: total }).map((_, i) => {
          const isCompleted = i < current;
          const isActive    = i === current;
          return (
            <div
              key={i}
              style={{ left: `${(i / (total - 1)) * 100}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
                  isCompleted
                    ? "bg-blue-500 border-blue-500 scale-100"
                    : isActive
                    ? "bg-white border-blue-400 scale-125"
                    : "bg-transparent border-white/20 scale-100"
                }`}
                style={isActive ? { boxShadow: "0 0 10px rgba(59,130,246,0.6)" } : {}}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 px-0.5">
        {labels.map((label, i) => (
          <span
            key={i}
            className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
              i === current
                ? "text-blue-400"
                : i < current
                ? "text-slate-500"
                : "text-slate-700"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
