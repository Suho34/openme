"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Wand2 } from "lucide-react";
import VoiceAnswerButton from "@/components/ui/VoiceAnswerButton";
import { questionsFor } from "@/lib/interviewQuestions";

type Mode = "interview" | "quick";

interface InterviewPanelProps {
  name: string;
  sender: string;
  relationship: string;
  answers: Record<string, string>;
  onAnswersChange: (answers: Record<string, string>) => void;
  onCompose: (mode: "interview" | "quick") => void;
  // Quick mode
  whatToSay: string;
  keywords: string;
  onWhatToSayChange: (value: string) => void;
  onKeywordsChange: (value: string) => void;
  tone: number;
  onToneChange: (value: number) => void;
  loading: boolean;
  drafts: string[];
  onSelectDraft: (draft: string) => void;
}

const wordCount = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

export default function InterviewPanel({
  name,
  sender,
  relationship,
  answers,
  onAnswersChange,
  onCompose,
  whatToSay,
  keywords,
  onWhatToSayChange,
  onKeywordsChange,
  tone,
  onToneChange,
  loading,
  drafts,
  onSelectDraft,
}: InterviewPanelProps) {
  const questions = useMemo(() => questionsFor(relationship), [relationship]);
  const [mode, setMode] = useState<Mode>("interview");
  const [index, setIndex] = useState(0);

  const current = questions[Math.min(index, questions.length - 1)];
  const answered = questions.filter((q) => (answers[q.id] ?? "").trim().length > 2).length;
  const ready = Boolean(name.trim() && sender.trim());

  const setAnswer = (value: string) => {
    onAnswersChange({ ...answers, [current.id]: value });
  };

  return (
    <div
      className="paper-deckle p-5 rounded-lg border border-[#E3D4B8]"
      style={{ background: "#FBF8F2" }}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-[#8B2635] uppercase tracking-wider">
          <Wand2 className="w-3.5 h-3.5" />
          Letter Writer
        </span>
        <div className="flex items-center gap-1 rounded-full border border-[#E3D4B8] bg-white p-0.5">
          <button
            type="button"
            onClick={() => setMode("interview")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              mode === "interview" ? "bg-[#8B2635] text-white" : "text-[#7A6F62]"
            }`}
          >
            Interview
          </button>
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              mode === "quick" ? "bg-[#8B2635] text-white" : "text-[#7A6F62]"
            }`}
          >
            Quick
          </button>
        </div>
      </div>

      {mode === "interview" ? (
        <div className="space-y-3">
          <p className="text-[11px] text-[#7A6F62] font-serif italic">
            Six small questions. Answer by typing or speaking — your answers become the letter,
            so it sounds like you, not a greeting card.
          </p>

          <div className="flex items-center gap-1.5">
            {questions.map((q, i) => {
              const done = (answers[q.id] ?? "").trim().length > 2;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Question ${i + 1}`}
                  className={`h-1.5 flex-1 rounded-full transition-colors cursor-pointer ${
                    i === index
                      ? "bg-[#8B2635]"
                      : done
                        ? "bg-[#8B2635]/40"
                        : "bg-[#E3D4B8]"
                  }`}
                />
              );
            })}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-serif font-semibold text-[#2A231F] leading-snug">
              {current.question}
            </p>
            <p className="text-[11px] text-[#7A6F62] italic">{current.hint}</p>
          </div>

          <textarea
            rows={4}
            value={answers[current.id] ?? ""}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={
              name ? `About ${name}…` : "Answer in your own words — half a sentence is fine."
            }
            className="input-saas text-xs leading-relaxed resize-none"
          />

          <div className="flex items-center justify-between gap-2">
            <VoiceAnswerButton
              disabled={!ready}
              onText={(text) => {
                const existing = (answers[current.id] ?? "").trim();
                setAnswer(existing ? `${existing} ${text}` : text);
              }}
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIndex(Math.max(0, index - 1))}
                disabled={index === 0}
                className="p-2 rounded-full border border-[#E3D4B8] bg-white text-[#7A6F62] disabled:opacity-40 cursor-pointer"
                aria-label="Previous question"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {index < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setIndex(index + 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#8B2635] text-white text-[11px] font-semibold cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onCompose("interview")}
                  disabled={loading || answered === 0 || !ready}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#8B2635] text-white text-[11px] font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {loading ? "Composing…" : "Compose drafts"}
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#7A6F62]">
            {answered} of {questions.length} answered
          </p>

          {index < questions.length - 1 && answered > 0 && (
            <button
              type="button"
              onClick={() => onCompose("interview")}
              disabled={loading || !ready}
              className="w-full btn-primary text-xs py-2.5 inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Composing…" : "Compose from what I have"}
            </button>
          )}

          {!ready && (
            <p className="text-[11px] text-[#8B2635]">
              Add both names in step 1 and the writer can start.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            value={whatToSay}
            onChange={(e) => onWhatToSayChange(e.target.value)}
            placeholder="What feeling do you want to convey? (e.g. how much ordinary days shine with you)"
            className="input-saas text-xs"
          />
          <input
            value={keywords}
            onChange={(e) => onKeywordsChange(e.target.value)}
            placeholder="Specific memories, inside jokes, or small habits to weave in"
            className="input-saas text-xs"
          />
          <div className="flex items-center gap-3">
            <label className="text-[11px] text-[#7A6F62] shrink-0" htmlFor="tone">
              Tone: {tone > 60 ? "Romantic & poetic" : "Warm & playful"}
            </label>
            <input
              id="tone"
              type="range"
              min={0}
              max={100}
              value={tone}
              onChange={(e) => onToneChange(Number(e.target.value))}
              className="flex-1 accent-[#8B2635]"
            />
          </div>
          <button
            type="button"
            onClick={() => onCompose("quick")}
            disabled={loading || !ready}
            className="w-full btn-primary text-xs py-2.5 inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {loading ? "Composing…" : "Compose 3 Drafts"}
          </button>
        </div>
      )}

      {drafts.length > 0 && (
        <div className="space-y-2.5 pt-3 mt-3 border-t border-[#E3D4B8]">
          <p className="text-[11px] font-semibold text-[#8B2635]">Tap a draft to use it:</p>
          {drafts.map((draft, i) => (
            <div
              key={i}
              onClick={() => onSelectDraft(draft)}
              className="p-3 rounded-lg border border-[#E3D4B8] bg-white text-xs leading-relaxed text-[#554A44] font-serif italic cursor-pointer hover:border-[#8B2635] hover:bg-[#FAF6F0] transition-colors"
            >
              &ldquo;{draft}&rdquo;
              <span className="block mt-1.5 text-[10px] not-italic text-[#A09383] font-sans">
                {wordCount(draft)} words
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
