"use client";

import React from "react";
import { Cake } from "lucide-react";
import { CAKE_STYLES } from "@/lib/cakeStyles";
import type { CakeStyle, CakeStyleInfo } from "@/lib/cakeStyles";

interface CakeStylePickerProps {
  value: CakeStyle;
  onSelect: (style: CakeStyle) => void;
}

function MiniCake({ style }: { style: CakeStyleInfo }) {
  const p = style.palette;
  return (
    <div className="relative flex items-end justify-center h-[3.4rem] w-14">
      {/* candle flame */}
      <span
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-2.5 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 70%, #ffd23f 0%, #ff9930 60%, transparent 100%)",
          filter: "drop-shadow(0 0 2px rgba(255,153,48,0.7))",
        }}
      />
      {/* candle */}
      <span
        className="absolute top-1 left-1/2 -translate-x-1/2 w-[0.35rem] h-3 rounded-sm"
        style={{ background: p.candle }}
      />
      {/* sprinkles on top */}
      {p.sprinkles.slice(0, 4).map((c, i) => (
        <span
          key={i}
          className="absolute left-1/2 w-[0.28rem] h-[0.15rem] rounded-full rotate-45"
          style={{
            background: c,
            top: `${1.1 + (i % 2) * 0.25}rem`,
            left: `calc(50% + ${-0.6 + (i % 3) * 0.55}rem)`,
          }}
        />
      ))}
      {/* top tier */}
      <div
        className="relative w-8 h-5 rounded-[0.4rem] z-10"
        style={{
          background: p.frosting,
          boxShadow: `inset 0 -0.35rem 0 ${p.sponge}, 0 1px 3px rgba(46,42,39,0.18)`,
        }}
      >
        {/* drip */}
        <div
          className="absolute -bottom-[0.3rem] left-0 right-0 h-[0.5rem]"
          style={{
            background: `repeating-linear-gradient(90deg, ${p.frosting} 0 0.35rem, transparent 0.35rem 0.6rem)`,
          }}
        />
      </div>
      {/* bottom tier */}
      <div
        className="relative w-12 h-6 rounded-b-[0.45rem] rounded-t-[0.25rem]"
        style={{
          background: p.frosting,
          boxShadow: `inset 0 -0.4rem 0 ${p.sponge}, 0 2px 4px rgba(46,42,39,0.2)`,
        }}
      >
        <div
          className="absolute -top-[0.28rem] left-0 right-0 h-[0.5rem]"
          style={{
            background: `repeating-linear-gradient(90deg, ${p.frosting} 0 0.35rem, transparent 0.35rem 0.6rem)`,
          }}
        />
      </div>
    </div>
  );
}

export default function CakeStylePicker({
  value,
  onSelect,
}: CakeStylePickerProps) {
  return (
    <div className="surface rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Cake className="w-3.5 h-3.5 text-[#D8B88A]" />
        <p className="text-sm font-semibold text-[#2E2A27]">Cake Style</p>
        <span className="ml-auto text-[0.6875rem] text-[#7A6F62]">
          pick the cake they&rsquo;ll blow out
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {CAKE_STYLES.map((s) => {
          const active = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                active
                  ? "border-[#B05463] bg-[#B05463]/[0.06] ring-1 ring-[#B05463]/30"
                  : "border-[#ECE3DA] bg-white hover:bg-[#F9F5F0]"
              }`}
            >
              <MiniCake style={s} />
              <span className="min-w-0 text-center">
                <span className="block text-sm font-semibold text-[#2E2A27]">
                  {s.label}
                </span>
                <span className="block text-[0.75rem] text-[#6F655E] truncate">
                  {s.mood}
                </span>
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full border border-[#ECE3DA] transition-all ${
                  active ? "bg-[#B05463]" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
