import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { VoiceRecorderProps } from "@/lib/types";

export default function VoiceRecorder({
  onRecordingComplete,
  onClear,
  maxDuration = 60,
  compact = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, maxDuration, stopRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 16000,
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to Base64 for MongoDB storage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onRecordingComplete(base64data);
        };

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch {
      toast.error("Microphone unavailable. You can add your voice note later.");
    }
  };

  const handleClear = () => {
    setAudioUrl(null);
    onClear?.();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const inner = (
    <>
      {!compact && (
        <div className="flex items-center gap-2 mb-1">
          <Mic className="w-4 h-4 text-[#B05463]" />
          <p className="text-sm font-semibold text-[#2E2A27]">Voice Note</p>
        </div>
      )}

      {!audioUrl ? (
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-full ${
            isRecording
              ? "bg-[#C46D5E]/10 text-[#C46D5E] border border-[#C46D5E]/30 animate-pulse"
              : "bg-white border border-[#ECE3DA] text-[#6F655E] hover:bg-[#F9F5F0]"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-3.5 h-3.5" fill="currentColor" />
              <span>
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              {compact ? "Record a voice message" : `Start Recording (Max ${maxDuration}s)`}
            </>
          )}
        </button>
      ) : (
        <div className="flex flex-col w-full gap-3">
          <audio src={audioUrl} controls className="w-full h-10 rounded" />
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center gap-1.5 text-xs text-[#C46D5E] font-semibold hover:opacity-80 self-end"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      )}
    </>
  );

  if (compact) {
    return <div className="flex flex-col items-start gap-2 w-full">{inner}</div>;
  }

  return (
    <div className="surface rounded-2xl p-4 flex flex-col items-start gap-3">
      {inner}
    </div>
  );
}
