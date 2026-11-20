"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Trash2, Wand2, Loader2 } from "lucide-react";
import type { ScrollNote } from "@/lib/types";
import { generateScrollNotes } from "@/lib/actions";
import toast from "react-hot-toast";

interface ScrollJarFormProps {
  scrollNotes: ScrollNote[];
  onChange: (notes: ScrollNote[]) => void;
  scrollJarTitle: string;
  onTitleChange: (title: string) => void;
  recipientName: string;
  senderName: string;
  relationship: string;
}

export default function ScrollJarForm({
  scrollNotes,
  onChange,
  scrollJarTitle,
  onTitleChange,
  recipientName,
  senderName,
  relationship,
}: ScrollJarFormProps) {
  const [quickThoughts, setQuickThoughts] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateScrollNotes({
        recipientName: recipientName || "my favorite person",
        senderName: senderName || "me",
        relationship: relationship || "friend",
        userNotes: quickThoughts,
        count: 7,
      });

      if (res.scrolls && res.scrolls.length > 0) {
        onChange(res.scrolls);
        toast.success(`Crafted ${res.scrolls.length} parchment scrolls!`);
      }
    } catch {
      toast.error("Could not generate scrolls. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addScroll = () => {
    onChange([
      ...scrollNotes,
      {
        id: `scroll-${Date.now()}-${scrollNotes.length}`,
        text: "",
      },
    ]);
  };

  const updateScroll = (index: number, text: string) => {
    onChange(
      scrollNotes.map((s, idx) => (idx === index ? { ...s, text } : s)),
    );
  };

  const removeScroll = (index: number) => {
    onChange(scrollNotes.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h3 className="font-serif text-lg text-[#2A231F] font-semibold flex items-center gap-2">
          <span className="text-xl">🏺</span>
          Jar of Little Scrolls
        </h3>
        <p className="text-xs text-[#7A6F62] mt-0.5 font-sans">
          An antique glass jar filled with rolled parchment notes &mdash; inside
          jokes, reasons you love them, or memories you cherish.
        </p>
      </div>

      {/* Jar Custom Title */}
      <div>
        <label className="block text-xs font-serif font-semibold text-[#4A3E37] mb-1">
          Jar Inscription Title:
        </label>
        <input
          type="text"
          value={scrollJarTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. 7 Reasons You're My Favorite Human / Inside Jokes"
          className="input-saas text-xs py-2 w-full font-serif"
        />
      </div>

      {/* AI Quick Generator Box */}
      <div className="p-4 rounded-xl border border-[#E3D4B8] bg-[#F4EFE6]/70 space-y-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#8B2635]" />
          <span className="text-xs font-serif font-semibold text-[#2A231F]">
            30-Second AI Scribe &mdash; Fill the Jar
          </span>
        </div>
        <p className="text-[11px] text-[#7A6F62]">
          Drop 2 or 3 casual memories or inside jokes below, and AI will turn
          them into 7 beautifully phrased parchment scrolls:
        </p>
        <textarea
          rows={2}
          value={quickThoughts}
          onChange={(e) => setQuickThoughts(e.target.value)}
          placeholder="e.g., The burned pasta night, driving to the beach at midnight, she always loses her keys, always picks up on the 1st ring..."
          className="input-saas text-xs py-2 w-full font-serif resize-none"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-secondary text-xs py-2 px-4 flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Writing Scrolls&hellip;
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Fill Jar with 7 Scrolls
            </>
          )}
        </button>
      </div>

      {/* List of Scrolls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-semibold text-[#4A3E37]">
            Parchment Scrolls in Jar ({scrollNotes.length}):
          </span>
          <button
            type="button"
            onClick={addScroll}
            className="text-xs font-serif font-semibold text-[#8B2635] hover:text-[#721C28] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Scroll
          </button>
        </div>

        {scrollNotes.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-[#D4C4A8] rounded-lg bg-[#FAF6F0] text-xs text-[#7A6F62]">
            The jar is empty right now. Use the AI Scribe above or click &ldquo;Add Scroll&rdquo; to write your own!
          </div>
        ) : (
          <div className="space-y-2.5">
            {scrollNotes.map((note, idx) => (
              <div
                key={note.id || idx}
                className="flex items-center gap-2 bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E3D4B8]"
              >
                <span className="w-6 h-6 rounded-full bg-[#8B2635] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={note.text}
                  onChange={(e) => updateScroll(idx, e.target.value)}
                  placeholder="A memory, inside joke, or heartfelt reason..."
                  className="input-saas text-xs py-1.5 flex-1 font-serif"
                />
                <button
                  type="button"
                  onClick={() => removeScroll(idx)}
                  className="text-[#8B2635] hover:text-[#721C28] p-1"
                  title="Remove scroll"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
