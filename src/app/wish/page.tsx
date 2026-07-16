"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Sparkles, AlertCircle, Plus, Lock, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import GiftBoxSurprise from "@/components/birthday/GiftBoxSurprise";
import BirthdayCake from "@/components/birthday/BirthdayCake";
import BalloonGame from "@/components/birthday/BalloonGame";
import MemoryLane from "@/components/birthday/MemoryLane";
import Fireworks from "@/components/birthday/Fireworks";
import MemoryStars, { StarMemory } from "@/components/birthday/MemoryStars";
import Timeline, { TimelineEvent } from "@/components/birthday/Timeline";
import StepProgressBar from "@/components/ui/StepProgressBar";
import { JinglePlayer } from "@/lib/jingle";

interface Memory { url: string; caption: string; }

interface WishData {
  n:  string;
  a?: number;
  s:  string;
  m:  string;
  t:  string;
  mm: Memory[];
  dl?: number;
  tl?: TimelineEvent[];
  st?: StarMemory[];
}

type Stage = "gift" | "cake" | "final-wish" | "constellation" | "timeline" | "memories" | "balloons" | "finale";

const STEP_LABELS = ["Open", "Blow", "Wish", "Stars", "Timeline", "Photos", "Balloons", "Finale"];
const STAGE_INDEX: Record<Stage, number> = {
  gift: 0,
  cake: 1,
  "final-wish": 2,
  constellation: 3,
  timeline: 4,
  memories: 5,
  balloons: 6,
  finale: 7
};

// ── Feature C: Countdown Lock ──
function CountdownLock({ unlockAt, onUnlock }: { unlockAt: number; onUnlock: () => void }) {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative" style={{ background: "#08090E" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] opacity-15 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(251,191,36,0.6) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>
      <div className="relative z-10 flex flex-col items-center animate-reveal-up">
        <div className="w-16 h-16 glass-gold rounded-2xl flex items-center justify-center mb-6 glow-gold">
          <Lock className="w-7 h-7 text-amber-400" />
        </div>
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">Surprise Locked</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 tracking-tight">Unlocking in</h1>
        <div className="flex items-center gap-3 mb-8">
          {[{ v: remaining.d, l: "Days" }, { v: remaining.h, l: "Hours" }, { v: remaining.m, l: "Mins" }, { v: remaining.s, l: "Secs" }].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center">
              <div className="glass-gold rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-countdown-pulse">
                <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">{pad(v)}</span>
              </div>
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-2">{l}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-semibold">It unlocks automatically — return on your birthday! 🎂</p>
      </div>
    </div>
  );
}

// ── Ambient Floating Hearts Particle Canvas ──
function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
    window.addEventListener("resize", () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
    
    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.translate(x, y);
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, -size / 6, -size, size / 3);
      ctx.bezierCurveTo(-size, size, -size / 3, size * 1.5, 0, size * 2);
      ctx.bezierCurveTo(size / 3, size * 1.5, size, size, size, size / 3);
      ctx.bezierCurveTo(size, -size / 6, size / 2, -size / 2, 0, 0);
      ctx.fillStyle = `rgba(244, 63, 94, ${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const hearts = Array.from({ length: 24 }, () => ({
      x: Math.random() * w, y: h + Math.random() * 100,
      size: Math.random() * 4 + 3,
      speed: Math.random() * 0.7 + 0.3,
      opacity: Math.random() * 0.4 + 0.05
    }));

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      hearts.forEach(p => {
        drawHeart(p.x, p.y, p.size, p.opacity);
        p.y -= p.speed;
        p.x += Math.sin(p.y * 0.015) * 0.15;
        if (p.y < -40) { p.y = h + 40; p.x = Math.random() * w; }
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden />;
}

// ── Main Page Component ──
function WishContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams?.get("d");

  const [wishData, setWishData]             = useState<WishData | null>(null);
  const [error, setError]                   = useState(false);
  const [stage, setStage]                   = useState<Stage>("gift");
  const [locked, setLocked]                 = useState(false);
  const [unlockTs, setUnlockTs]             = useState<number | null>(null);
  const [transitioning, setTransitioning]   = useState(false);

  // Final Wish form states
  const [finalWish, setFinalWish]           = useState("");
  const [wishSubmitted, setWishSubmitted]   = useState(false);

  const jingleRef = useRef<JinglePlayer | null>(null);

  useEffect(() => {
    if (!dataParam) { setError(true); return; }
    try {
      const decoded = decodeURIComponent(
        atob(dataParam).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
      );
      const parsed = JSON.parse(decoded) as WishData;
      if (!parsed.n || !parsed.s || !parsed.m) { setError(true); return; }
      setWishData(parsed);
      if (parsed.dl && Date.now() < parsed.dl) { setLocked(true); setUnlockTs(parsed.dl); }
    } catch { setError(true); }
  }, [dataParam]);

  const transition = (next: Stage) => {
    setTransitioning(true);
    setTimeout(() => { setStage(next); setTransitioning(false); window.scrollTo({ top: 0 }); }, 380);
  };

  // Auto-play the Happy Birthday tune as soon as the cake is shown
  useEffect(() => {
    if (stage === "cake" && wishData) {
      const playJingle = async () => {
        jingleRef.current = new JinglePlayer();
        await jingleRef.current.play({ theme: wishData.t, name: wishData.n });
      };
      playJingle();
    }
  }, [stage, wishData]);

  const handleOpenComplete = () => {
    transition("cake");
    toast("🎂 Time to blow the candles!", { duration: 3000 });
  };

  const handleCelebrationStart = () => {
    transition("final-wish");
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalWish.trim()) return;

    setWishSubmitted(true);
    toast.success("Wish committed to the universe!");
    
    // Confetti on wish submit
    confetti({
      particleCount: 100, spread: 75, origin: { y: 0.55 },
      colors: ["#F59E0B", "#3B82F6", "#818CF8", "#ffffff"],
    });

    if (wishData) {
      jingleRef.current = new JinglePlayer();
      await jingleRef.current.play({ theme: wishData.t, name: wishData.n });
    }

    setTimeout(() => {
      // Transition directly to constellation step
      transition("constellation");
    }, 1500);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${wishData?.n}! 🎂`,
          text: `${wishData?.s} made you an interactive birthday surprise!`,
          url,
        });
      } catch (e: any) {
        if (e.name !== "AbortError") toast.error("Share failed");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "#08090E" }}>
      <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-5 text-red-400">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h1 className="text-xl font-bold text-white mb-2">Invalid surprise link</h1>
      <p className="text-sm text-slate-400 mb-6 max-w-sm font-semibold">This link appears broken. Make sure you copied the full URL.</p>
      <Link href="/create"><button className="btn-primary px-6 py-2.5 text-sm">Create a new page</button></Link>
    </div>
  );

  if (!wishData) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#08090E" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-semibold">Unwrapping…</span>
      </div>
    </div>
  );

  if (locked && unlockTs) return <CountdownLock unlockAt={unlockTs} onUnlock={() => setLocked(false)} />;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{ background: "#08090E" }}>
      <FloatingHearts />
      {stage === "finale" && <Fireworks />}

      {/* Fade transition overlay */}
      {transitioning && (
        <div className="fixed inset-0 z-50 bg-zinc-950" style={{ animation: "reveal-up 0.3s ease both" }} />
      )}

      <div
        className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col justify-between"
        style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.32s ease" }}
      >
        {/* Step Progress Bar */}
        <StepProgressBar
          current={STAGE_INDEX[stage]}
          total={8}
          labels={STEP_LABELS}
        />

        {/* Step 1: The Envelope & Letter */}
        {stage === "gift" && (
          <GiftBoxSurprise
            name={wishData.n}
            sender={wishData.s}
            message={wishData.m}
            theme={wishData.t}
            onOpenComplete={handleOpenComplete}
          />
        )}

        {/* Step 2: Cake Room */}
        {stage === "cake" && (
          <div className="flex flex-col items-center justify-center flex-1 my-auto">
            <div className="w-full max-w-lg glass rounded-3xl p-6 sm:p-10 shadow-2xl bg-white/[0.01]">
              <BirthdayCake name={wishData.n} age={wishData.a} onCelebrationStart={handleCelebrationStart} />
            </div>
          </div>
        )}

        {/* Step 3: Final Wish Input */}
        {stage === "final-wish" && (
          <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full my-auto animate-reveal-up">
            <AnimatePresence mode="wait">
              {!wishSubmitted ? (
                <motion.form
                  key="wish-form"
                  onSubmit={handleWishSubmit}
                  exit={{ y: -80, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeIn" }}
                  className="glass rounded-3xl p-8 border border-white/[0.07] w-full text-center space-y-6 bg-white/[0.01]"
                >
                  <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center mx-auto glow-gold">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">The Final Ritual</span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-1 font-serif italic">Make your birthday wish</h3>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">Write down your wish. It will ascend into the constellation of memories.</p>
                  </div>

                  <textarea
                    required
                    rows={3}
                    value={finalWish}
                    onChange={e => setFinalWish(e.target.value)}
                    placeholder="I wish that..."
                    className="input-saas text-xs leading-relaxed resize-none text-center"
                  />

                  <button type="submit" className="btn-primary w-full py-3.5 text-xs">
                    Release Wish to the Universe ✨
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="ascend"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center space-y-4"
                >
                  <motion.div
                    animate={{ y: -200, opacity: 0, scale: [1, 2, 0] }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-4 h-4 rounded-full bg-amber-400 glow-gold"
                  />
                  <span className="text-xs text-slate-400 font-semibold">Releasing wish…</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Step 4: Interactive Constellation Map */}
        {stage === "constellation" && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="glass rounded-3xl p-5 border border-white/[0.06] bg-white/[0.01]">
              <MemoryStars stars={wishData.st} />
            </div>
            <button
              onClick={() => transition("timeline")}
              className="btn-primary px-6 py-3.5 text-xs flex items-center justify-center gap-2 self-center"
            >
              Continue to Journey Timeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 5: Timeline Cards */}
        {stage === "timeline" && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            {wishData.tl && wishData.tl.length > 0 ? (
              <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.06] bg-white/[0.01]">
                <div className="text-center mb-6">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Our Story</span>
                  <h3 className="text-lg font-bold text-white mt-1 font-serif italic">Relationship Timeline</h3>
                </div>
                <Timeline events={wishData.tl} />
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">No milestones added. Skipping...</div>
            )}
            <button
              onClick={() => transition("memories")}
              className="btn-primary px-6 py-3.5 text-xs flex items-center justify-center gap-2 self-center"
            >
              Continue to Photos Gallery <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 6: Memory Polaroid Gallery */}
        {stage === "memories" && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            {wishData.mm && wishData.mm.length > 0 ? (
              <div className="glass rounded-3xl p-6 sm:p-8 border border-white/[0.06] bg-white/[0.01]">
                <MemoryLane memories={wishData.mm} />
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">No photo uploads attached. Skipping...</div>
            )}
            <button
              onClick={() => transition("balloons")}
              className="btn-primary px-6 py-3.5 text-xs flex items-center justify-center gap-2 self-center"
            >
              Continue to Balloon Pop Game <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 7: Balloon Pop Game */}
        {stage === "balloons" && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="glass rounded-3xl p-5 border border-white/[0.06] bg-white/[0.01] max-w-2xl mx-auto w-full">
              <BalloonGame />
            </div>
            <button
              onClick={() => {
                transition("finale");
                // Final celebration confetti
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              }}
              className="btn-gold px-8 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 self-center"
            >
              Reveal Grand Finale 🎆
            </button>
          </div>
        )}

        {/* Step 8: Grand Fireworks Finale */}
        {stage === "finale" && (
          <div className="flex-1 flex flex-col justify-center items-center my-auto animate-reveal-up">
            <div className="glass rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto flex flex-col items-center glow-gold bg-[#0e0a0a]/40 border border-white/[0.06] relative z-20">
              <div className="w-12 h-12 glass-gold rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-amber-400 fill-current" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 font-serif italic">
                Happy Birthday, {wishData.n}! 🎂
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-semibold uppercase tracking-wider">
                Created with love by {wishData.s}
              </p>
              {finalWish && (
                <p className="text-xs italic text-stone-400 leading-normal mb-8 max-w-sm pl-4 border-l-2 border-amber-500/50">
                  “Your wish is written in the stars: &apos;{finalWish}&apos;”
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <button onClick={handleShare}
                  className="btn-gold px-6 py-3 text-xs flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share surprise link
                </button>
                <Link href="/create">
                  <button className="px-6 py-3 text-xs font-bold rounded-xl glass hover:bg-white/[0.06] text-stone-300 border border-white/[0.06] flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Create another
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      <footer className="relative z-10 border-t border-white/[0.05] py-5 text-center text-[9px] text-slate-600">
        WishMaker — Birthday Surprise Keepsakes &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default function WishPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#08090E" }}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Suspense fallback={null}>
        <WishContent />
      </Suspense>
    </Suspense>
  );
}
