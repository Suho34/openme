"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Wind } from "lucide-react";
import { playCandleBlow, playConfettiPop, HappyBirthdayPlayer, MicBlowDetector } from "@/lib/audio";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import Cake3D from "./Cake3D";

interface BirthdayCakeProps {
  name: string;
  age?: number;
  onCelebrationStart: () => void;
}

export default function BirthdayCake({ name, age, onCelebrationStart }: BirthdayCakeProps) {
  // Always 5 candles as requested
  const numCandles = 5;
  
  const [candlesLit, setCandlesLit] = useState<boolean[]>([]);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [songPlaying, setSongPlaying] = useState(false);
  const [celebrationFired, setCelebrationFired] = useState(false);
  
  const micDetectorRef = useRef<MicBlowDetector | null>(null);
  const songPlayerRef = useRef<HappyBirthdayPlayer | null>(null);

  // Initialize candles state and play song on cake reveal
  useEffect(() => {
    setCandlesLit(Array(numCandles).fill(true));
    songPlayerRef.current = new HappyBirthdayPlayer();
    
    // Auto-play tune on reveal
    songPlayerRef.current.play();
    setSongPlaying(true);

    return () => {
      if (micDetectorRef.current) {
        micDetectorRef.current.stop();
      }
      if (songPlayerRef.current) {
        songPlayerRef.current.stop();
      }
    };
  }, [numCandles]);

  // Click handler to blow out individual candles
  const handleCandleClick = (index: number) => {
    if (candlesLit[index]) {
      setCandlesLit(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
      playCandleBlow();
    }
  };

  // Check if all candles are blown out
  useEffect(() => {
    if (candlesLit.length > 0 && candlesLit.every(lit => !lit) && !celebrationFired) {
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
        }
      );
      
      const success = await detector.start();
      if (success) {
        micDetectorRef.current = detector;
        setMicActive(true);
      } else {
        alert("Could not access microphone. Try clicking the candles on the 3D cake directly!");
      }
    }
  };

  // Extinguish the next available candle
  const extinguishNextCandle = () => {
    setCandlesLit(prev => {
      const firstLitIdx = prev.findIndex(lit => lit);
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

    if (songPlayerRef.current) {
      songPlayerRef.current.play();
      setSongPlaying(true);
    }

    playConfettiPop();

    // Trigger full fireworks/confetti splash
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    onCelebrationStart();
  };

  const toggleSong = () => {
    if (!songPlayerRef.current) return;
    if (songPlaying) {
      songPlayerRef.current.stop();
      setSongPlaying(false);
    } else {
      songPlayerRef.current.play();
      setSongPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 w-full max-w-lg mx-auto select-none">
      
      {/* Celebration Titles */}
      {celebrationFired ? (
        <div className="text-center mb-6 animate-bounce">
          <h2 className="text-3xl font-serif font-normal italic text-[#C86A76] flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 animate-spin text-[#C86A76]" />
            Make a Wish, {name}!
            <Sparkles className="w-6 h-6 animate-spin text-[#C86A76]" />
          </h2>
          <p className="text-xs text-[#6A5A5C] mt-1">Your magical birthday wishes are in motion...</p>
        </div>
      ) : (
        <div className="text-center mb-4">
          <h2 className="text-2xl font-serif text-[#3E2D2F]">Blow out the candles!</h2>
          <p className="text-xs text-[#6A5A5C] mt-1">Drag to spin the 3D cake. Click candles directly or use the microphone.</p>
        </div>
      )}

      {/* 3D WebGL Cake Area */}
      <div className="relative w-full max-w-sm h-80 sm:h-96 flex items-center justify-center mb-6 bg-[#FAF3EC] rounded-2xl border border-[#E6DFD3] overflow-hidden shadow-inner">
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
        {!celebrationFired && (
          <Button
            type="button"
            variant="outline"
            onClick={toggleMicrophone}
            className={`flex items-center justify-center gap-2 rounded-xl py-4 border border-stone-300 hover:bg-white/[0.2] h-auto text-sm font-bold transition-all duration-300 cursor-pointer ${
              micActive
                ? "bg-rose-500/5 border-rose-500/20 text-rose-500 hover:text-rose-600 ring-4 ring-rose-500/5"
                : "bg-white/[0.6] text-[#3E2D2F]"
            }`}
          >
            {micActive ? (
              <>
                <Mic className="w-4 h-4 animate-pulse text-rose-500" />
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
              className="h-full bg-gradient-to-r from-[#D4B26F] to-[#C86A76] transition-all duration-75"
            />
          </div>
        )}

        {/* Music Player */}
        {celebrationFired && (
          <Button
            type="button"
            variant="outline"
            onClick={toggleSong}
            className="flex items-center justify-center gap-2 rounded-xl py-4 border border-stone-300 bg-white/[0.6] hover:bg-white/[0.8] text-[#3E2D2F] h-auto text-sm font-bold cursor-pointer"
          >
            {songPlaying ? (
              <>
                <Volume2 className="w-5 h-5 text-[#C86A76] animate-bounce" />
                <span>Stop Synthesizer Song</span>
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
