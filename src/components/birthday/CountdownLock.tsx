"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export default function CountdownLock({ unlockAt, onUnlock }: { unlockAt: number; onUnlock: () => void }) {
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = unlockAt - Date.now();
      if (diff <= 0) { onUnlock(); return; }
      setRemaining({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [unlockAt, onUnlock]);

  const pad = (n: number) => String(n).padStart(2, "0");
  if (!remaining) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FFF8F2]">
      <div className="relative z-10 flex flex-col items-center animate-reveal-up max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#ECE3DA] flex items-center justify-center mb-8"
          style={{ boxShadow: "0 2px 12px rgba(46,42,39,0.04)" }}>
          <Lock className="w-7 h-7 text-[#D8B88A]" />
        </div>
        <p className="text-[0.6875rem] font-semibold text-[#C97B84] uppercase tracking-[0.15em] mb-3">Surprise Locked</p>
        <h1 className="font-serif text-[2.5rem] sm:text-[3rem] text-[#2E2A27] mb-10" style={{ fontWeight: 400 }}>Unlocking in</h1>
        <div className="flex items-center gap-3 sm:gap-4 mb-10">
          {[{ v: remaining.d, l: "Days" }, { v: remaining.h, l: "Hours" }, { v: remaining.m, l: "Mins" }, { v: remaining.s, l: "Secs" }].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center">
              <div className="bg-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-[#ECE3DA] animate-countdown-pulse"
                style={{ boxShadow: "0 2px 12px rgba(46,42,39,0.04)" }}>
                <span className="text-2xl sm:text-3xl font-serif text-[#2E2A27]" style={{ fontWeight: 500 }}>{pad(v)}</span>
              </div>
              <span className="text-[0.625rem] text-[#B5ADA5] font-semibold uppercase tracking-wider mt-2.5">{l}</span>
            </div>
          ))}
        </div>
        <p className="text-[0.875rem] text-[#6F655E] max-w-xs leading-relaxed">
          It unlocks automatically &mdash; return on your birthday!
        </p>
      </div>
    </div>
  );
}
