"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, CameraOff, Download, RefreshCw, X, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface PhotoMomentProps {
  open: boolean;
  name: string;
  onClose: () => void;
  onFinished: () => void;
}

export default function PhotoMoment({
  open,
  name,
  onClose,
  onFinished,
}: PhotoMomentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!open) {
      stopStream();
      setSnapshot(null);
      setError(null);
      return;
    }
    // small delay lets the celebration visuals paint first
    const t = setTimeout(() => startCamera(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setStarting(true);
    setError(null);
    try {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isMobile ? "user" : undefined, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
    } catch {
      setError(
        "Could not access your camera. You can skip this or continue anyway.",
      );
    } finally {
      setStarting(false);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    setSnapshot(canvas.toDataURL("image/jpeg", 0.85));
    stopStream();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#B05463", "#D8B88A", "#A6B39D", "#FFFFFF"],
    });
  };

  const retake = () => {
    setSnapshot(null);
    startCamera();
  };

  const download = () => {
    if (!snapshot) return;
    const a = document.createElement("a");
    a.href = snapshot;
    a.download = `wishmaker-${name || "moment"}.jpg`;
    a.click();
  };

  const skipToNext = () => {
    stopStream();
    setSnapshot(null);
    onFinished();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-[#FFF8F2] rounded-3xl overflow-hidden border border-[#ECE3DA] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#B05463] fill-current" />
            <h3 className="font-serif italic text-lg text-[#2E2A27]">
              Say cheese, {name}!
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7A6F62] hover:text-[#6F655E] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-black">
          {/* Off-screen canvas used to snapshot the video frame */}
          <canvas ref={canvasRef} className="hidden" width="1" height="1" />

          {!snapshot && !error && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              autoPlay
              playsInline
            />
          )}

          {snapshot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={snapshot}
              alt="Your birthday moment"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {!snapshot && !error && !starting && (
            <button
              type="button"
              onClick={capture}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-[#B05463] flex items-center justify-center text-[#B05463] hover:scale-105 transition-transform shadow-lg"
              aria-label="Capture"
            >
              <Camera className="w-7 h-7" />
            </button>
          )}

          {starting && (
            <div className="absolute inset-0 flex items-center justify-center text-[#6F655E] text-sm">
              Opening camera&hellip;
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-3">
              <CameraOff className="w-8 h-8 text-[#C46D5E]" />
              <p className="text-sm text-[#6F655E]">{error}</p>
            </div>
          )}

          {snapshot && (
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={retake}
                className="px-4 py-2 rounded-full bg-black/40 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={download}
                className="px-4 py-2 rounded-full bg-[#B05463] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={skipToNext}
            className="text-sm font-semibold text-[#6F655E] hover:text-[#B05463] transition-colors"
          >
            {snapshot ? "Continue" : "Skip camera ›"}
          </button>
          <span className="text-[0.6875rem] text-[#7A6F62] flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#B05463] fill-current" />
            only saved on your device
          </span>
        </div>
      </div>
    </div>
  );
}