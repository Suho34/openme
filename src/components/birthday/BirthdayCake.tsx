"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Wind } from "lucide-react";
import {
  playCandleBlow,
  playConfettiPop,
  HappyBirthdayPlayer,
  MicBlowDetector,
} from "@/lib/audio";
import { Mp3Player } from "@/lib/mp3Player";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Cake3D from "./Cake3D";
import PhotoMoment from "./PhotoMoment";
import type { BirthdayCakeProps } from "@/lib/types";

export default function BirthdayCake({
  name,
  age,
  tuneUrl,
  cakeStyle,
  onStat,
  onCelebrationStart,
}: BirthdayCakeProps) {
  // Always 5 candles as requested
  const numCandles = 5;

  const [candlesLit, setCandlesLit] = useState<boolean[]>([]);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [songPlaying, setSongPlaying] = useState(false);
  const [celebrationFired, setCelebrationFired] = useState(false);
  const [blowReady, setBlowReady] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);

  const micDetectorRef = useRef<MicBlowDetector | null>(null);
  const songPlayerRef = useRef<HappyBirthdayPlayer | null>(null);
  const mp3Ref = useRef<Mp3Player | null>(null);
  const blowsRef = useRef(0);
  const micUsedRef = useRef(false);

  // Initialize candles state and play song on cake reveal
  useEffect(() => {
    setCandlesLit(Array(numCandles).fill(true));

    if (tuneUrl) {
      mp3Ref.current = new Mp3Player();
      mp3Ref.current.play(tuneUrl).then(() => {
        setSongPlaying(mp3Ref.current?.playing ?? false);
      });
    } else {
      songPlayerRef.current = new HappyBirthdayPlayer();
      songPlayerRef.current.play();
      setSongPlaying(true);
    }

    // Reveal blow instructions after the melody has had a moment
    const readyTimer = setTimeout(() => setBlowReady(true), 6000);

    return () => {
      clearTimeout(readyTimer);
      if (micDetectorRef.current) {
        micDetectorRef.current.stop();
      }
      if (mp3Ref.current) {
        mp3Ref.current.stop();
      }
      if (songPlayerRef.current) {
        songPlayerRef.current.stop();
      }
    };
  }, [numCandles, tuneUrl]); // Click handler to blow out individual candles

  // Click handler to blow out individual candles
  const handleCandleClick = (index: number) => {
    if (candlesLit[index]) {
      blowsRef.current += 1;
      if (typeof window !== "undefined" && navigator.vibrate) {
        navigator.vibrate(35);
      }
      setCandlesLit((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
      playCandleBlow();
    }
  };

  // Check if all candles are blown out
  useEffect(() => {
    if (
      candlesLit.length > 0 &&
      candlesLit.every((lit) => !lit) &&
      !celebrationFired
    ) {
      setCelebrationFired(true);
      triggerCelebration();
    }
  }, [candlesLit, celebrationFired]);

  // Toggle mic blow detection
  const toggleMicrophone = async () => {
    if (micActive) {
      if (micDetectorRef.current) {
        micDetectorRef.current.stop();
        micDetectorRef.current = null;
      }
      setMicActive(false);
      setMicVolume(0);
    } else {
      const detector = new MicBlowDetector(
        // Callback when blow is detected
        () => {
          extinguishNextCandle();
        },
        // Callback for volume feedback
        (volume) => {
          setMicVolume(volume);
        },
      );

      const success = await detector.start();
      if (success) {
        micDetectorRef.current = detector;
        micUsedRef.current = true;
        setMicActive(true);
      } else {
        toast.error(
          "Could not access your microphone. You can still tap the candles on the cake.",
        );
      }
    }
  };

  // Extinguish the next available candle
  const extinguishNextCandle = () => {
    setCandlesLit((prev) => {
      const firstLitIdx = prev.findIndex((lit) => lit);
      if (firstLitIdx !== -1) {
        blowsRef.current += 1;
        playCandleBlow();
        const next = [...prev];
        next[firstLitIdx] = false;
        return next;
      }
      return prev;
    });
  };

  // Celebration trigger
  const triggerCelebration = () => {
    if (micDetectorRef.current) {
      micDetectorRef.current.stop();
      micDetectorRef.current = null;
      setMicActive(false);
      setMicVolume(0);
    }

    if (mp3Ref.current && tuneUrl) {
      mp3Ref.current.play(tuneUrl);
      setSongPlaying(true);
    } else if (songPlayerRef.current) {
      songPlayerRef.current.play();
      setSongPlaying(true);
    }

    playConfettiPop();

    // Trigger full fireworks/confetti splash
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Offer a keepsake photo moment before moving on
    setPhotoOpen(true);
  };

  const handlePhotoDone = () => {
    setPhotoOpen(false);
    onStat?.({
      candlesTries: blowsRef.current,
      usedMicrophone: micUsedRef.current,
    });
    onCelebrationStart();
  };

  const toggleSong = () => {
    if (songPlaying) {
      mp3Ref.current?.stop();
      songPlayerRef.current?.stop();
      setSongPlaying(false);
    } else {
      if (mp3Ref.current && tuneUrl) {
        mp3Ref.current.play(tuneUrl);
      } else {
        songPlayerRef.current?.play();
      }
      setSongPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 w-full max-w-lg mx-auto select-none">
      {/* Celebration Titles */}
      {celebrationFired ? (
        <div className="text-center mb-6 animate-reveal-scale">
          <h2 className="text-3xl font-serif font-normal italic text-[#B05463] flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-[#B05463]" />
            Make a Wish, {name}!
            <Sparkles className="w-6 h-6 text-[#B05463]" />
          </h2>
          <p className="text-xs text-[#6F655E] mt-1">
            Your magical birthday wishes are in motion...
          </p>
        </div>
      ) : (
        <div className="text-center mb-4">
          {blowReady ? (
            <>
              <h2 className="text-2xl font-serif text-[#2E2A27]">
                Blow out the candles!
              </h2>
              <p className="text-xs text-[#6F655E] mt-1">
                Use your microphone, or tap each candle on the cake.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-serif text-[#2E2A27]">
                Here&apos;s your cake
              </h2>
              <p className="text-xs text-[#6F655E] mt-1">
                Listen to the music&hellip; a surprise is coming.
              </p>
            </>
          )}
        </div>
      )}

      {/* 3D WebGL Cake Area — Candlelight & Linen Walnut Setting */}
      <div
        className="relative w-full max-w-md h-84 sm:h-96 flex items-center justify-center mb-6 rounded-2xl overflow-hidden"
        style={{
          background: "radial-gradient(circle at 50% 45%, #3B271E 0%, #261610 65%, #150B07 100%)",
          border: "1px solid rgba(197, 160, 89, 0.35)",
          boxShadow:
            "0 20px 45px -10px rgba(38, 22, 16, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {candlesLit.length > 0 && (
          <Cake3D
            numCandles={numCandles}
            candlesLit={candlesLit}
            onCandleClick={handleCandleClick}
            cakeStyle={cakeStyle}
          />
        )}

        {/* Dual Extinguish Instructions Overlay */}
        {!celebrationFired && (
          <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none px-4">
            <span className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[10px] uppercase tracking-wider text-[#EADDC9] font-medium border border-white/10">
              Tap flame or blow into microphone
            </span>
          </div>
        )}
      </div>

      {/* Controllers */}
      <div className="flex flex-col gap-3 w-full px-4">
        {!celebrationFired && blowReady && (
          <Button
            type="button"
            variant="outline"
            onClick={toggleMicrophone}
            className={`flex items-center justify-center gap-2 rounded-xl py-4 border border-stone-300 hover:bg-white/[0.2] h-auto text-sm font-bold transition-all duration-300 cursor-pointer ${
              micActive
                ? "bg-[#B05463]/[0.06] border-[#B05463]/20 text-[#B05463] hover:text-[#AD4E58] ring-4 ring-[#B05463]/10"
                : "bg-white/[0.6] text-[#2E2A27]"
            }`}
          >
            {micActive ? (
              <>
                <Mic className="w-4 h-4 animate-pulse text-[#B05463]" />
                <span>Blowing Microphone Active...</span>
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 text-[#7C6E70]" />
                <span>Enable Microphone Blow</span>
              </>
            )}
          </Button>
        )}

        {/* Level indicator */}
        {micActive && !celebrationFired && (
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden flex items-center border border-stone-300">
            <div
              style={{ width: `${micVolume}%` }}
              className="h-full bg-gradient-to-r from-[#D8B88A] to-[#B05463] transition-all duration-75"
            />
          </div>
        )}

        {/* Music Player */}
        {celebrationFired && (
          <Button
            type="button"
            variant="outline"
            onClick={toggleSong}
            className="flex items-center justify-center gap-2 rounded-xl py-4 border border-stone-300 bg-white/[0.6] hover:bg-white/[0.8] text-[#2E2A27] h-auto text-sm font-bold cursor-pointer"
          >
            {songPlaying ? (
              <>
                <Volume2 className="w-5 h-5 text-[#B05463]" />
                <span>Stop Birthday Song</span>
              </>
            ) : (
              <>
                <VolumeX className="w-5 h-5 text-[#7C6E70]" />
                <span>Play Birthday Song</span>
              </>
            )}
          </Button>
        )}
      </div>

      <PhotoMoment
        open={photoOpen}
        name={name}
        onClose={handlePhotoDone}
        onFinished={handlePhotoDone}
      />
    </div>
  );
}
