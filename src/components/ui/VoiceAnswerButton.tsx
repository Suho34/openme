"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import toast from "react-hot-toast";
import { transcribeAnswer } from "@/lib/actions";
import { blobToWavDataUrl } from "@/lib/wav";

interface VoiceAnswerButtonProps {
  onText: (text: string) => void;
  disabled?: boolean;
}

const MAX_SECONDS = 60;

/**
 * Speak instead of typing. Records mono 16 kHz audio, re-encodes it to WAV in
 * the browser, and hands it to Gemini for a verbatim transcript.
 */
export default function VoiceAnswerButton({
  onText,
  disabled = false,
}: VoiceAnswerButtonProps) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setRecording(false);
    setSeconds(0);
  };

  useEffect(() => cleanup, []);

  const transcribe = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const dataUrl = await blobToWavDataUrl(blob);
      const { text } = await transcribeAnswer(dataUrl);
      onText(text);
      toast.success("Transcribed — edit it if anything came out wrong.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not transcribe that. Please type your answer.",
      );
    } finally {
      setTranscribing(false);
    }
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 16000,
      });
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        void transcribe(blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= MAX_SECONDS - 1) stop();
          return prev + 1;
        });
      }, 1000);
    } catch {
      toast.error("Microphone unavailable. You can type your answer instead.");
    }
  };

  const stop = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setRecording(false);
  };

  const format = (value: number) =>
    `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      disabled={disabled || transcribing}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
        recording
          ? "border-[#C46D5E]/40 bg-[#C46D5E]/10 text-[#C46D5E]"
          : "border-[#E3D4B8] bg-white text-[#6F655E] hover:border-[#8B2635]/40 hover:text-[#8B2635]"
      }`}
      aria-label={recording ? "Stop recording" : "Answer with your voice"}
    >
      {transcribing ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Listening back…
        </>
      ) : recording ? (
        <>
          <Square className="w-3 h-3" fill="currentColor" /> Stop · {format(seconds)}
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5" /> Answer by voice
        </>
      )}
    </button>
  );
}
