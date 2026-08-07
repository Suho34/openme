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
import type { BirthdayCakeProps } from "@/lib/types";

export default function BirthdayCake({
  name,
  age,
  tuneUrl,
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

  const micDetectorRef = useRef<MicBlowDetector | null>(null);
  const songPlayerRef = useRef<HappyBirthdayPlayer | null>(null);
  const mp3Ref = useRef<Mp3Player | null>(null);

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
          <h2 className="text-3xl font-serif font-normal italic text-[#C97B84] flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-[#C97B84]" />
            Make a Wish, {name}!
            <Sparkles className="w-6 h-6 text-[#C97B84]" />
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

      {/* 3D WebGL Cake Area */}
      <div className="relative w-full max-w-sm h-80 sm:h-96 flex items-center justify-center mb-6 bg-[#FFF8F2] rounded-2xl border border-[#ECE3DA] overflow-hidden shadow-inner">
        {candlesLit.length > 0 && (
          <Cake3D
            numCandles={numCandles}
            candlesLit={candlesLit}
            onCandleClick={handleCandleClick}
          />
        )}

        {/* Helper instructions overlay */}
        {!celebrationFired && (
          <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none opacity-50 text-[9px] uppercase tracking-wider text-[#7C6E70]">
            Drag to rotate 3D cake
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
                ? "bg-[#C97B84]/[0.06] border-[#C97B84]/20 text-[#C97B84] hover:text-[#B5616B] ring-4 ring-[#C97B84]/10"
                : "bg-white/[0.6] text-[#2E2A27]"
            }`}
          >
            {micActive ? (
              <>
                <Mic className="w-4 h-4 animate-pulse text-[#C97B84]" />
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
              className="h-full bg-gradient-to-r from-[#D8B88A] to-[#C97B84] transition-all duration-75"
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
                <Volume2 className="w-5 h-5 text-[#C97B84]" />
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
    </div>
  );
}
