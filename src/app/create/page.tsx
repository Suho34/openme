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
type RelationType = "best friend" | "partner" | "sibling" | "parent" | "colleague" | "mentor";

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
    id: "parent",
    label: "For a Parent",
    icon: <Users className="w-4 h-4" />,
    description: "Grateful, warm, sincere",
    defaults: {
      theme: "pastel",
      relationship: "parent",
      tone: 60,
      keywords: "gratitude, love, family",
      messagePlaceholder: "Everything I am, I owe to you. Thank you for your endless love and guidance…",
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
  { id: "starry"  as ThemeId, label: "Starry",  gradient: "from-blue-950 via-indigo-950 to-[#08090E]", text: "text-blue-300",   desc: "Deep space" },
  { id: "neon"    as ThemeId, label: "Neon",    gradient: "from-purple-950 via-black to-[#08090E]",    text: "text-cyan-300",   desc: "Electric" },
  { id: "romance" as ThemeId, label: "Romance", gradient: "from-rose-950 via-pink-950 to-[#08090E]",   text: "text-rose-300",   desc: "Warm glow" },
  { id: "pastel"  as ThemeId, label: "Pastel",  gradient: "from-violet-950 via-teal-950 to-[#08090E]",  text: "text-teal-400",   desc: "Dreamy" },
  { id: "retro"   as ThemeId, label: "Retro",   gradient: "from-amber-950 via-orange-950 to-[#08090E]", text: "text-amber-300",  desc: "Vintage" },
];

const RELATIONSHIP_OPTIONS: RelationType[] = [
  "best friend", "partner", "sibling", "parent", "colleague", "mentor",
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

const SectionLabel = ({ icon, children, badge }: {
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
}) => (
  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
    <span className="text-blue-500">{icon}</span>
    {children}
    {badge && (
      <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-blue-500/10 text-blue-400 font-semibold normal-case tracking-normal">
        {badge}
      </span>
    )}
  </div>
);

// ── Main Dashboard ──
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

  // Constellation stars memories state
  const [constellationStars, setConstellationStars] = useState<StarMemory[]>([
    { id: 1, label: "The First Hello", date: "Jan 12, 2021", description: "Our eyes met across the cafe, and a smile started everything.", x: 25, y: 35 },
    { id: 2, label: "City Lights Walk", date: "Jul 18, 2022", description: "A late-night drive, listening to music, wishing it wouldn't end.", x: 60, y: 22 },
  ]);

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [shorteningLoading, setShorteningLoading] = useState(false);
  const [useShortLink, setUseShortLink] = useState(true);
  const [copied, setCopied]             = useState(false);

  // Accordion folder state
  const [activeFolder, setActiveFolder] = useState<"basics" | "ai-writer" | "theme" | "schedule" | "stars" | "timeline" | "memories">("basics");
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

  const addStarMemory = () => setConstellationStars(p => [...p, { id: Date.now(), label: "", date: "", description: "", x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 }]);
  const removeStarMemory = (i: number) => setConstellationStars(p => p.filter((_, idx) => idx !== i));
  const updateStarMemory = (i: number, f: keyof StarMemory, v: any) =>
    setConstellationStars(p => { const n = [...p]; n[i] = { ...n[i], [f]: v }; return n; });

  const handleGenerateDrafts = async () => {
    if (!name || !sender) {
      toast.error("Add names first");
      return;
    }
    setAiLoading(true);
    setAiDrafts([]);
    const loadingToast = toast.loading("Gemini is writing 3 drafts…");
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
    const tid = toast.loading("Analysing your message…");
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
      toast.success(`Theme matched by AI`, { id: tid });
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
      st: constellationStars.filter(st => st.label.trim())
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
      setUseShortLink(true);
      
      playChime();
      confetti({
        particleCount: 80, spread: 60, origin: { y: 0.6 },
        colors: ["#3B82F6", "#818CF8", "#F59E0B", "#ffffff"],
      });
      toast.success("Surprise link generated!");

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
    const activeUrl = useShortLink && shortenedUrl ? shortenedUrl : generatedUrl;
    if (!activeUrl) return;
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const activeUrl = useShortLink && shortenedUrl ? shortenedUrl : generatedUrl;
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

  const currentThemeGradient = THEMES.find(t => t.id === theme)?.gradient ?? THEMES[0].gradient;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#08090E" }}>
      {/* Top ambient radial gradient */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[250px] opacity-25 z-0"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(50px)" }} />

      {/* Nav */}
      <header className="relative z-20 border-b border-white/[0.06] px-6 py-4 flex items-center justify-between w-full">
        <a href="/" className="flex items-center gap-2 text-sm font-bold text-white">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center">
            <Gift className="w-3.5 h-3.5 text-white" />
          </div>
          WishMaker<span className="text-amber-400">.</span>
        </a>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Builder Dashboard</span>
      </header>

      {/* Split-Screen Main Dashboard Workspace */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 gap-8 items-start">
        
        {!generatedUrl ? (
          <>
            {/* Left Column: Form Controls */}
            <form onSubmit={handleGenerate} className="space-y-4 w-full">
              
              <div className="animate-reveal-up mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Create a Surprise Page</h1>
                <p className="text-xs text-slate-500">All data will be packed inside the URL payload.</p>
              </div>

              {/* Templates bar */}
              <div className="surface rounded-xl p-4 animate-reveal-up">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Quick Presets</span>
                <div className="grid grid-cols-4 gap-2">
                  {WISH_TEMPLATES.map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => applyTemplate(tmpl)}
                      className="glass rounded-lg p-2.5 flex flex-col items-center text-center hover:bg-white/[0.08] transition-all duration-150 group"
                    >
                      <span className="text-blue-500 group-hover:text-amber-400 transition-colors mb-1">
                        {tmpl.icon}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">{tmpl.label.split(" ").slice(-1)[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accordion 1: Basics */}
              <div className="surface rounded-xl overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder("basics")}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.015] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04]"
                >
                  <SectionLabel icon={<Gift className="w-3.5 h-3.5" />}>1. Identity Basics</SectionLabel>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFolder === "basics" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "basics" && (
                  <div className="p-5 space-y-4 bg-[#0a0c14]/40">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">Recipient Name *</label>
                        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Alexa" className="input-saas font-medium" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">Age (optional)</label>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className="input-saas font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">Your Name *</label>
                      <input required value={sender} onChange={e => setSender(e.target.value)} placeholder="Jason" className="input-saas font-medium" />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: AI Message Writer */}
              <div className="surface rounded-xl overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "ai-writer" ? "basics" : "ai-writer")}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.015] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04]"
                >
                  <SectionLabel icon={<Wand2 className="w-3.5 h-3.5" />} badge="Gemini">2. AI Letter Writer</SectionLabel>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFolder === "ai-writer" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "ai-writer" && (
                  <div className="p-5 space-y-4 bg-[#0a0c14]/40">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">Relationship</label>
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="input-saas text-left flex items-center justify-between"
                        >
                          <span className="capitalize">{aiRelationship}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                        {dropdownOpen && (
                          <div className="absolute top-[105%] left-0 w-full surface-float z-50 py-1 font-medium overflow-hidden">
                            {RELATIONSHIP_OPTIONS.map(r => (
                              <button
                                key={r} type="button"
                                onClick={() => { setAiRelationship(r); setDropdownOpen(false); }}
                                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-blue-500/10 hover:text-white capitalize"
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">Keywords</label>
                        <input value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} placeholder="coffee, travel" className="input-saas" />
                      </div>
                    </div>

                    {/* Tone Slider */}
                    <div className="py-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Letter Tone</label>
                        <span className="text-xs font-semibold text-blue-400">{toneLabel(tone)}</span>
                      </div>
                      <div className="relative flex items-center h-4">
                        <input
                          type="range" min={0} max={100} step={25}
                          value={tone} onChange={e => setTone(Number(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    </div>

                    <button type="button" onClick={handleGenerateDrafts} disabled={aiLoading}
                      className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                      {aiLoading
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Composing...</>
                        : <><Wand2 className="w-3.5 h-3.5" /> Compose Letter Drafts</>}
                    </button>

                    {aiDrafts.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {aiDrafts.map((draft, i) => (
                          <button key={i} type="button" onClick={() => { setMessage(draft); toast.success("Letter updated"); }}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                              message === draft
                                ? "border-blue-500/60 bg-blue-500/10 text-slate-100 shadow-md"
                                : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-slate-400"}`}>
                            <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                              {["Draft 1 (Heartfelt)", "Draft 2 (Nostalgic)", "Draft 3 (Inspiring)"][i]}
                            </span>
                            {draft}
                          </button>
                        ))}
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">Letter Text *</label>
                      <textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)}
                        placeholder="Write your custom letter..."
                        className="input-saas resize-none text-xs leading-relaxed" />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Theme & Jingle */}
              <div className="surface rounded-xl overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "theme" ? "basics" : "theme")}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.015] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04]"
                >
                  <SectionLabel icon={<Sparkles className="w-3.5 h-3.5" />}>3. Visual Styling & Jingle</SectionLabel>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFolder === "theme" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "theme" && (
                  <div className="p-5 space-y-4 bg-[#0a0c14]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Color Theme</span>
                      <button type="button" onClick={handleRecommendTheme} disabled={themeLoading}
                        className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-amber-400 disabled:opacity-50">
                        {themeLoading
                          ? <><Loader2 className="w-3 h-3 animate-spin" /> Matching…</>
                          : <><Lightbulb className="w-3 h-3" /> AI Select theme</>}
                      </button>
                    </div>

                    {themeReason && (
                      <div className="glass-gold rounded-lg px-3 py-2 text-[10px] text-amber-300 leading-normal flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{themeReason}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-5 gap-2">
                      {THEMES.map(t => (
                        <button key={t.id} type="button" onClick={() => { setTheme(t.id); setThemeReason(""); }}
                          className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all bg-gradient-to-br ${t.gradient} ${
                            theme === t.id ? "border-blue-500 ring-2 ring-blue-500/10 scale-[1.03]" : "border-white/[0.07] hover:border-white/15"}`}>
                          <span className={`font-bold text-[10px] ${t.text}`}>{t.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="glass-blue rounded-xl p-4 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-200 mb-0.5 flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-amber-400" /> Melody Composer
                        </p>
                        <p className="text-[10px] text-slate-500 leading-normal">Synthesizes the Happy Birthday song live in their browser.</p>
                      </div>
                      <button type="button" onClick={handleToggleJingle}
                        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          jinglePlaying ? "bg-amber-500/20 border border-amber-500/30 text-amber-400" : "btn-gold"}`}>
                        {jinglePlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Scheduled Lock */}
              <div className="surface rounded-xl overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "schedule" ? "basics" : "schedule")}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.015] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04]"
                >
                  <SectionLabel icon={<Clock className="w-3.5 h-3.5" />}>4. Delivery Lock</SectionLabel>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFolder === "schedule" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "schedule" && (
                  <div className="p-5 space-y-4 bg-[#0a0c14]/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Scheduled Surprise</p>
                        <p className="text-[10px] text-slate-500">Locks surprise until chosen time.</p>
                      </div>
                      <button type="button" onClick={() => setScheduleEnabled(!scheduleEnabled)}
                        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${scheduleEnabled ? "bg-blue-500" : "bg-white/10"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-200 ${scheduleEnabled ? "translate-x-4.5" : "translate-x-0"}`} />
                      </button>
                    </div>
                    {scheduleEnabled && (
                      <div className="animate-reveal-up pt-1">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">Unlock Time (Local)</label>
                        <input type="datetime-local" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                          required={scheduleEnabled} className="input-saas [color-scheme:dark]" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 5: Constellation Stars */}
              <div className="surface rounded-xl overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "stars" ? "basics" : "stars")}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.015] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04]"
                >
                  <SectionLabel icon={<Star className="w-3.5 h-3.5" />}>5. Memory Stars Constellation</SectionLabel>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFolder === "stars" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "stars" && (
                  <div className="p-5 space-y-4 bg-[#0a0c14]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Constellation Coordinates</span>
                      <button type="button" onClick={addStarMemory} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Star
                      </button>
                    </div>
                    <div className="space-y-4">
                      {constellationStars.map((s, i) => (
                        <div key={s.id} className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Star title" value={s.label} onChange={e => updateStarMemory(i, "label", e.target.value)} className="input-saas text-xs py-2" />
                            <input type="text" placeholder="Date" value={s.date} onChange={e => updateStarMemory(i, "date", e.target.value)} className="input-saas text-xs py-2" />
                          </div>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Memory details..." value={s.description} onChange={e => updateStarMemory(i, "description", e.target.value)} className="input-saas text-xs py-2 flex-1" />
                            <button type="button" onClick={() => removeStarMemory(i)} className="text-slate-600 hover:text-red-400 transition-colors px-2">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 6: Timeline Events */}
              <div className="surface rounded-xl overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "timeline" ? "basics" : "timeline")}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.015] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04]"
                >
                  <SectionLabel icon={<Calendar className="w-3.5 h-3.5" />}>6. Relationship Timeline</SectionLabel>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFolder === "timeline" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "timeline" && (
                  <div className="p-5 space-y-4 bg-[#0a0c14]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Timeline Milestones</span>
                      <button type="button" onClick={addTimelineEvent} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Event
                      </button>
                    </div>
                    <div className="space-y-4">
                      {timelineEvents.map((ev, i) => (
                        <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Title" value={ev.title} onChange={e => updateTimelineEvent(i, "title", e.target.value)} className="input-saas text-xs py-2" />
                            <input type="text" placeholder="Date/Period" value={ev.date} onChange={e => updateTimelineEvent(i, "date", e.target.value)} className="input-saas text-xs py-2" />
                          </div>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Event details..." value={ev.description} onChange={e => updateTimelineEvent(i, "description", e.target.value)} className="input-saas text-xs py-2 flex-1" />
                            <button type="button" onClick={() => removeTimelineEvent(i)} className="text-slate-600 hover:text-red-400 transition-colors px-2">
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
              <div className="surface rounded-xl overflow-hidden animate-reveal-up">
                <button
                  type="button"
                  onClick={() => setActiveFolder(activeFolder === "memories" ? "basics" : "memories")}
                  className="w-full flex items-center justify-between p-4 bg-white/[0.015] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04]"
                >
                  <SectionLabel icon={<Camera className="w-3.5 h-3.5" />}>7. Memory Lane Grid</SectionLabel>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFolder === "memories" ? "rotate-180" : ""}`} />
                </button>
                {activeFolder === "memories" && (
                  <div className="p-5 space-y-4 bg-[#0a0c14]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Shared Photos</span>
                      <button type="button" onClick={addMemory} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Photo
                      </button>
                    </div>
                    <div className="space-y-3">
                      {memories.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl">
                          {m.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.url} alt="Thumbnail" className="w-12 h-12 object-cover rounded-md border border-white/10" />
                          ) : (
                            <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-stone-500">
                              <Camera className="w-4 h-4" />
                            </div>
                          )}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageUpload(e, i)}
                              className="w-full text-[10px] text-stone-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                            />
                            <input
                              type="text"
                              placeholder="Caption…"
                              value={m.caption}
                              onChange={e => updateMemory(i, "caption", e.target.value)}
                              className="input-saas text-xs py-1 px-2 h-7"
                            />
                          </div>
                          <button type="button" onClick={() => removeMemory(i)} className="text-slate-600 hover:text-red-400 transition-colors px-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2 animate-reveal-up">
                <button type="submit" className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" /> Generate Surprise Link
                </button>
              </div>

            </form>

            {/* Right Column: Live Mockup Phone Preview */}
            <div className="sticky top-8 hidden lg:flex flex-col items-center justify-center w-full min-h-[500px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">LIVE PREVIEW</span>
              
              {/* Phone Container */}
              <div className="relative w-[280px] h-[550px] rounded-[38px] border-4 border-slate-800 bg-[#07080D] shadow-2xl overflow-hidden flex flex-col justify-between"
                style={{ boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                
                {/* Phone Speaker notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-800 rounded-b-xl z-50 flex items-center justify-center">
                  <div className="w-12 h-1 bg-black rounded-full" />
                </div>

                {/* Live screen display */}
                <div className={`flex-1 flex flex-col justify-between p-5 pt-8 relative overflow-hidden transition-all duration-500 bg-gradient-to-b ${currentThemeGradient}`}>
                  
                  {/* Decorative mesh glows */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none opacity-40 bg-blue-500 blur-xl" />
                  <div className="absolute bottom-20 -left-10 w-28 h-28 rounded-full pointer-events-none opacity-20 bg-amber-500 blur-xl" />

                  {/* Top Bar status */}
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono relative z-10 select-none">
                    <span>9:41 AM</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">100% 🔋</span>
                  </div>

                  {/* Envelope layout preview */}
                  <div className="flex-1 flex flex-col justify-center items-center relative z-10 pt-4">
                    
                    <div className="w-full aspect-[1.5/1] rounded-lg bg-slate-900/90 border border-white/5 relative overflow-hidden flex items-center justify-center shadow-lg">
                      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-tr from-slate-950 to-slate-900" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
                      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-tl from-slate-950 to-slate-900" style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />
                      <div className="absolute bottom-0 inset-x-0 h-[65%] bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
                      <div className="absolute top-0 left-0 w-full h-[62%] bg-gradient-to-b from-slate-800 to-slate-900 origin-top" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
                      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                        style={{ background: "radial-gradient(circle, #F59E0B 0%, #D97706 100%)" }}>
                        <span className="text-white/80 text-[10px]">✦</span>
                      </div>
                    </div>

                    <div className="text-center mt-5 max-w-[180px]">
                      <h4 className="text-xs font-bold text-slate-100 truncate">For {name || "Someone Special"}</h4>
                      <p className="text-[9px] text-slate-500 mt-1 truncate">surprises by {sender || "A Loved One"}</p>
                    </div>

                  </div>

                  {/* Foot preview */}
                  <div className="text-center text-[7px] text-slate-600 font-mono tracking-widest z-10 uppercase">
                    WishMaker Preview
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          /* ── SUCCESS STATE ── */
          <div className="animate-reveal-up text-center py-12 px-4 flex flex-col items-center col-span-2 max-w-xl mx-auto w-full">
            <div className="w-14 h-14 glass-blue rounded-2xl flex items-center justify-center mb-6 glow-blue">
              <Sparkles className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Surprise Link is Ready</h2>
            <p className="text-xs text-slate-400 max-w-md mb-8">
              Send the link below to {name}.
              {scheduleEnabled && deliveryDate && (
                <span className="block mt-1.5 text-amber-400 font-medium">
                  🔒 Locked until {new Date(deliveryDate).toLocaleString()}
                </span>
              )}
            </p>

            <div className="w-full space-y-4 mb-6">
              {/* Tab Selector */}
              {shortenedUrl && (
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setUseShortLink(true)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      useShortLink
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    Short URL (Easy Share)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseShortLink(false)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      !useShortLink
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    Full URL (Encrypted Offline)
                  </button>
                </div>
              )}

              {/* Link Input Box */}
              <div className="w-full glass rounded-xl p-4 flex gap-3 items-center border border-white/[0.07] bg-white/[0.01]">
                {shorteningLoading ? (
                  <div className="flex items-center gap-2 text-stone-500 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Shortening link for easy sharing…</span>
                  </div>
                ) : (
                  <>
                    <input
                      readOnly
                      value={useShortLink && shortenedUrl ? shortenedUrl : generatedUrl}
                      className="flex-1 bg-transparent text-xs text-stone-400 font-mono outline-none min-w-0"
                    />
                    <button
                      onClick={handleCopy}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                        copied ? "bg-green-500/20 text-green-400 border border-green-500/30" : "btn-primary"
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
              <a href={useShortLink && shortenedUrl ? shortenedUrl : generatedUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3.5 text-sm text-slate-300 font-semibold rounded-xl glass hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Preview surprise
              </a>
              <button onClick={() => setGeneratedUrl("")}
                className="flex-1 py-3.5 text-sm text-slate-500 font-semibold rounded-xl glass hover:bg-white/[0.06] transition-all">
                Create another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
