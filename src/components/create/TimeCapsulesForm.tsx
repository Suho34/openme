"use client";

import React, { useState } from "react";
import { Plus, Trash2, Heart, Gift, Camera, Mic } from "lucide-react";
import type { TimeCapsule } from "@/lib/types";

interface TimeCapsulesFormProps {
  capsules: TimeCapsule[];
  onChange: (capsules: TimeCapsule[]) => void;
  recipientName: string;
  relationship: string;
}

const PROMPT_SUGGESTIONS: Record<string, string[]> = {
  partner: [
    "Open when you miss me",
    "Open when you've had a stressful day",
    "Open on a quiet Sunday morning",
    "Open when you need a reminder of how loved you are",
  ],
  friend: [
    "Open when you need a good laugh",
    "Open when life feels overwhelming",
    "Open when you're doubting yourself",
    "Open when you miss our chaotic adventures",
  ],
  sibling: [
    "Open when you miss home",
    "Open when you need unconditional advice",
    "Open when you need someone in your corner",
  ],
  colleague: [
    "Open on a tough project deadline day",
    "Open when you need a reminder that you're crushing it",
    "Open when you need a coffee break boost",
  ],
};

export default function TimeCapsulesForm({
  capsules,
  onChange,
  recipientName,
  relationship,
}: TimeCapsulesFormProps) {
  const relKey = relationship?.toLowerCase() || "friend";
  const suggestions =
    PROMPT_SUGGESTIONS[relKey] || PROMPT_SUGGESTIONS.friend;

  const addCapsule = (promptText?: string) => {
    onChange([
      ...capsules,
      {
        id: `capsule-${Date.now()}-${capsules.length}`,
        prompt: promptText || "Open when you need a smile",
        message: "",
        voucher: "",
      },
    ]);
  };

  const updateCapsule = (index: number, field: keyof TimeCapsule, val: string) => {
    onChange(
      capsules.map((c, idx) => (idx === index ? { ...c, [field]: val } : c)),
    );
  };

  const removeCapsule = (index: number) => {
    onChange(capsules.filter((_, idx) => idx !== index));
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 640;
        const scale = MAX / Math.max(img.width, img.height);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        updateCapsule(index, "photoUrl", dataUrl);
      };
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="font-serif text-lg text-[#2A231F] font-semibold flex items-center gap-2">
          <span className="text-xl">⏳</span>
          &ldquo;Open When&hellip;&rdquo; Keepsake Capsules
        </h3>
        <p className="text-xs text-[#7A6F62] mt-0.5 font-sans">
          Create sealed digital envelopes for {recipientName || "them"} to open in the future &mdash; on hard days, quiet mornings, or whenever they miss you.
        </p>
      </div>

      {/* Quick Prompt Ideas */}
      <div className="p-3.5 rounded-lg border border-[#E3D4B8] bg-[#FAF6F0] space-y-2">
        <span className="text-[11px] font-serif font-semibold text-[#4A3E37] block">
          Suggested Prompts for {relationship || "Friends"}:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addCapsule(s)}
              className="text-[11px] font-serif py-1 px-2.5 rounded-full border border-[#D4C4A8] bg-white text-[#4A3E37] hover:border-[#8B2635] hover:text-[#8B2635] transition-colors flex items-center gap-1"
            >
              <Plus className="w-2.5 h-2.5" /> &ldquo;{s}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Capsules List */}
      <div className="space-y-4">
        {capsules.map((c, idx) => (
          <div
            key={c.id || idx}
            className="p-4 rounded-xl border border-[#E3D4B8] bg-[#FAF6F0] space-y-3 relative shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-semibold text-[#8B2635] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Capsule #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeCapsule(idx)}
                className="text-[#8B2635] hover:text-[#721C28] p-1 transition-colors"
                title="Remove capsule"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Prompt Label */}
            <div>
              <label className="block text-[11px] font-serif font-medium text-[#4A3E37] mb-1">
                Envelope Prompt:
              </label>
              <input
                type="text"
                value={c.prompt}
                onChange={(e) => updateCapsule(idx, "prompt", e.target.value)}
                placeholder="e.g. Open when you miss me..."
                className="input-saas text-xs py-1.5 w-full font-serif"
              />
            </div>

            {/* Comfort Message */}
            <div>
              <label className="block text-[11px] font-serif font-medium text-[#4A3E37] mb-1">
                Comfort Message inside:
              </label>
              <textarea
                rows={3}
                value={c.message}
                onChange={(e) => updateCapsule(idx, "message", e.target.value)}
                placeholder="Write a sweet, comforting letter for that future moment..."
                className="input-saas text-xs py-1.5 w-full font-serif resize-none"
              />
            </div>

            {/* Optional Promise / Voucher */}
            <div>
              <label className="block text-[11px] font-serif font-medium text-[#4A3E37] mb-1 flex items-center gap-1">
                <Gift className="w-3 h-3 text-[#C5A059]" />
                Optional Promise / Voucher:
              </label>
              <input
                type="text"
                value={c.voucher || ""}
                onChange={(e) => updateCapsule(idx, "voucher", e.target.value)}
                placeholder="e.g. Valid for one late-night emergency call / A home-cooked meal..."
                className="input-saas text-xs py-1.5 w-full font-serif"
              />
            </div>

            {/* Optional Photo Attachment */}
            <div>
              <label className="block text-[11px] font-serif font-medium text-[#4A3E37] mb-1 flex items-center gap-1">
                <Camera className="w-3 h-3 text-[#7A6F62]" />
                Optional Secret Photo Attachment:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, idx)}
                className="w-full text-[11px] text-[#5C5046] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-[#D4C4A8] file:text-[11px] file:font-serif file:bg-white file:text-[#4A3E37] cursor-pointer"
              />
              {c.photoUrl && (
                <div className="mt-2 w-16 h-16 rounded overflow-hidden border border-[#D4C4A8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addCapsule()}
          className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Capsule
        </button>
      </div>
    </div>
  );
}
