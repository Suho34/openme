"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Sparkles, AlertCircle, Plus, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import GiftBoxSurprise from "@/components/birthday/GiftBoxSurprise";
import BirthdayCake from "@/components/birthday/BirthdayCake";
import BalloonGame from "@/components/birthday/BalloonGame";
import MemoryLane from "@/components/birthday/MemoryLane";
import Fireworks from "@/components/birthday/Fireworks";
import DoodleAnimation from "@/components/birthday/DoodleAnimation";
import Timeline, { TimelineEvent } from "@/components/birthday/Timeline";
import StepProgressBar from "@/components/ui/StepProgressBar";
import { JinglePlayer } from "@/lib/jingle";
import AmbientCanvas from "@/components/ui/AmbientCanvas";

interface Memory { url: string; caption: string; }

interface StarMemory {
  id: number;
  label: string;
  date: string;
  description: string;
  x: number;
  y: number;
}

interface WishData {
  n:  string;
  a?: number;
  s:  string;
  m:  string;
  t:  string;
  mm?: Memory[];
  dl?: number;
  tl?: TimelineEvent[];
  st?: StarMemory[];
  dt?: "heart" | "rose" | "hearts" | "coffee";
  demo?: boolean;
}

type Stage = "gift" | "cake" | "final-wish" | "doodle" | "timeline" | "memories" | "balloons" | "finale";

const ALL_STAGES: { id: Stage; label: string }[] = [
  { id: "gift", label: "Open" },
  { id: "cake", label: "Blow" },
  { id: "final-wish", label: "Wish" },
  { id: "doodle", label: "Doodle" },
  { id: "timeline", label: "Timeline" },
  { id: "memories", label: "Photos" },
  { id: "balloons", label: "Balloons" },
  { id: "finale", label: "Finale" },
];

// ── Feature C: Countdown Lock — Warm editorial style ──
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
          It unlocks automatically — return on your birthday! 🎂
        </p>
      </div>
    </div>
  );
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
  const [showFinalCard, setShowFinalCard]   = useState(false);

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

  const activeStages = React.useMemo(() => {
    if (!wishData) return ALL_STAGES;
    return ALL_STAGES.filter(s => {
      if (wishData.demo) {
        return s.id === "gift" || s.id === "cake" || s.id === "finale";
      }
      if (s.id === "doodle" && !wishData.dt) return false;
      if (s.id === "timeline" && (!wishData.tl || wishData.tl.length === 0)) return false;
      if (s.id === "memories" && (!wishData.mm || wishData.mm.length === 0)) return false;
      return true;
    });
  }, [wishData]);

  const stepLabels = activeStages.map(s => s.label);
  const currentStepIndex = activeStages.findIndex(s => s.id === stage);
  const totalSteps = activeStages.length;

  const getNextStage = (currentId: Stage): Stage => {
    const currentIndex = activeStages.findIndex(s => s.id === currentId);
    if (currentIndex >= 0 && currentIndex < activeStages.length - 1) {
      return activeStages[currentIndex + 1].id;
    }
    return "finale";
  };

  const transition = (next: Stage) => {
    setTransitioning(true);
    setTimeout(() => { setStage(next); setTransitioning(false); window.scrollTo({ top: 0 }); }, 380);
  };

  // Auto-play the Happy Birthday tune as soon as the finale starts
  useEffect(() => {
    if (stage === "finale" && wishData) {
      const playJingle = async () => {
        jingleRef.current = new JinglePlayer();
        await jingleRef.current.play({ theme: wishData.t, name: wishData.n });
      };
      playJingle();
    }
  }, [stage, wishData]);

  // Set up grand finale black screen cinematic transition timer
  useEffect(() => {
    if (stage === "finale") {
      const timer = setTimeout(() => {
        setShowFinalCard(true);
      }, 8000); // Wait 8 seconds before showing final buttons
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleOpenComplete = () => {
    transition("cake");
    toast("🎂 Time to blow the candles!", { duration: 3000 });
  };

  const handleCelebrationStart = () => {
    if (wishData?.demo) {
      transition("finale");
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#C97B84", "#D8B88A", "#A6B39D", "#FFFFFF"] });
    } else {
      transition("final-wish");
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalWish.trim()) return;

    setWishSubmitted(true);
    toast.success("Wish committed to the universe!");
    
    // Confetti on wish submit
    confetti({
      particleCount: 100, spread: 75, origin: { y: 0.55 },
      colors: ["#C97B84", "#D8B88A", "#A6B39D", "#FFFFFF"],
    });

    setTimeout(() => {
      transition(getNextStage("final-wish"));
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FFF8F2]">
      <div className="w-14 h-14 rounded-2xl bg-white border border-[#ECE3DA] flex items-center justify-center mb-6"
        style={{ boxShadow: "0 2px 12px rgba(46,42,39,0.04)" }}>
        <AlertCircle className="w-7 h-7 text-[#C46D5E]" />
      </div>
      <h1 className="font-serif text-2xl text-[#2E2A27] mb-2" style={{ fontWeight: 500 }}>Invalid surprise link</h1>
      <p className="text-[0.9375rem] text-[#6F655E] mb-8 max-w-sm">This link appears broken. Make sure you copied the full URL.</p>
      <Link href="/create"><button className="btn-primary px-6 py-3 text-sm">Create a new surprise</button></Link>
    </div>
  );

  if (!wishData) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C97B84] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#6F655E]">Unwrapping…</span>
      </div>
    </div>
  );

  if (locked && unlockTs) return <CountdownLock unlockAt={unlockTs} onUnlock={() => setLocked(false)} />;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{ background: stage === "finale" && !showFinalCard ? "#000000" : "#FFF8F2" }}>
      <AmbientCanvas />
      {stage === "finale" && <Fireworks name={wishData.n} />}

      {/* Fade transition overlay */}
      {transitioning && (
        <div className="fixed inset-0 z-50 bg-[#FFF8F2]" style={{ animation: "reveal-up 0.3s ease both" }} />
      )}

      <div
        className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col justify-between"
        style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.32s ease" }}
      >
        <StepProgressBar
          current={Math.max(0, currentStepIndex)}
          total={totalSteps}
          labels={stepLabels}
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
            <div className="w-full max-w-lg surface rounded-[1.75rem] p-6 sm:p-10">
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
                  className="surface rounded-[1.75rem] p-8 w-full text-center space-y-6"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F9F5F0] border border-[#ECE3DA] flex items-center justify-center mx-auto"
                    style={{ boxShadow: "0 2px 8px rgba(46,42,39,0.04)" }}>
                    <Sparkles className="w-5 h-5 text-[#C97B84]" />
                  </div>
                  
                  <div>
                    <span className="text-[0.6875rem] text-[#C97B84] font-semibold uppercase tracking-[0.15em]">The Final Ritual</span>
                    <h3 className="font-serif text-[1.5rem] text-[#2E2A27] mt-1" style={{ fontWeight: 400, fontStyle: "italic" }}>Make your birthday wish</h3>
                    <p className="text-[0.8125rem] text-[#6F655E] mt-1.5 max-w-xs mx-auto">Write down your wish. It will ascend into the constellation of memories.</p>
                  </div>

                  <textarea
                    required
                    rows={3}
                    value={finalWish}
                    onChange={e => setFinalWish(e.target.value)}
                    placeholder="I wish that..."
                    className="input-saas text-sm leading-relaxed resize-none text-center"
                  />

                  <button type="submit" className="btn-primary w-full py-3.5 text-sm">
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
                    className="w-4 h-4 rounded-full bg-[#C97B84]"
                  />
                  <span className="text-sm text-[#6F655E]">Releasing wish…</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Step 4: Interactive Doodle Animation */}
        {stage === "doodle" && wishData.dt && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <DoodleAnimation name={wishData.n} type={wishData.dt} />
            <button
              onClick={() => transition(getNextStage("doodle"))}
              className="btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 self-center"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 5: Timeline Cards */}
        {stage === "timeline" && wishData.tl && wishData.tl.length > 0 && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-[0.6875rem] font-semibold text-[#C97B84] uppercase tracking-[0.15em]">Our Story</span>
                <h3 className="font-serif text-[1.5rem] text-[#2E2A27] mt-1" style={{ fontWeight: 400, fontStyle: "italic" }}>Relationship Timeline</h3>
              </div>
              <Timeline events={wishData.tl} />
            </div>
            <button
              onClick={() => transition(getNextStage("timeline"))}
              className="btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 self-center"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 6: Memory Polaroid Gallery */}
        {stage === "memories" && wishData.mm && wishData.mm.length > 0 && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-6 sm:p-8">
              <MemoryLane memories={wishData.mm} />
            </div>
            <button
              onClick={() => transition(getNextStage("memories"))}
              className="btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 self-center"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 7: Balloon Pop Game */}
        {stage === "balloons" && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-5 max-w-2xl mx-auto w-full">
              <BalloonGame />
            </div>
            <button
              onClick={() => {
                transition("finale");
                // Final celebration confetti
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#C97B84", "#D8B88A", "#A6B39D", "#FFFFFF"] });
              }}
              className="btn-gold px-8 py-4 text-sm font-semibold flex items-center justify-center gap-2 self-center"
            >
              Reveal Grand Finale 🎆
            </button>
          </div>
        )}

        {/* Step 8: Grand Fireworks Finale */}
        {stage === "finale" && (
          <div className="flex-1 flex flex-col justify-end items-center mb-10 relative z-20">
            <AnimatePresence>
              {showFinalCard && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <Link href="/create">
                    <button className="px-5 py-2.5 text-xs font-semibold rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/60 transition-colors flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Create another surprise
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

      <footer className="relative z-10 border-t border-[#ECE3DA] py-5 text-center text-[0.75rem] text-[#B5ADA5]">
        WishMaker — Birthday Surprise Keepsakes &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default function WishPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
        <div className="w-8 h-8 border-2 border-[#C97B84] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Suspense fallback={null}>
        <WishContent />
      </Suspense>
    </Suspense>
  );
}
