"use client";

import React from "react";
import { Camera, Plus, Sparkles, Trash2, Image as ImageIcon } from "lucide-react";
import type { Memory, MemoryLaneFormProps } from "@/lib/types";
import { captionPhoto } from "@/lib/actions";
import { compressImage } from "@/lib/images";

export default function MemoryLaneForm({
  activeFolder,
  setActiveFolder,
  memories,
  setMemories,
  onChange,
  recipientName,
  SectionHeader,
}: MemoryLaneFormProps) {
  const isAccordion = typeof activeFolder !== "undefined" && typeof setActiveFolder === "function";
  const isOpen = !isAccordion || activeFolder === "memories";

  const updateList = (newList: Memory[]) => {
    if (onChange) onChange(newList);
    if (setMemories) setMemories(newList);
  };

  const addMemory = () => updateList([...memories, { url: "", caption: "" }]);
  const removeMemory = (i: number) =>
    updateList(memories.filter((_, idx) => idx !== i));
  const updateMemory = (i: number, f: keyof Memory, v: string) =>
    updateList(memories.map((m, idx) => (idx === i ? { ...m, [f]: v } : m)));

  const autoCaption = async (i: number) => {
    const m = memories[i];
    if (!m?.url) return;
    updateMemory(i, "caption", "Finding the right words…");
    try {
      const res = await captionPhoto(m.url);
      updateMemory(i, "caption", res.caption);
    } catch {
      updateMemory(i, "caption", "");
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      updateMemory(index, "url", await compressImage(file));
    } catch {
      // The error is surfaced by the caller's toast; keep the form usable.
    }
  };

  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-[#E3D4B8]">
        <div>
          <h3 className="font-serif text-lg text-[#2A231F] font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#8B2635]" />
            Scrapbook Keepsakes
          </h3>
          <p className="text-xs text-[#7A6F62] font-sans mt-0.5">
            Photographs displayed with antique brass corners and handwritten captions
            {recipientName ? ` for ${recipientName}` : ""}.
          </p>
        </div>
        <button
          type="button"
          onClick={addMemory}
          className="text-xs font-serif font-semibold text-[#8B2635] hover:text-[#721C28] flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#8B2635]/30 hover:bg-[#8B2635]/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Photo
        </button>
      </div>

      {memories.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[#D4C4A8] bg-[#F7F2E7]/60">
          <ImageIcon className="w-8 h-8 text-[#A09383] mx-auto mb-2" />
          <p className="font-serif text-sm text-[#4A3E37]">No photos added yet</p>
          <p className="text-xs text-[#7A6F62] mt-1 mb-4">
            Add cherished snapshots from trips, birthdays, or quiet moments together.
          </p>
          <button
            type="button"
            onClick={addMemory}
            className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Photo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {memories.map((m, i) => (
            <div
              key={i}
              className="relative p-4 rounded-xl border border-[#E3D4B8] bg-[#FAF6F0] shadow-sm flex flex-col sm:flex-row gap-4 items-start"
            >
              {/* Photo Preview / Upload target */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white p-1 rounded-lg border border-[#D4C4A8] shadow-inner flex items-center justify-center overflow-hidden">
                {m.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.url}
                    alt={`Memory ${i + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center p-2 text-[#A09383]">
                    <Camera className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-[10px] block font-sans">No file</span>
                  </div>
                )}
                {/* Brass Corner accent */}
                <div
                  className="absolute top-0 left-0 w-3 h-3 pointer-events-none"
                  style={{
                    borderTop: "2px solid #C5A059",
                    borderLeft: "2px solid #C5A059",
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
                  style={{
                    borderBottom: "2px solid #C5A059",
                    borderRight: "2px solid #C5A059",
                  }}
                />
              </div>

              {/* Upload input and caption */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-semibold text-[#4A3E37]">
                    Photograph #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMemory(i)}
                    className="text-[#8B2635] hover:text-[#721C28] p-1 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, i)}
                  className="w-full text-xs text-[#5C5046] file:mr-2 file:py-1 file:px-3 file:rounded-md file:border file:border-[#D4C4A8] file:text-xs file:font-serif file:bg-[#F4EFE6] file:text-[#4A3E37] hover:file:bg-[#EBE2D3] cursor-pointer"
                />

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Handwritten caption (e.g. 'That rainy afternoon in Paris...')"
                    value={m.caption}
                    onChange={(e) => updateMemory(i, "caption", e.target.value)}
                    className="input-saas text-xs py-1.5 w-full font-serif"
                  />
                  {m.url && (
                    <button
                      type="button"
                      onClick={() => autoCaption(i)}
                      className="text-[11px] text-[#C5A059] hover:text-[#8B2635] font-serif font-medium flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-caption with AI
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!isAccordion) {
    return content;
  }

  return (
    <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
      <button
        type="button"
        onClick={() => setActiveFolder(isOpen ? "basics" : "memories")}
        aria-expanded={isOpen}
        aria-controls="panel-memories"
        className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
      >
        {SectionHeader ? (
          <SectionHeader icon={<Camera className="w-3.5 h-3.5" />}>
            Photo memories
          </SectionHeader>
        ) : (
          <span className="font-serif font-semibold">Photo memories</span>
        )}
      </button>

      {isOpen && <div id="panel-memories" className="p-5">{content}</div>}
    </div>
  );
}
