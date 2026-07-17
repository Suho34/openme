"use client";

import React from "react";
import { Camera, ChevronDown, Plus, Trash2 } from "lucide-react";

export interface Memory {
  url: string;
  caption: string;
}

interface MemoryLaneFormProps {
  activeFolder: string;
  setActiveFolder: (f: string) => void;
  memories: Memory[];
  setMemories: (m: Memory[]) => void;
  SectionHeader: React.FC<{ icon: React.ReactNode; children: React.ReactNode }>;
}

export default function MemoryLaneForm({
  activeFolder,
  setActiveFolder,
  memories,
  setMemories,
  SectionHeader
}: MemoryLaneFormProps) {
  const isOpen = activeFolder === "memories";

  const addMemory = () => setMemories([...memories, { url: "", caption: "" }]);
  const removeMemory = (i: number) => setMemories(memories.filter((_, idx) => idx !== i));
  const updateMemory = (i: number, f: keyof Memory, v: string) =>
    setMemories(memories.map((m, idx) => (idx === i ? { ...m, [f]: v } : m)));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress image to Base64 (for demo MVP)
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Better quality
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        updateMemory(index, "url", dataUrl);
      };
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
      <button
        type="button"
        onClick={() => setActiveFolder(isOpen ? "basics" : "memories")}
        className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
      >
        <SectionHeader icon={<Camera className="w-3.5 h-3.5" />}>8. Photo memories</SectionHeader>
        <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[0.75rem] text-[#6F655E] font-semibold">Shared Photos</span>
            <button type="button" onClick={addMemory} className="text-[0.75rem] text-[#C97B84] font-semibold flex items-center gap-1 hover:text-[#B5616B]">
              <Plus className="w-3 h-3" /> Add Photo
            </button>
          </div>
          
          <div className="space-y-3">
            {memories.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#F9F5F0] border border-[#ECE3DA] p-4 rounded-2xl">
                {m.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="Thumbnail" className="w-14 h-14 object-cover rounded-xl border border-[#ECE3DA]" />
                ) : (
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#B5ADA5] border border-[#ECE3DA]">
                    <Camera className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex-1 space-y-1.5 min-w-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, i)}
                    className="w-full text-[0.75rem] text-[#6F655E] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border file:border-[#ECE3DA] file:text-[0.75rem] file:font-semibold file:bg-white file:text-[#6F655E] hover:file:bg-[#F9F5F0]"
                  />
                  <input
                    type="text"
                    placeholder="Caption…"
                    value={m.caption}
                    onChange={e => updateMemory(i, "caption", e.target.value)}
                    className="input-saas text-sm py-2"
                  />
                </div>
                
                <button type="button" onClick={() => removeMemory(i)} className="text-[#B5ADA5] hover:text-[#C46D5E] transition-colors px-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
