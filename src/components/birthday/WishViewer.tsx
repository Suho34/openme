"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Sparkles, AlertCircle, ArrowRight, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import GiftBoxSurprise from "@/components/birthday/GiftBoxSurprise";
import BalloonGame from "@/components/birthday/BalloonGame";
import MemoryLane from "@/components/birthday/MemoryLane";
import Timeline from "@/components/birthday/Timeline";
import ChapterHeader from "@/components/birthday/ChapterHeader";
import VoiceMemoPlayer from "@/components/birthday/VoiceMemoPlayer";
import ScrollJar from "@/components/birthday/ScrollJar";
import TimeCapsules from "@/components/birthday/TimeCapsules";
import AmbientCanvas from "@/components/ui/AmbientCanvas";
import CountdownLock from "@/components/birthday/CountdownLock";
import RecapCard from "@/components/birthday/RecapCard";
import ReactionKeepsake from "@/components/birthday/ReactionKeepsake";
import { Mp3Player } from "@/lib/mp3Player";
import { defaultTuneFor } from "@/lib/tunes";
import { cacheWishLocally, downloadKeepsakeVault } from "@/lib/offlineVault";
import {
  getSoundMutedServerSnapshot,
  getSoundMutedSnapshot,
  playMatch,
  playPageTurn,
  setSoundMuted,
  subscribeSoundMuted,
} from "@/lib/sfx";
import type { Stage, WishViewerProps } from "@/lib/types";

// Three.js cake and the fireworks canvas are the heaviest pieces of the keepsake:
// load them on the chapters that use them so the first mobile paint stays light.
const BirthdayCake = dynamic(() => import("@/components/birthday/BirthdayCake"), {
  ssr: false,
  loading: () => (
    <div className="h-72 flex items-center justify-center text-sm text-[#6F655E]">
      Preparing the cake&hellip;
    </div>
  ),
});

const Fireworks = dynamic(() => import("@/components/birthday/Fireworks"), {
  ssr: false,
});

const ALL_STAGES: { id: Stage; label: string }[] = [
  { id: "gift", label: "Letter" },
  { id: "cake", label: "Cake" },
  { id: "final-wish", label: "Wish" },
  { id: "scroll-jar", label: "Jar" },
  { id: "memories", label: "Photos" },
  { id: "time-capsules", label: "Capsules" },
  { id: "timeline", label: "Timeline" },
  { id: "balloons", label: "Balloons" },
  { id: "letter", label: "Voice" },
  { id: "finale", label: "Finale" },
];

const CHAPTERS: Record<Stage, { chapter: string; title: string; subtitle?: string }> = {
  gift: { chapter: "Chapter I", title: "The Unspoken Words", subtitle: "Sealed with love from across the miles" },
  cake: { chapter: "Chapter II", title: "Under Candlelight", subtitle: "Whisper your wish and blow out the candles" },
  "final-wish": { chapter: "Chapter III", title: "A Wish for Your Year", subtitle: "What does your heart hope for?" },
  "scroll-jar": { chapter: "Chapter IV", title: "Jar of Little Scrolls", subtitle: "Memories, inside jokes, and reasons" },
  memories: { chapter: "Chapter V", title: "Treasured Moments", subtitle: "Photographs we hold close" },
  "time-capsules": { chapter: "Chapter VI", title: "Open When... Capsules", subtitle: "Comfort notes to keep for your year ahead" },
  timeline: { chapter: "Milestones", title: "Our Story So Far", subtitle: "Milestones we hold close" },
  balloons: { chapter: "Celebration", title: "Floating Wishes", subtitle: "Pop a balloon to reveal a secret" },
  letter: { chapter: "Chapter VII", title: "A Whispered Note", subtitle: "A private recording from across the miles" },
  finale: { chapter: "Finale", title: "Happy Birthday", subtitle: "Made for you, always" },
};

export default function WishViewer({ wishData, wishId, onUnlockRequest }: WishViewerProps) {
  // A voice-only reply has no words to read, so it opens on the recording itself.
  const [stage, setStage] = useState<Stage>(() =>
    wishData.replyTo && !wishData.message && wishData.voiceNoteUrl ? "letter" : "gift",
  );
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [finalWish, setFinalWish] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);

  const prefersReduced = useReducedMotion();

  // localStorage is not available during SSR, so read it through a store.
  const muted = useSyncExternalStore(
    subscribeSoundMuted,
    getSoundMutedSnapshot,
    getSoundMutedServerSnapshot,
  );

  const mp3Ref = useRef<Mp3Player | null>(null);

  const toggleSound = () => setSoundMuted(!muted);

  const unlockAt = useMemo<number | null>(() => {
    if (!wishData.deliveryLock) return null;
    const ts = new Date(wishData.deliveryLock).getTime();
    return Number.isFinite(ts) ? ts : null;
  }, [wishData.deliveryLock]);

  // Only tick the clock while a scheduled lock is actually shown.
  const clockActive = unlockAt !== null;
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    if (!clockActive || isUnlocked) return;
    const id = window.setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [clockActive, isUnlocked]);

  // While the server has withheld the content (wishData.locked), keep showing the
  // countdown even after the clock passes zero, until the refetch lands.
  const contentWithheld = Boolean(wishData.locked);
  const locked =
    clockActive && !isUnlocked && (now * 1000 < unlockAt! || contentWithheld);

  const reactionOnlyReply = Boolean(
    wishData.replyTo && wishData.reaction && !wishData.message,
  );

  const activeStages = useMemo(() => {
    return ALL_STAGES.filter((s) => {
      if (
        s.id === "scroll-jar" &&
        (!wishData.scrollNotes || wishData.scrollNotes.length === 0)
      )
        return false;
      if (
        s.id === "time-capsules" &&
        (!wishData.timeCapsules || wishData.timeCapsules.length === 0)
      )
        return false;
      if (
        s.id === "timeline" &&
        (!wishData.timeline || wishData.timeline.length === 0)
      )
        return false;
      if (
        s.id === "memories" &&
        (!wishData.memories || wishData.memories.length === 0)
      )
        return false;
      if (s.id === "balloons") return false;
      if (s.id === "letter" && !wishData.voiceNoteUrl) return false;
      return true;
    });
  }, [wishData]);

  // The server sends only the countdown data while a wish is locked, so the
  // content has to be fetched again when the countdown ends. Driving it from a
  // timer avoids a race with CountdownLock unmounting on the final tick, which
  // used to leave the viewer showing an empty letter.
  useEffect(() => {
    if (!contentWithheld || unlockAt === null) return;
    const wait = Math.max(0, unlockAt - Date.now());
    const id = window.setTimeout(() => onUnlockRequest?.(), wait + 250);
    return () => window.clearTimeout(id);
  }, [contentWithheld, unlockAt, onUnlockRequest]);

  const getNextStage = (currentId: Stage): Stage => {
    const currentIndex = activeStages.findIndex((s) => s.id === currentId);
    if (currentIndex >= 0 && currentIndex < activeStages.length - 1) {
      return activeStages[currentIndex + 1].id;
    }
    return "finale";
  };

  const transition = (next: Stage) => {
    if (prefersReduced) {
      setStage(next);
      window.scrollTo({ top: 0 });
      return;
    }
    playPageTurn();
    setTransitioning(true);
    setTimeout(() => {
      setStage(next);
      setTransitioning(false);
      window.scrollTo({ top: 0 });
    }, 420);
  };

  useEffect(() => {
    if (stage === "cake") playMatch();
  }, [stage]);

  useEffect(() => {
    if (stage === "finale" && wishData) {
      void cacheWishLocally(wishId || wishData.name, wishData);
      const tune = wishData.tuneUrl || defaultTuneFor(wishData.theme).src;
      const playTune = async () => {
        mp3Ref.current?.stop();
        const player = new Mp3Player();
        mp3Ref.current = player;
        await player.play(tune);
      };
      playTune();
      return () => {
        mp3Ref.current?.stop();
        mp3Ref.current = null;
      };
    }
  }, [stage, wishData, wishId]);

  useEffect(() => {
    if (stage === "finale") {
      const delay = prefersReduced ? 2500 : 8000;
      const timer = setTimeout(() => setShowFinalCard(true), delay);
      return () => clearTimeout(timer);
    }
  }, [stage, prefersReduced]);

  const handleOpenComplete = () => {
    transition("cake");
    toast("Time to blow the candles!");
  };

  const handleCelebrationStart = () => {
    transition("final-wish");
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalWish.trim()) return;
    setWishSubmitted(true);
    toast.success("Wish committed to the universe!");
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#B05463", "#D8B88A", "#A6B39D", "#FFFFFF"],
    });
    setTimeout(() => transition(getNextStage("final-wish")), 1500);
  };

  if (locked && unlockAt)
    return (
      <CountdownLock
        unlockAt={unlockAt}
        onUnlock={() => setIsUnlocked(true)}
        sender={wishData.sender}
        name={wishData.name}
      />
    );

  return (
    <MotionConfig reducedMotion="user">
    <div
      className="relative min-h-screen flex flex-col overflow-x-hidden"
      style={{
        background:
          stage === "finale" && !showFinalCard ? "#000000" : "#FFF8F2",
      }}
    >
      {!prefersReduced && <AmbientCanvas />}
      {stage === "finale" && !prefersReduced && <Fireworks name={wishData.name} />}

      {transitioning && <div className="page-turn-overlay" aria-hidden />}

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        className="fixed bottom-4 left-4 z-40 w-9 h-9 rounded-full bg-white/85 backdrop-blur border border-[#ECE3DA] flex items-center justify-center text-[#7A6F62] hover:text-[#8B2635] shadow-xs cursor-pointer"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <div
        className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col justify-between"
        style={{
          opacity: transitioning ? 0 : 1,
          transition: prefersReduced ? "none" : "opacity 0.32s ease",
        }}
      >
        {stage !== "finale" && CHAPTERS[stage] && (
          <ChapterHeader
            chapter={CHAPTERS[stage].chapter}
            title={CHAPTERS[stage].title}
            subtitle={CHAPTERS[stage].subtitle}
          />
        )}

        {wishData.replyTo && stage === "gift" && (
          <p className="mb-4 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#8B2635]">
            {wishData.sender} sent this one back to you
          </p>
        )}

        {stage === "gift" &&
          (reactionOnlyReply ? (
            <ReactionKeepsake
              name={wishData.name}
              sender={wishData.sender}
              reaction={wishData.reaction}
              onProceed={() => transition("finale")}
            />
          ) : (
            <GiftBoxSurprise
              name={wishData.name}
              sender={wishData.sender}
              message={wishData.message}
              theme={wishData.theme}
              letterFont={wishData.letterFont}
              onOpenComplete={handleOpenComplete}
            />
          ))}

        {stage === "cake" && (
          <div className="flex flex-col items-center justify-center flex-1 my-auto">
            <div className="w-full max-w-lg surface rounded-[1.75rem] p-6 sm:p-10">
              <BirthdayCake
                name={wishData.name}
                age={wishData.age}
                tuneUrl={wishData.tuneUrl}
                cakeStyle={wishData.cakeStyle}
                onCelebrationStart={handleCelebrationStart}
              />
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
                  <div
                    className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#E3D4B8] flex items-center justify-center mx-auto"
                    style={{ boxShadow: "0 2px 8px rgba(46,42,39,0.04)" }}
                  >
                    <Sparkles className="w-5 h-5 text-[#8B2635]" />
                  </div>
                  <div>
                    <span className="text-[0.6875rem] text-[#8B2635] font-semibold uppercase tracking-[0.15em]">
                      A Wish for Your Year
                    </span>
                    <h3
                      className="font-serif text-[1.625rem] text-[#2A231F] mt-1"
                      style={{ fontWeight: 400, fontStyle: "italic" }}
                    >
                      Make your birthday wish
                    </h3>
                    <p className="text-[0.8125rem] text-[#6F655E] mt-1.5 max-w-xs mx-auto">
                      Write down your secret wish. It will ascend into the
                      constellation of memories.
                    </p>
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={finalWish}
                    onChange={(e) => setFinalWish(e.target.value)}
                    placeholder="I wish that..."
                    aria-label="Write your birthday wish"
                    className="input-saas text-sm leading-relaxed resize-none text-center"
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full py-3.5 text-sm"
                  >
                    Release Wish to the Universe
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
                    className="w-4 h-4 rounded-full bg-[#8B2635]"
                  />
                  <span className="text-sm text-[#6F655E]">
                    Releasing wish&hellip;
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {stage === "scroll-jar" &&
          wishData.scrollNotes &&
          wishData.scrollNotes.length > 0 && (
            <ScrollJar
              scrolls={wishData.scrollNotes}
              title={wishData.scrollJarTitle}
              senderName={wishData.sender}
              onComplete={() => transition(getNextStage("scroll-jar"))}
            />
          )}

        {stage === "timeline" &&
          wishData.timeline &&
          wishData.timeline.length > 0 && (
            <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
              <div className="surface rounded-[1.75rem] p-6 sm:p-8">
                <div className="text-center mb-6">
                  <span className="text-[0.6875rem] font-semibold text-[#B05463] uppercase tracking-[0.15em]">
                    Our Story
                  </span>
                  <h3
                    className="font-serif text-[1.5rem] text-[#2E2A27] mt-1"
                    style={{ fontWeight: 400, fontStyle: "italic" }}
                  >
                    Relationship Timeline
                  </h3>
                </div>
                <Timeline events={wishData.timeline} />
              </div>
              <button
                onClick={() => transition(getNextStage("timeline"))}
                className="btn-primary px-6 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 self-center"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        {stage === "memories" &&
          wishData.memories &&
          wishData.memories.length > 0 && (
            <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
              <div className="surface rounded-[1.75rem] p-6 sm:p-8">
                <MemoryLane memories={wishData.memories} />
              </div>
              <button
                onClick={() => transition(getNextStage("memories"))}
                className="btn-primary px-6 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 self-center"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        {stage === "time-capsules" &&
          wishData.timeCapsules &&
          wishData.timeCapsules.length > 0 && (
            <TimeCapsules
              capsules={wishData.timeCapsules}
              senderName={wishData.sender}
              recipientName={wishData.name}
              onComplete={() => transition(getNextStage("time-capsules"))}
            />
          )}

        {stage === "balloons" && (
          <div className="flex flex-col justify-between flex-1 animate-reveal-up space-y-6">
            <div className="surface rounded-[1.75rem] p-5 max-w-2xl mx-auto w-full">
              <BalloonGame />
            </div>
            <button
              onClick={() => transition(getNextStage("balloons"))}
              className="btn-primary px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 self-center"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {stage === "letter" && wishData.voiceNoteUrl && (
          <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full my-auto animate-reveal-up space-y-8">
            <VoiceMemoPlayer
              voiceNoteUrl={wishData.voiceNoteUrl}
              sender={wishData.sender}
            />
            <button
              onClick={() => {
                transition("finale");
                confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ["#8B2635", "#C5A059", "#FAF6F0", "#3B271E"],
                });
              }}
              className="btn-primary px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              Reveal Grand Finale <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {stage === "finale" && (
          <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pb-10 my-auto space-y-8">
            <AnimatePresence>
              {showFinalCard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="w-full max-w-md mx-auto"
                >
                  <RecapCard
                    name={wishData.name}
                    sender={wishData.sender}
                    wishId={wishId}
                    expiresAt={wishData.expiresAt}
                    onDownloadVault={() => downloadKeepsakeVault(wishData)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <footer className="relative z-10 border-t border-[#ECE3DA] py-5 text-center text-[0.75rem] text-[#7A6F62]">
        WishMaker &mdash; Birthday Surprise Keepsakes &copy;{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
    </MotionConfig>
  );
}

export function ErrorView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FFF8F2]">
      <div
        className="w-14 h-14 rounded-2xl bg-white border border-[#ECE3DA] flex items-center justify-center mb-6"
        style={{ boxShadow: "0 2px 12px rgba(46,42,39,0.04)" }}
      >
        <AlertCircle className="w-7 h-7 text-[#C46D5E]" />
      </div>
      <h1
        className="font-serif text-2xl text-[#2E2A27] mb-2"
        style={{ fontWeight: 500 }}
      >
        Invalid surprise link
      </h1>
      <p className="text-[0.9375rem] text-[#6F655E] mb-8 max-w-sm">
        This link appears broken. Make sure you copied the full URL.
      </p>
      <Link href="/create">
        <button className="btn-primary px-6 py-3 text-sm">
          Create a new surprise
        </button>
      </Link>
    </div>
  );
}

export function LoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#B05463] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#6F655E]">Unwrapping&hellip;</span>
      </div>
    </div>
  );
}
