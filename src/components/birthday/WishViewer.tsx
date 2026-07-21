"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Sparkles, AlertCircle, Plus, ArrowRight } from "lucide-react";
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
import Timeline from "@/components/birthday/Timeline";
import TriviaGame from "@/components/birthday/TriviaGame";
import StepProgressBar from "@/components/ui/StepProgressBar";
import AmbientCanvas from "@/components/ui/AmbientCanvas";
import CountdownLock from "@/components/birthday/CountdownLock";
import { JinglePlayer } from "@/lib/jingle";
import type { WishData, Stage } from "@/lib/types";

const ALL_STAGES: { id: Stage; label: string }[] = [
  { id: "gift", label: "Open" },
  { id: "cake", label: "Blow" },
  { id: "final-wish", label: "Wish" },
  { id: "doodle", label: "Doodle" },
  { id: "timeline", label: "Timeline" },
  { id: "memories", label: "Photos" },
  { id: "trivia", label: "Trivia" },
  { id: "balloons", label: "Balloons" },
  { id: "letter", label: "Letter" },
  { id: "finale", label: "Finale" },
];

interface WishViewerProps {
  wishData: WishData;
}

export default function WishViewer({ wishData }: WishViewerProps) {
  const [stage, setStage] = useState<Stage>("gift");
  const [locked, setLocked] = useState(false);
  const [unlockTs, setUnlockTs] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [finalWish, setFinalWish] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);

  const jingleRef = useRef<JinglePlayer | null>(null);

  useEffect(() => {
    if (wishData.deliveryLock) {
      const ts = new Date(wishData.deliveryLock).getTime();
      if (Date.now() < ts) {
        setLocked(true);
        setUnlockTs(ts);
      }
    }
  }, [wishData]);

  const activeStages = useMemo(() => {
    if (wishData.demo) {
      return ALL_STAGES.filter(s => ["gift", "cake", "letter", "finale"].includes(s.id));
    }
    return ALL_STAGES.filter(s => {
      if (s.id === "doodle" && (!wishData.doodleType || wishData.doodleType === "heart")) return false;
      if (s.id === "timeline" && (!wishData.timeline || wishData.timeline.length === 0)) return false;
      if (s.id === "memories" && (!wishData.memories || wishData.memories.length === 0)) return false;
      if (s.id === "trivia" && (!wishData.trivia || wishData.trivia.length === 0)) return false;
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

  useEffect(() => {
    if (stage === "finale" && wishData) {
      const playJingle = async () => {
        jingleRef.current = new JinglePlayer();
        await jingleRef.current.play({ theme: wishData.theme, name: wishData.name });
      };
      playJingle();
    }
  }, [stage, wishData]);

  useEffect(() => {
    if (stage === "finale") {
      const timer = setTimeout(() => setShowFinalCard(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleOpenComplete = () => {
    transition("cake");
    toast("🎂 Time to blow the candles!", { duration: 3000 });
  };

  const handleCelebrationStart = () => {
    if (wishData.demo) {
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
    confetti({
      particleCount: 100, spread: 75, origin: { y: 0.55 },
      colors: ["#C97B84", "#D8B88A", "#A6B39D", "#FFFFFF"],
    });
    setTimeout(() => transition(getNextStage("final-wish")), 1500);
  };

  if (locked && unlockTs) return <CountdownLock unlockAt={unlockTs} onUnlock={() => setLocked(false)} />;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{ background: stage === "finale" && !showFinalCard ? "#000000" : "#FFF8F2" }}>
      <AmbientCanvas />
      {stage === "finale" && <Fireworks name={wishData.name} />}

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

        {stage === "gift" && (
          <GiftBoxSurprise
            name={wishData.name}
            sender={wishData.sender}
            message={wishData.message}
            theme={wishData.theme}
            onOpenComplete={handleOpenComplete}
          />
        )}

        {stage === "cake" && (
          <div className="flex flex-col items-center justify-center flex-1 my-auto">
            <div className="w-full max-w-lg surface rounded-[1.75rem] p-6 sm:p-10">
              <BirthdayCake name={wishData.name} age={wishData.age} onCelebrationStart={handleCelebrationStart} />
            </div>
          </div>
        )}

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
                    required rows={3} value={finalWish}
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
                  <span className="text-sm text-[#6F655E]">Releasing wish&hellip;</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {stage === "doodle" && wishData.doodleType && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <DoodleAnimation name={wishData.name} type={wishData.doodleType} />
            <button onClick={() => transition(getNextStage("doodle"))}
              className="btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 self-center">
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {stage === "timeline" && wishData.timeline && wishData.timeline.length > 0 && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-[0.6875rem] font-semibold text-[#C97B84] uppercase tracking-[0.15em]">Our Story</span>
                <h3 className="font-serif text-[1.5rem] text-[#2E2A27] mt-1" style={{ fontWeight: 400, fontStyle: "italic" }}>Relationship Timeline</h3>
              </div>
              <Timeline events={wishData.timeline} />
            </div>
            <button onClick={() => transition(getNextStage("timeline"))}
              className="btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 self-center">
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {stage === "memories" && wishData.memories && wishData.memories.length > 0 && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-6 sm:p-8">
              <MemoryLane memories={wishData.memories} />
            </div>
            <button onClick={() => transition(getNextStage("memories"))}
              className="btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 self-center">
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {stage === "trivia" && wishData.trivia && wishData.trivia.length > 0 && (
          <div className="flex flex-col justify-center flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-5 max-w-2xl mx-auto w-full">
              <TriviaGame trivia={wishData.trivia} onComplete={() => transition(getNextStage("trivia"))} />
            </div>
          </div>
        )}

        {stage === "balloons" && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-5 max-w-2xl mx-auto w-full">
              <BalloonGame />
            </div>
            <button onClick={() => transition(getNextStage("balloons"))}
              className="btn-primary px-8 py-4 text-sm font-semibold flex items-center justify-center gap-2 self-center">
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {stage === "letter" && (
          <div className="flex flex-col items-center justify-center flex-1 max-w-xl mx-auto w-full my-auto animate-reveal-up perspective-[1000px] select-none">
            <div className="surface p-8 rounded-[2rem] w-full max-w-md mx-auto flex flex-col items-center justify-center mb-8 shadow-sm">
              {wishData.voiceNoteUrl ? (
                <div className="animate-reveal-up delay-[500ms] w-full flex flex-col items-center">
                  <p className="font-serif text-lg text-[#2E2A27] mb-4">A voice note for you:</p>
                  <audio src={wishData.voiceNoteUrl} controls className="w-full h-10 rounded opacity-90" />
                </div>
              ) : (
                <p className="font-cursive text-xl text-[#2E2A27] animate-reveal-up delay-[500ms]">
                  (A secret message awaits&hellip;)
                </p>
              )}
              <p className="font-cursive text-lg text-[#6F655E] mt-6 animate-reveal-up delay-[1000ms]">
                With love, {wishData.sender}
              </p>
            </div>
            <button onClick={() => { transition("finale"); confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#C97B84", "#D8B88A", "#A6B39D", "#FFFFFF"] }); }}
              className="btn-gold px-8 py-4 text-sm font-semibold flex items-center justify-center gap-2 mt-20 animate-reveal-up delay-[1500ms]">
              Reveal Grand Finale 🎆
            </button>
          </div>
        )}

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
        WishMaker &mdash; Birthday Surprise Keepsakes &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export function ErrorView() {
  return (
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
}

export function LoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C97B84] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#6F655E]">Unwrapping&hellip;</span>
      </div>
    </div>
  );
}
