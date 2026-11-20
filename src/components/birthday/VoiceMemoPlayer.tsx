"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceMemoPlayerProps {
  voiceNoteUrl?: string;
  sender: string;
}

export default function VoiceMemoPlayer({
  voiceNoteUrl,
  sender,
}: VoiceMemoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!voiceNoteUrl) return;
    const audio = new Audio(voiceNoteUrl);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration || 0);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [voiceNoteUrl]);

  if (!voiceNoteUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto my-4 p-4 rounded-xl border border-[#E3D4B8] select-none"
      style={{
        background: "linear-gradient(135deg, #FDFBF7 0%, #F5EFE6 100%)",
        boxShadow: "0 8px 24px -6px rgba(59, 39, 30, 0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#8B2635]/10 flex items-center justify-center text-[#8B2635]">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#8B2635]">
              Whispered Voice Note
            </p>
            <p className="text-xs text-[#7A6F62] font-serif italic">
              From {sender}&apos;s heart to yours
            </p>
          </div>
        </div>
        <Volume2 className="w-4 h-4 text-[#C5A059]" />
      </div>

      <div className="flex items-center gap-3">
        {/* Play / Pause Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md"
          style={{
            background: "linear-gradient(135deg, #8B2635 0%, #721C28 100%)",
          }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Animated Sound Wave Bars */}
        <div className="flex-1 flex items-center gap-1 h-8 px-2 bg-black/[0.03] rounded-lg">
          {Array.from({ length: 24 }).map((_, i) => {
            const progress = duration > 0 ? currentTime / duration : 0;
            const barProgress = i / 24;
            const isActive = barProgress <= progress;

            return (
              <motion.div
                key={i}
                animate={
                  isPlaying
                    ? {
                        height: [
                          "25%",
                          `${Math.max(20, Math.sin(i * 0.8 + currentTime * 4) * 85)}%`,
                          "30%",
                        ],
                      }
                    : { height: `${20 + (i % 5) * 12}%` }
                }
                transition={
                  isPlaying
                    ? { duration: 0.4, repeat: Infinity, repeatType: "reverse" }
                    : { duration: 0.2 }
                }
                className="flex-1 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: isActive ? "#8B2635" : "#D4AF37",
                  opacity: isActive ? 0.9 : 0.35,
                }}
              />
            );
          })}
        </div>

        {/* Duration / Timer */}
        <span className="text-[11px] font-mono text-[#7A6F62] min-w-8 text-right">
          {formatTime(currentTime || duration)}
        </span>
      </div>
    </motion.div>
  );
}
