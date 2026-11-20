"use client";

import React, { useRef, useState } from "react";
import { Music, Play, Square, Upload } from "lucide-react";
import { BIRTHDAY_TUNES } from "@/lib/tunes";
import { Mp3Player } from "@/lib/mp3Player";
import type { TunePickerProps } from "@/lib/types";

export default function TunePicker({ value, onSelect }: TunePickerProps) {
  const playerRef = useRef<Mp3Player | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewing, setPreviewing] = useState<string>(""); // src currently previewing

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      playerRef.current?.stop();
    };
  }, []);

  const stopAll = () => {
    playerRef.current?.stop();
    setPreviewing("");
  };

  const togglePreview = async (src: string) => {
    if (!playerRef.current) playerRef.current = new Mp3Player();
    if (previewing === src) {
      stopAll();
      return;
    }
    playerRef.current.play(src);
    setPreviewing(src);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      alert("Please choose an audio file.");
      return;
    }
    if (!playerRef.current) playerRef.current = new Mp3Player();
    playerRef.current.stop();
    const url = URL.createObjectURL(file);
    onSelect(url);
    setPreviewing("");
    playerRef.current.play(url);
    setPreviewing(url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="surface rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Music className="w-3.5 h-3.5 text-[#D8B88A]" />
        <p className="text-sm font-semibold text-[#2E2A27]">Birthday Tune</p>
        <span className="ml-auto text-[0.6875rem] text-[#7A6F62]">
          first ~15s plays
        </span>
      </div>

      <div className="grid gap-2">
        {BIRTHDAY_TUNES.map((t) => {
          const active = value === t.src;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                stopAll();
                onSelect(t.src);
              }}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                active
                  ? "border-[#B05463] bg-[#B05463]/6"
                  : "border-[#ECE3DA] bg-white hover:bg-[#F9F5F0]"
              }`}
            >
              <span
                role="button"
                tabIndex={0}
                aria-label={
                  previewing === t.src ? "Stop preview" : "Preview tune"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  togglePreview(t.src);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    togglePreview(t.src);
                  }
                }}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-[#ECE3DA] text-[#6F655E] hover:text-[#B05463] hover:border-[#DDD4CB] transition-all cursor-pointer"
              >
                {previewing === t.src ? (
                  <Square className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2E2A27]">
                  {t.label}
                </p>
                <p className="text-[0.75rem] text-[#6F655E] truncate">
                  {t.mood}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-[#DDD4CB] bg-[#F9F5F0]">
        <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#6F655E]">
          <Upload className="w-3.5 h-3.5" />
        </span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-[#B05463] font-semibold hover:underline cursor-pointer"
        >
          Upload your own tune
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
}
