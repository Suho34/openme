"use client";

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Sparkles, Copy, ExternalLink, Plus, Trash2,
  Camera, Gift, Wand2, Music, Clock, 
  Loader2, Play, Square, Check, Share2,
  Users, Star, Heart, Briefcase, Lightbulb, ChevronDown, Calendar
} from "lucide-react";
import confetti from "canvas-confetti";
import { playChime } from "@/lib/audio";
import { JinglePlayer } from "@/lib/jingle";

// ── Types ─────────────────────────────────────────────────────
interface Memory { url: string; caption: string; }
type ThemeId = "starry" | "neon" | "romance" | "pastel" | "retro";
type RelationType = "best friend" | "partner" | "sibling" | "family" | "colleague" | "mentor";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface StarMemory {
  id: number;
  label: string;
  date: string;
  description: string;
  x: number;
  y: number;
}

interface WishTemplate {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  defaults: {
    theme: ThemeId;
    relationship: RelationType;
    tone: number;
    keywords: string;
    messagePlaceholder: string;
  };
}

const WISH_TEMPLATES: WishTemplate[] = [
  {
    id: "partner",
    label: "For a Partner",
    icon: <Heart className="w-4 h-4" />,
    description: "Romantic, intimate",
    defaults: {
      theme: "romance",
      relationship: "partner",
      tone: 80,
      keywords: "love, memories, forever",
      messagePlaceholder: "Every day with you is a gift. Here's to celebrating you and everything you mean to me…",
    },
  },
  {
    id: "best-friend",
    label: "For a Friend",
    icon: <Star className="w-4 h-4" />,
    description: "Fun, nostalgic, laughs",
    defaults: {
      theme: "neon",
      relationship: "best friend",
      tone: 25,
      keywords: "adventures, laughs, memories",
      messagePlaceholder: "Another year older, but still just as chaotic and wonderful as ever…",
    },
  },
  {
    id: "family",
    label: "For Family",
    icon: <Users className="w-4 h-4" />,
    description: "Warm, grateful, sincere",
    defaults: {
      theme: "pastel",
      relationship: "family",
      tone: 60,
      keywords: "family, support, love",
      messagePlaceholder: "Thank you for always being my rock, my support system, and my home. I'm so grateful for you…",
    },
  },
  {
    id: "colleague",
    label: "For a Colleague",
    icon: <Briefcase className="w-4 h-4" />,
    description: "Professional, warm",
    defaults: {
      theme: "starry",
      relationship: "colleague",
      tone: 50,
      keywords: "teamwork, achievements, growth",
      messagePlaceholder: "Wishing an incredible colleague a year as brilliant as your ideas…",
    },
  },
];

const THEMES = [
  { id: "starry"  as ThemeId, label: "Starry Night",  desc: "Deep & dreamy" },
  { id: "neon"    as ThemeId, label: "Electric",       desc: "Bold & fun" },
  { id: "romance" as ThemeId, label: "Romantic",       desc: "Warm glow" },
  { id: "pastel"  as ThemeId, label: "Pastel Dream",   desc: "Soft & gentle" },
  { id: "retro"   as ThemeId, label: "Vintage",        desc: "Nostalgic" },
];

const THEME_COLORS: Record<ThemeId, string> = {
  starry:  "#4A6FA5",
  neon:    "#9B72CF",
  romance: "#C97B84",
  pastel:  "#87B5A2",
  retro:   "#C4956A",
};

const RELATIONSHIP_OPTIONS: RelationType[] = [
  "best friend", "partner", "sibling", "family", "colleague", "mentor",
];

const TONE_LABELS: Record<number, string> = {
  0:   "😄 Very Playful",
  25:  "😊 Playful",
  50:  "💭 Balanced",
  75:  "🥺 Heartfelt",
  100: "🎩 Formal",
};

function toneLabel(v: number) {
  const snapped = [0, 25, 50, 75, 100].reduce((prev, curr) =>
    Math.abs(curr - v) < Math.abs(prev - v) ? curr : prev
  );
  return TONE_LABELS[snapped];
}

const SectionHeader = ({ icon, children }: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2.5 text-[0.8125rem] font-semibold text-[#6F655E] uppercase tracking-[0.1em]">
    <span className="text-[#C97B84]">{icon}</span>
    {children}
  </div>
);

// ── Main Page ──
export default function CreateSurprise() {
  const [name, setName]         = useState("");
  const [age, setAge]           = useState("");
  const [sender, setSender]     = useState("");
  const [message, setMessage]   = useState("");
  const [theme, setTheme]       = useState<ThemeId>("starry");
  const [memories, setMemories] = useState<Memory[]>([
    { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80", caption: "Laughter and joy together!" },
  ]);

  // Timeline state
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    { date: "Oct 2021", title: "The Day We Met", description: "A simple introduction that quickly turned into hours of talking." },
    { date: "May 2022", title: "First Adventure", description: "Our first road trip away from the city, singing along to custom playlists." },
  ]);

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [shorteningLoading, setShorteningLoading] = useState(false);
  const [copied, setCopied]             = useState(false);

  // Accordion folder state
  const [activeFolder, setActiveFolder] = useState<"basics" | "ai-writer" | "theme" | "schedule" | "doodle" | "timeline" | "memories">("basics");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [doodleType, setDoodleType] = useState<"heart" | "rose" | "hearts" | "coffee">("heart");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Feature C — Scheduled delivery
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [deliveryDate, setDeliveryDate]        = useState("");

  // Feature D — AI letter writer
  const [aiRelationship, setAiRelationship] = useState<RelationType>("best friend");
  const [aiKeywords, setAiKeywords]         = useState("");
  const [aiDrafts, setAiDrafts]             = useState<string[]>([]);
  const [aiLoading, setAiLoading]           = useState(false);

  // Letter tone slider (0 = playful → 100 = formal)
  const [tone, setTone] = useState(50);

  // AI theme recommendation
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeReason, setThemeReason]  = useState("");

  // Feature E — Jingle
  const jingleRef    = useRef<JinglePlayer | null>(null);
  const [jinglePlaying, setJinglePlaying] = useState(false);

  const applyTemplate = (tmpl: WishTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setTheme(tmpl.defaults.theme);
    setAiRelationship(tmpl.defaults.relationship);
    setTone(tmpl.defaults.tone);
    setAiKeywords(tmpl.defaults.keywords);
    setMessage(tmpl.defaults.messagePlaceholder);
    toast.success(`Template applied`);
  };

  const addMemory    = () => setMemories(p => [...p, { url: "", caption: "" }]);
  const removeMemory = (i: number) => setMemories(p => p.filter((_, idx) => idx !== i));
  const updateMemory = (i: number, f: keyof Memory, v: string) =>
    setMemories(p => { const n = [...p]; n[i] = { ...n[i], [f]: v }; return n; });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 220;
        const MAX_HEIGHT = 220;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.45);
          updateMemory(index, "url", compressed);
          toast.success("Photo uploaded successfully");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addTimelineEvent = () => setTimelineEvents(p => [...p, { date: "", title: "", description: "" }]);
  const removeTimelineEvent = (i: number) => setTimelineEvents(p => p.filter((_, idx) => idx !== i));
  const updateTimelineEvent = (i: number, f: keyof TimelineEvent, v: string) =>
    setTimelineEvents(p => { const n = [...p]; n[i] = { ...n[i], [f]: v }; return n; });

  const handleGenerateDrafts = async () => {
    if (!name || !sender) {
      toast.error("Add names first");
      return;
    }
    setAiLoading(true);
    setAiDrafts([]);
    const loadingToast = toast.loading("Composing heartfelt drafts…");
    try {
      const toneDesc = tone <= 25 ? "very playful and funny"
        : tone <= 50 ? "warm and friendly"
        : tone <= 75 ? "heartfelt and emotional"
        : "formal and poetic";

      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, sender,
          relationship: aiRelationship,
          keywords: aiKeywords,
          toneDescription: toneDesc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiDrafts(data.drafts);
      toast.success("Select a draft below", { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate drafts", { id: loadingToast });
    } finally {
      setAiLoading(false);
    }
  };

  const handleRecommendTheme = async () => {
    if (!message && !aiKeywords) {
      toast.error("Write a message or add keywords first");
      return;
    }
    setThemeLoading(true);
    setThemeReason("");
    const tid = toast.loading("Finding the perfect mood…");
    try {
      const res = await fetch("/api/recommend-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, keywords: aiKeywords, relationship: aiRelationship }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTheme(data.theme as ThemeId);
      setThemeReason(data.reason);
      toast.success(`Theme matched`, { id: tid });
    } catch (err: any) {
      toast.error(err.message || "Failed to recommend theme", { id: tid });
    } finally {
      setThemeLoading(false);
    }
  };

  const handleToggleJingle = async () => {
    if (!jingleRef.current) jingleRef.current = new JinglePlayer();
    if (jinglePlaying) {
      jingleRef.current.stop();
      setJinglePlaying(false);
    } else {
      await jingleRef.current.play({ theme, name: name || "friend" });
      setJinglePlaying(true);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const active = memories.filter(m => m.url.trim());
    const payload: Record<string, any> = {
      n: name.trim()   || "Someone Special",
      a: age ? parseInt(age) : undefined,
      s: sender.trim() || "A Loved One",
      m: message.trim() || "Happy Birthday! Wishing you a magical year ahead.",
      t: theme,
      mm: active,
      tl: timelineEvents.filter(ev => ev.title.trim()),
      dt: doodleType
    };
    if (scheduleEnabled && deliveryDate) {
      payload.dl = new Date(deliveryDate).getTime();
    }
    try {
      const b64 = btoa(
        encodeURIComponent(JSON.stringify(payload)).replace(
          /%([0-9A-F]{2})/g,
          (_, p1) => String.fromCharCode(parseInt(p1, 16))
        )
      );
      const url = `${window.location.origin}/wish?d=${b64}`;
      setGeneratedUrl(url);
      setShortenedUrl("");
      
      playChime();
      confetti({
        particleCount: 80, spread: 60, origin: { y: 0.6 },
        colors: ["#C97B84", "#D8B88A", "#A6B39D", "#FFFFFF"],
      });
      toast.success("Your surprise link is ready!");

      // Call API shortener automatically
      setShorteningLoading(true);
      fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.shortUrl) {
            setShortenedUrl(data.shortUrl);
          }
        })
        .catch(() => {})
        .finally(() => {
          setShorteningLoading(false);
        });

    } catch (err) {
      toast.error("Failed to generate URL");
    }
  };

  const handleCopy = () => {
    const activeUrl = shortenedUrl || generatedUrl;
    if (!activeUrl) return;
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const activeUrl = shortenedUrl || generatedUrl;
    if (!activeUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${name}! 🎂`,
          text: `${sender} made you an interactive birthday surprise!`,
          url: activeUrl,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") toast.error("Share failed");
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FFF8F2]">

      {/* Nav */}
      <header className="relative z-20 border-b border-[#ECE3DA] px-6 py-5 flex items-center justify-between w-full max-w-3xl mx-auto">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C97B84] flex items-center justify-center"
            style={{ boxShadow: "0 2px 6px rgba(201,123,132,0.15)" }}>
            <Gift className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-serif text-lg text-[#2E2A27]" style={{ fontWeight: 500 }}>
            WishMaker<span className="text-[#C97B84]">.</span>
          </span>
        </a>
      </header>

      {/* Centered Main Workspace */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10">
        
        {!generatedUrl ? (
          <>
            <form onSubmit={handleGenerate} className="space-y-5 w-full">
              
              <div className="animate-reveal-up mb-8">
                <h1 className="font-serif text-[2rem] sm:text-[2.5rem] text-[#2E2A27] mb-2" style={{ fontWeight: 400 }}>Craft your keepsake</h1>
                <p className="text-[0.9375rem] text-[#6F655E]">Fill in the details below. Everything will be packed into a single shareable link.</p>
              </div>

              {/* Templates bar */}
              <div className="surface rounded-[1.375rem] p-5 animate-reveal-up">
                <span className="text-[0.6875rem] font-semibold text-[#C97B84] uppercase tracking-[0.12em] block mb-4">Quick Presets</span>
                <div className="grid grid-cols-4 gap-3">
                  {WISH_TEMPLATES.map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => applyTemplate(tmpl)}
                      className={`rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200 group border ${
                        selectedTemplateId === tmpl.id
                          ? "border-[#C97B84] bg-[#C97B84]/[0.04] scale-[1.02]"
                          : "border-[#ECE3DA] bg-white hover:bg-[#F9F5F0]"
                      }`}
                    >
                      <span className={`transition-colors mb-1.5 ${selectedTemplateId === tmpl.id ? "text-[#C97B84]" : "text-[#B5ADA5] group-hover:text-[#C97B84]"}`}>
                        {tmpl.icon}
                      </span>
                      <span className={`text-[0.6875rem] font-semibold ${selectedTemplateId === tmpl.id ? "text-[#2E2A27]" : "text-[#6F655E]"}`}>
                        {tmpl.label.split(" ").slice(-1)[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accordion 1: Basics */}
              <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder("basics")}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
                >
                  <SectionHeader icon={<Gift className="w-3.5 h-3.5" />}>1. Who is it for?</SectionHeader>
                  <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${activeFolder === "basics" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "basics" && (
                  <div className="p-5 space-y-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.75rem] text-[#6F655E] font-semibold mb-1.5">Recipient Name *</label>
                        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Alexa" className="input-saas" />
                      </div>
                      <div>
                        <label className="block text-[0.75rem] text-[#6F655E] font-semibold mb-1.5">Age (optional)</label>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className="input-saas" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[0.75rem] text-[#6F655E] font-semibold mb-1.5">Your Name *</label>
                      <input required value={sender} onChange={e => setSender(e.target.value)} placeholder="Jason" className="input-saas" />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: AI Message Writer */}
              <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "ai-writer" ? "basics" : "ai-writer")}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
                >
                  <SectionHeader icon={<Wand2 className="w-3.5 h-3.5" />}>2. Write the letter</SectionHeader>
                  <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${activeFolder === "ai-writer" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "ai-writer" && (
                  <div className="p-5 space-y-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-[0.75rem] text-[#6F655E] font-semibold mb-1.5">Relationship</label>
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="input-saas text-left flex items-center justify-between"
                        >
                          <span className="capitalize">{aiRelationship}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-[#B5ADA5]" />
                        </button>
                        {dropdownOpen && (
                          <div className="absolute top-[105%] left-0 w-full surface-float z-50 py-1 overflow-hidden">
                            {RELATIONSHIP_OPTIONS.map(r => (
                              <button
                                key={r} type="button"
                                onClick={() => { setAiRelationship(r); setDropdownOpen(false); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-[#6F655E] hover:bg-[#F9F5F0] hover:text-[#2E2A27] capitalize transition-colors"
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[0.75rem] text-[#6F655E] font-semibold mb-1.5">Keywords</label>
                        <input value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} placeholder="coffee, travel" className="input-saas" />
                      </div>
                    </div>

                    {/* Tone Slider */}
                    <div className="py-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[0.75rem] text-[#6F655E] font-semibold">Letter Tone</label>
                        <span className="text-sm font-semibold text-[#C97B84]">{toneLabel(tone)}</span>
                      </div>
                      <div className="relative flex items-center h-4">
                        <input
                          type="range" min={0} max={100} step={25}
                          value={tone} onChange={e => setTone(Number(e.target.value))}
                          className="w-full h-1 bg-[#ECE3DA] rounded-lg appearance-none cursor-pointer accent-[#C97B84]"
                        />
                      </div>
                    </div>

                    <button type="button" onClick={handleGenerateDrafts} disabled={aiLoading}
                      className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                      {aiLoading
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Composing...</>
                        : <><Wand2 className="w-3.5 h-3.5" /> Compose Letter Drafts</>}
                    </button>

                    {aiDrafts.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        {aiDrafts.map((draft, i) => (
                          <button key={i} type="button" onClick={() => { setMessage(draft); toast.success("Letter updated"); }}
                            className={`w-full text-left p-4 rounded-2xl border text-sm leading-relaxed transition-all ${
                              message === draft
                                ? "border-[#C97B84] bg-[#C97B84]/[0.03] text-[#2E2A27]"
                                : "border-[#ECE3DA] bg-white hover:bg-[#F9F5F0] text-[#6F655E]"}`}>
                            <span className="block text-[0.625rem] text-[#B5ADA5] font-semibold uppercase tracking-wider mb-1.5">
                              {["Draft 1 (Heartfelt)", "Draft 2 (Nostalgic)", "Draft 3 (Inspiring)"][i]}
                            </span>
                            {draft}
                          </button>
                        ))}
                      </div>
                    )}

                    <div>
                      <label className="block text-[0.75rem] text-[#6F655E] font-semibold mb-1.5">Letter Text *</label>
                      <textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)}
                        placeholder="Write your heartfelt letter…"
                        className="input-saas resize-none text-sm leading-relaxed" />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Theme & Jingle */}
              <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "theme" ? "basics" : "theme")}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
                >
                  <SectionHeader icon={<Sparkles className="w-3.5 h-3.5" />}>3. Choose the mood</SectionHeader>
                  <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${activeFolder === "theme" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "theme" && (
                  <div className="p-5 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.75rem] text-[#6F655E] font-semibold">Visual Theme</span>
                      <button type="button" onClick={handleRecommendTheme} disabled={themeLoading}
                        className="text-[0.6875rem] text-[#D8B88A] font-semibold uppercase tracking-wide flex items-center gap-1.5 hover:text-[#C4956A] disabled:opacity-50">
                        {themeLoading
                          ? <><Loader2 className="w-3 h-3 animate-spin" /> Matching…</>
                          : <><Lightbulb className="w-3 h-3" /> AI Suggest</>}
                      </button>
                    </div>

                    {themeReason && (
                      <div className="glass-gold rounded-xl px-4 py-3 text-[0.8125rem] text-[#6F655E] leading-normal flex items-start gap-2.5">
                        <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#D8B88A]" />
                        <span>{themeReason}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-5 gap-2.5">
                      {THEMES.map(t => (
                        <button key={t.id} type="button" onClick={() => { setTheme(t.id); setThemeReason(""); }}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                            theme === t.id ? "border-[#C97B84] scale-[1.03] bg-[#F9F5F0]" : "border-[#ECE3DA] bg-white hover:bg-[#F9F5F0]"}`}>
                          <div className="w-5 h-5 rounded-full mb-1.5 border border-[#ECE3DA]" style={{ background: THEME_COLORS[t.id] }} />
                          <span className="font-semibold text-[0.625rem] text-[#2E2A27]">{t.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="surface rounded-2xl p-4 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#2E2A27] mb-0.5 flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-[#D8B88A]" /> Birthday Melody
                        </p>
                        <p className="text-[0.8125rem] text-[#6F655E] leading-normal">Synthesizes a Happy Birthday jingle live in their browser.</p>
                      </div>
                      <button type="button" onClick={handleToggleJingle}
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                          jinglePlaying ? "bg-[#D8B88A]/10 border-[#D8B88A] text-[#D8B88A]" : "bg-white border-[#ECE3DA] text-[#6F655E] hover:text-[#2E2A27] hover:border-[#DDD4CB]"}`}>
                        {jinglePlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Scheduled Lock */}
              <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "schedule" ? "basics" : "schedule")}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
                >
                  <SectionHeader icon={<Clock className="w-3.5 h-3.5" />}>4. Schedule delivery</SectionHeader>
                  <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${activeFolder === "schedule" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "schedule" && (
                  <div className="p-5 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#2E2A27]">Scheduled Surprise</p>
                        <p className="text-[0.8125rem] text-[#6F655E]">Lock the surprise until a chosen time.</p>
                      </div>
                      <button type="button" onClick={() => setScheduleEnabled(!scheduleEnabled)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${scheduleEnabled ? "bg-[#C97B84]" : "bg-[#ECE3DA]"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${scheduleEnabled ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                    {scheduleEnabled && (
                      <div className="animate-reveal-up pt-1">
                        <label className="block text-[0.75rem] text-[#6F655E] font-semibold mb-1.5">Unlock Time</label>
                        <input type="datetime-local" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                          required={scheduleEnabled} className="input-saas" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 5: Choose Keepsake Doodle */}
              <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "doodle" ? "basics" : "doodle")}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
                >
                  <SectionHeader icon={<Heart className="w-3.5 h-3.5" />}>5. Pick a keepsake doodle</SectionHeader>
                  <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${activeFolder === "doodle" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "doodle" && (
                  <div className="p-5 space-y-4 bg-white">
                    <span className="text-[0.75rem] text-[#6F655E] font-semibold block mb-1">Doodle Animation Style</span>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "heart" as const, label: "Classic Heart", desc: "Heart & arrow sketch" },
                        { id: "rose" as const, label: "Blooming Rose", desc: "A lovely single-line rose" },
                        { id: "hearts" as const, label: "Linked Hearts", desc: "Interlocking line hearts" },
                        { id: "coffee" as const, label: "Cozy Coffee", desc: "Steaming coffee cups sketch" }
                      ].map(d => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDoodleType(d.id)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            doodleType === d.id
                              ? "border-[#C97B84] bg-[#C97B84]/[0.03] scale-[1.01]"
                              : "border-[#ECE3DA] bg-white hover:bg-[#F9F5F0]"
                          }`}
                        >
                          <span className="block text-sm font-semibold text-[#2E2A27]">{d.label}</span>
                          <span className="block text-[0.8125rem] text-[#6F655E] mt-0.5 leading-normal">{d.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 6: Relationship Timeline */}
              <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "timeline" ? "basics" : "timeline")}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
                >
                  <SectionHeader icon={<Calendar className="w-3.5 h-3.5" />}>6. Timeline milestones</SectionHeader>
                  <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${activeFolder === "timeline" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "timeline" && (
                  <div className="p-5 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.75rem] text-[#6F655E] font-semibold">Milestones</span>
                      <button type="button" onClick={addTimelineEvent} className="text-[0.75rem] text-[#C97B84] font-semibold flex items-center gap-1 hover:text-[#B5616B]">
                        <Plus className="w-3 h-3" /> Add Event
                      </button>
                    </div>
                    <div className="space-y-3">
                      {timelineEvents.map((ev, i) => (
                        <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-[#F9F5F0] border border-[#ECE3DA]">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Title" value={ev.title} onChange={e => updateTimelineEvent(i, "title", e.target.value)} className="input-saas text-sm py-2.5" />
                            <input type="text" placeholder="Date/Period" value={ev.date} onChange={e => updateTimelineEvent(i, "date", e.target.value)} className="input-saas text-sm py-2.5" />
                          </div>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Event details..." value={ev.description} onChange={e => updateTimelineEvent(i, "description", e.target.value)} className="input-saas text-sm py-2.5 flex-1" />
                            <button type="button" onClick={() => removeTimelineEvent(i)} className="text-[#B5ADA5] hover:text-[#C46D5E] transition-colors px-2">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 7: Memory Lane Grid */}
              <div className="surface rounded-[1.375rem] overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "memories" ? "basics" : "memories")}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#F9F5F0] transition-colors border-b border-[#ECE3DA]"
                >
                  <SectionHeader icon={<Camera className="w-3.5 h-3.5" />}>7. Photo memories</SectionHeader>
                  <ChevronDown className={`w-4 h-4 text-[#B5ADA5] transition-transform ${activeFolder === "memories" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "memories" && (
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

              {/* Submit */}
              <div className="pt-3 animate-reveal-up">
                <button type="submit" className="btn-primary w-full py-4 text-[0.9375rem] flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" /> Create Surprise Link
                </button>
              </div>

            </form>
          </>
        ) : (
          /* ── SUCCESS STATE ── */
          <div className="animate-reveal-up text-center py-16 px-4 flex flex-col items-center max-w-xl mx-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-[#F9F5F0] border border-[#ECE3DA] flex items-center justify-center mb-8"
              style={{ boxShadow: "0 2px 12px rgba(46,42,39,0.04)" }}>
              <Heart className="w-7 h-7 text-[#C97B84] fill-current" />
            </div>
            <h2 className="font-serif text-[2rem] text-[#2E2A27] mb-3" style={{ fontWeight: 400 }}>Your surprise is ready</h2>
            <p className="text-[0.9375rem] text-[#6F655E] max-w-md mb-10">
              Send the link below to {name}.
              {scheduleEnabled && deliveryDate && (
                <span className="block mt-2 text-[#D8B88A] font-medium">
                  🔒 Locked until {new Date(deliveryDate).toLocaleString()}
                </span>
              )}
            </p>

            <div className="w-full space-y-4 mb-8">
              {/* Link Input Box */}
              <div className="w-full surface rounded-2xl p-4 flex gap-3 items-center">
                {shorteningLoading ? (
                  <div className="flex items-center gap-2 text-[#6F655E] text-sm">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Shortening link…</span>
                  </div>
                ) : (
                  <>
                    <input
                      readOnly
                      value={shortenedUrl || generatedUrl}
                      className="flex-1 bg-transparent text-sm text-[#6F655E] font-mono outline-none min-w-0"
                    />
                    <button
                      onClick={handleCopy}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                        copied ? "bg-[#8FA27A]/10 text-[#8FA27A] border border-[#8FA27A]/20" : "btn-primary"
                      }`}
                    >
                      {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button onClick={handleShare} className="flex-1 btn-gold py-3.5 text-sm flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Share Surprise
              </button>
              <a href={shortenedUrl || generatedUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3.5 text-sm text-[#6F655E] font-semibold rounded-[1.375rem] border border-[#ECE3DA] bg-white hover:bg-[#F9F5F0] transition-all flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Preview
              </a>
              <button onClick={() => setGeneratedUrl("")}
                className="flex-1 py-3.5 text-sm text-[#B5ADA5] font-semibold rounded-[1.375rem] border border-[#ECE3DA] bg-white hover:bg-[#F9F5F0] transition-all">
                Create another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
