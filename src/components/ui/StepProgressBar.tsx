"use client";

import React from "react";

interface StepProgressBarProps {
  current: number; // 0-indexed
  total: number;
  labels: string[];
}

/**
 * Warm editorial step progress bar with dusty rose fill.
 */
export default function StepProgressBar({ current, total, labels }: StepProgressBarProps) {
  const pct = ((current) / (total - 1)) * 100;

  return (
    <div className="w-full max-w-sm mx-auto mb-12 select-none">
      {/* Track */}
      <div className="relative h-[2px] bg-[#ECE3DA] rounded-full">
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #C97B84, #D8B88A)",
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
                    ? "bg-[#C97B84] border-[#C97B84] scale-100"
                    : isActive
                    ? "bg-white border-[#C97B84] scale-125"
                    : "bg-white border-[#ECE3DA] scale-100"
                }`}
                style={isActive ? { boxShadow: "0 0 0 4px rgba(201,123,132,0.1)" } : {}}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3.5 px-0.5">
        {labels.map((label, i) => (
          <span
            key={i}
            className={`text-[0.625rem] font-semibold uppercase tracking-wider transition-colors duration-300 ${
              i === current
                ? "text-[#C97B84]"
                : i < current
                ? "text-[#6F655E]"
                : "text-[#DDD4CB]"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
