"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Sparkles,
  Copy,
  ExternalLink,
  Gift,
  Wand2,
  Calendar,
  Check,
  Share2,
  Users,
  Star,
  Heart,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Flame,
  Music,
  Camera,
  Download,
  Smartphone,
} from "lucide-react";
import confetti from "canvas-confetti";
import MemoryLaneForm from "@/components/create/MemoryLaneForm";
import ScrollJarForm from "@/components/create/ScrollJarForm";
import TimeCapsulesForm from "@/components/create/TimeCapsulesForm";
import VoiceRecorder from "@/components/ui/VoiceRecorder";
import TunePicker from "@/components/create/TunePicker";
import CakeStylePicker from "@/components/create/CakeStylePicker";
import type { CakeStyle } from "@/lib/cakeStyles";
import { playChime } from "@/lib/audio";
import { generateMessage, saveWish } from "@/lib/actions";
import Link from "next/link";
import PWAInstallButton from "@/components/pwa/PWAInstallButton";
import type {
  Memory,
  ThemeId,
  TimelineEvent,
  WishTemplate,
  ScrollNote,
  TimeCapsule,
} from "@/lib/types";

const WISH_TEMPLATES: WishTemplate[] = [
  {
    id: "partner",
    label: "Partner",
    icon: <Heart className="w-4 h-4" />,
    description: "Romantic, intimate",
    defaults: {
      theme: "romance",
      convey: "how much they make everyday moments feel magical and cherished.",
      tone: 80,
      keywords: "your laugh, our late night talks, favorite cozy memory",
      prompt: "Write an intimate love letter for a romantic partner that feels lived-in and deeply genuine.",
      messagePlaceholder: "I keep thinking about how easy it is to love being with you, even in the quietest, ordinary moments…",
    },
  },
  {
    id: "best-friend",
    label: "Friend",
    icon: <Star className="w-4 h-4" />,
    description: "Fun & loyal",
    defaults: {
      theme: "neon",
      convey: "how grateful I am for our friendship and all the chaos.",
      tone: 30,
      keywords: "inside jokes, late night calls, always showing up",
      prompt: "Write a warm, fun birthday letter for a close friend with nostalgia and humor.",
      messagePlaceholder: "I still laugh thinking about all our wild memories. Happy birthday to my favorite human…",
    },
  },
  {
    id: "family",
    label: "Family",
    icon: <Users className="w-4 h-4" />,
    description: "Warm & grateful",
    defaults: {
      theme: "pastel",
      convey: "how much you have taught me and how much your support means.",
      tone: 60,
      keywords: "your guidance, family dinners, unwavering care",
      prompt: "Write a heartfelt, respectful birthday letter for family expressing genuine appreciation.",
      messagePlaceholder: "I have learned so much from your warmth and patience over the years…",
    },
  },
  {
    id: "colleague",
    label: "Colleague",
    icon: <Briefcase className="w-4 h-4" />,
    description: "Respectful & warm",
    defaults: {
      theme: "starry",
      convey: "how inspiring it is to collaborate and work together.",
      tone: 50,
      keywords: "great teamwork, launches, calm in chaos",
      prompt: "Write a warm, professional birthday message for a respected colleague.",
      messagePlaceholder: "Happy birthday! Working with you always makes the hardest projects feel rewarding…",
    },
  },
];

const STEPS = [
  { id: 1, title: "The Honoree", icon: <Gift className="w-4 h-4" /> },
  { id: 2, title: "The Letter", icon: <Heart className="w-4 h-4" /> },
  { id: 3, title: "Cake & Melody", icon: <Flame className="w-4 h-4" /> },
  { id: 4, title: "Jar of Scrolls", icon: <Sparkles className="w-4 h-4" /> },
  { id: 5, title: "Memories & Capsules", icon: <Camera className="w-4 h-4" /> },
  { id: 6, title: "Delivery", icon: <Calendar className="w-4 h-4" /> },
];

export default function CreateSurprise() {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<ThemeId>("romance");
  const [voiceNoteUrl, setVoiceNoteUrl] = useState("");
  const [memories, setMemories] = useState<Memory[]>([
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
      caption: "A favorite memory we share",
    },
  ]);
  const [scrollNotes, setScrollNotes] = useState<ScrollNote[]>([]);
  const [scrollJarTitle, setScrollJarTitle] = useState("Jar of Little Scrolls");
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("partner");
  const [tuneUrl, setTuneUrl] = useState("");
  const [cakeStyle, setCakeStyle] = useState<CakeStyle>("classic");

  // Scheduled delivery
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");

  // AI letter writer
  const [aiWhatToSay, setAiWhatToSay] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiDrafts, setAiDrafts] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [tone, setTone] = useState(75);

  const applyTemplate = (tmpl: WishTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setTheme(tmpl.defaults.theme);
    setAiWhatToSay(tmpl.defaults.convey);
    setTone(tmpl.defaults.tone);
    setAiKeywords(tmpl.defaults.keywords);
    setMessage(tmpl.defaults.messagePlaceholder);
    toast.success(`${tmpl.label} preset applied`);
  };

  const handleGenerateDrafts = async () => {
    if (!name || !sender) {
      toast.error("Please fill in both names first");
      setCurrentStep(1);
      return;
    }
    setAiLoading(true);
    setAiDrafts([]);
    const loadingToast = toast.loading("Composing heartfelt letters with AI…");
    try {
      const toneDesc =
        tone <= 30
          ? "playful and funny"
          : tone <= 60
            ? "warm and sincere"
            : "deeply romantic, poetic and emotional";

      const data = await generateMessage({
        name,
        sender,
        whatToSay: aiWhatToSay,
        keywords: aiKeywords,
        toneDescription: toneDesc,
      });
      setAiDrafts(data.drafts);
      toast.success("Letters composed! Select your favorite below", { id: loadingToast });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to draft letter";
      toast.error(msg, { id: loadingToast });
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter the recipient's name");
      setCurrentStep(1);
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a birthday letter");
      setCurrentStep(2);
      return;
    }

    setIsGenerating(true);
    const activeMemories = memories.filter((m) => m.url.trim());
    const payload: Record<string, unknown> = {
      name: name.trim() || "Someone Special",
      age: age ? parseInt(age) : undefined,
      sender: sender.trim() || "A Loved One",
      message: message.trim(),
      theme: "romance",
      memories: activeMemories,
      timeline: timelineEvents.filter((ev) => ev.title.trim()),
      voiceNoteUrl: voiceNoteUrl || undefined,
      tuneUrl: tuneUrl || undefined,
      cakeStyle,
      scrollNotes: scrollNotes.filter((s) => s.text.trim()),
      scrollJarTitle: scrollJarTitle.trim() || "Jar of Little Scrolls",
      timeCapsules: timeCapsules.filter((c) => c.prompt.trim() && c.message.trim()),
    };

    if (scheduleEnabled && deliveryDate) {
      payload.deliveryLock = new Date(deliveryDate).getTime();
    }

    try {
      const data = await saveWish(payload);
      const url = `${window.location.origin}/wish/${data.id}`;
      setGeneratedUrl(url);

      playChime();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8B2635", "#C5A059", "#FAF6F0", "#3B271E"],
      });
      toast.success("Your keepsake is sealed and ready!");
    } catch {
      toast.error("Failed to save wish.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Keepsake link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!generatedUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${name}! 🎂`,
          text: `${sender} made you an intimate birthday keepsake!`,
          url: generatedUrl,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Keepsake link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#FAF6F0] text-[#2A231F] selection:bg-[#8B2635]/20">
      {/* ── Studio Header ── */}
      <header className="relative z-20 border-b border-[#E3D4B8] px-6 py-5 flex items-center justify-between w-full max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#8B2635] to-[#721C28] flex items-center justify-center shadow-sm wax-seal-shadow">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="font-serif text-xl text-[#2A231F] font-medium tracking-tight">
            WishMaker<span className="text-[#8B2635]">.</span> Studio
          </span>
        </Link>

        <PWAInstallButton variant="nav" />
      </header>

      {/* ── Main Workshop ── */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {!generatedUrl ? (
          <div>
            {/* Step Navigation Pill Bar */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 border-b border-[#E3D4B8]/60">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isPassed = currentStep > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#8B2635] text-white shadow-xs"
                        : isPassed
                          ? "text-[#8B2635] bg-[#8B2635]/8"
                          : "text-[#7A6F62] hover:bg-[#F4EFE6]"
                    }`}
                  >
                    <span>{step.icon}</span>
                    <span className="hidden sm:inline">{step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Title & Introduction */}
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#8B2635]">
                Candlelight &amp; Linen • Step {currentStep} of 6
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2A231F] mt-1 font-normal tracking-tight">
                {currentStep === 1 && "Who are you celebrating?"}
                {currentStep === 2 && "The Handwritten Letter"}
                {currentStep === 3 && "Artisan Cake & Melody"}
                {currentStep === 4 && "Jar of Little Scrolls"}
                {currentStep === 5 && "Memories & Time Capsules"}
                {currentStep === 6 && "Delivery & Whispered Voice"}
              </h1>
              <p className="text-sm text-[#7A6F62] font-serif italic mt-1.5">
                {currentStep === 1 && "Start by naming the honoree and choosing their relationship."}
                {currentStep === 2 && "Write your heartfelt message with live cursive handwriting."}
                {currentStep === 3 && "Pick an artisan cake and gentle melody for when candles are blown."}
                {currentStep === 4 && "Fill an antique glass jar with inside jokes, memories, or appreciation."}
                {currentStep === 5 && "Add polaroid snapshots and sealed 'Open When...' digital capsules."}
                {currentStep === 6 && "Add a whispered voice note and seal the date."}
              </p>
            </div>

            {/* ── STEP 1: The Honoree ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Presets */}
                <div className="paper-deckle p-5 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <p className="text-xs font-semibold text-[#8B2635] uppercase tracking-wider mb-3">
                    Relationship Preset
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {WISH_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          selectedTemplateId === tmpl.id
                            ? "border-[#8B2635] bg-[#8B2635]/8 shadow-xs"
                            : "border-[#E3D4B8] bg-white hover:bg-[#F4EFE6]"
                        }`}
                      >
                        <span className={`mb-1 ${selectedTemplateId === tmpl.id ? "text-[#8B2635]" : "text-[#7A6F62]"}`}>
                          {tmpl.icon}
                        </span>
                        <span className="text-xs font-semibold text-[#2A231F]">{tmpl.label}</span>
                        <span className="text-[10px] text-[#7A6F62]">{tmpl.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="paper-deckle p-6 rounded-lg space-y-4 border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#554A44] mb-1.5">
                        Recipient Name *
                      </label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Elena"
                        className="input-saas"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#554A44] mb-1.5">
                        Their Age (Optional)
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        className="input-saas"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#554A44] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      required
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="Alexander"
                      className="input-saas"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!name.trim()) return toast.error("Please enter the recipient's name");
                      setCurrentStep(2);
                    }}
                    className="btn-primary"
                  >
                    Next: Write Letter <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: The Letter ── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* AI Assistant Card */}
                <div className="paper-deckle p-5 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#8B2635] uppercase tracking-wider">
                      <Wand2 className="w-3.5 h-3.5" />
                      Gemini AI Letter Writer
                    </span>
                    <span className="text-[10px] text-[#7A6F62] font-serif italic">
                      Need help putting feelings into words?
                    </span>
                  </div>

                  <div className="space-y-3">
                    <input
                      value={aiWhatToSay}
                      onChange={(e) => setAiWhatToSay(e.target.value)}
                      placeholder="What feeling do you want to convey? (e.g. how much ordinary days shine with you)"
                      className="input-saas text-xs"
                    />
                    <input
                      value={aiKeywords}
                      onChange={(e) => setAiKeywords(e.target.value)}
                      placeholder="Specific memories, inside jokes, or small habits to weave in"
                      className="input-saas text-xs"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#7A6F62]">
                        Tone: {tone > 60 ? "Deeply Romantic & Poetic" : "Warm & Playful"}
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateDrafts}
                        disabled={aiLoading}
                        className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {aiLoading ? "Composing..." : "Compose 3 Drafts"}
                      </button>
                    </div>

                    {/* AI Draft Suggestions */}
                    {aiDrafts.length > 0 && (
                      <div className="space-y-2.5 pt-3 border-t border-[#E3D4B8]">
                        <p className="text-[11px] font-semibold text-[#8B2635]">Tap a draft to use it:</p>
                        {aiDrafts.map((draft, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setMessage(draft);
                              toast.success("Draft applied to your letter!");
                            }}
                            className="p-3 rounded-lg border border-[#E3D4B8] bg-white text-xs leading-relaxed text-[#554A44] font-serif italic cursor-pointer hover:border-[#8B2635] hover:bg-[#FAF6F0] transition-colors"
                          >
                            &ldquo;{draft}&rdquo;
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* The Letter Parchment Canvas */}
                <div className="paper-deckle p-6 sm:p-8 rounded-sm border border-[#E3D4B8]" style={{ background: "#F4EFE6" }}>
                  <div className="flex items-center justify-between border-b border-[#E3D4B8] pb-3 mb-4">
                    <span className="font-serif text-sm text-[#8B2635] font-semibold uppercase tracking-widest">
                      Cotton Rag Letter
                    </span>
                    <span className="text-xs font-serif italic text-[#7A6F62]">
                      Live Calligraphy Preview
                    </span>
                  </div>

                  <p className="font-handwriting text-3xl text-[#2A231F] mb-3 ink-bleed">
                    My Dearest {name || "Elena"},
                  </p>

                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your heartfelt letter here... (It will render in flowing calligraphy for your recipient)"
                    className="w-full bg-transparent border-0 outline-none resize-none font-handwriting text-2xl text-[#2A231F] leading-relaxed ink-bleed placeholder:text-stone-400 placeholder:font-sans placeholder:text-sm"
                  />

                  <div className="pt-4 text-right border-t border-[#E3D4B8]">
                    <p className="text-xs font-serif italic text-[#7A6F62]">Forever yours,</p>
                    <p className="font-handwriting text-2xl text-[#8B2635] ink-bleed mt-1">
                      {sender || "Your Name"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={() => setCurrentStep(1)} className="btn-ghost">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!message.trim()) return toast.error("Please write a birthday message");
                      setCurrentStep(3);
                    }}
                    className="btn-primary"
                  >
                    Next: Cake &amp; Melody <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Cake & Melody ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="paper-deckle p-6 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <CakeStylePicker value={cakeStyle} onSelect={setCakeStyle} />
                </div>

                <div className="paper-deckle p-6 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <TunePicker
                    value={tuneUrl}
                    onSelect={setTuneUrl}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={() => setCurrentStep(2)} className="btn-ghost">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={() => setCurrentStep(4)} className="btn-primary">
                    Next: Jar of Scrolls <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Jar of Little Scrolls ── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="paper-deckle p-6 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <ScrollJarForm
                    scrollNotes={scrollNotes}
                    onChange={setScrollNotes}
                    scrollJarTitle={scrollJarTitle}
                    onTitleChange={setScrollJarTitle}
                    recipientName={name}
                    senderName={sender}
                    relationship={selectedTemplateId}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={() => setCurrentStep(3)} className="btn-ghost">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={() => setCurrentStep(5)} className="btn-primary">
                    Next: Memories &amp; Capsules <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Photo Memories & Time Capsules ── */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Photo Scrapbook */}
                <div className="paper-deckle p-6 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <MemoryLaneForm
                    memories={memories}
                    onChange={setMemories}
                    recipientName={name}
                  />
                </div>

                {/* Open When... Time Capsules */}
                <div className="paper-deckle p-6 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <TimeCapsulesForm
                    capsules={timeCapsules}
                    onChange={setTimeCapsules}
                    recipientName={name}
                    relationship={selectedTemplateId}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={() => setCurrentStep(4)} className="btn-ghost">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={() => setCurrentStep(6)} className="btn-primary">
                    Next: Delivery &amp; Voice <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 6: Delivery & Whispered Voice ── */}
            {currentStep === 6 && (
              <div className="space-y-6">
                {/* Voice Note Recorder */}
                <div className="paper-deckle p-6 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <div className="mb-3">
                    <h3 className="font-serif text-lg text-[#2A231F] font-semibold">
                      Whispered Voice Memo (Optional)
                    </h3>
                    <p className="text-xs text-[#7A6F62] font-serif italic mt-0.5">
                      Record a 15–30 second audio message. They will hear your actual voice right after the memory scrapbook and before the grand finale.
                    </p>
                  </div>
                  <VoiceRecorder
                    onRecordingComplete={(url) => setVoiceNoteUrl(url)}
                    onClear={() => setVoiceNoteUrl("")}
                  />
                </div>

                {/* Delivery Lock */}
                <div className="paper-deckle p-6 rounded-lg border border-[#E3D4B8]" style={{ background: "#FBF8F2" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-lg text-[#2A231F] font-semibold">
                        Scheduled Time-Lock (Optional)
                      </h3>
                      <p className="text-xs text-[#7A6F62] font-serif italic">
                        Lock the surprise behind a countdown until their actual birthday.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={scheduleEnabled}
                      onChange={(e) => setScheduleEnabled(e.target.checked)}
                      className="w-5 h-5 accent-[#8B2635] cursor-pointer"
                    />
                  </div>

                  {scheduleEnabled && (
                    <input
                      type="datetime-local"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="input-saas mt-2"
                    />
                  )}
                </div>

                {/* Final Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={() => setCurrentStep(5)} className="btn-ghost">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="btn-primary py-4 px-8 text-base shadow-lg"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                    {isGenerating ? "Sealing Keepsake..." : "Seal & Generate Surprise Link"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Generated Keepsake Reveal Screen ── */
          <div className="paper-deckle p-8 sm:p-12 text-center rounded-sm max-w-md mx-auto border border-[#E3D4B8] animate-reveal-up" style={{ background: "#F8F5EE" }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-5 wax-seal-shadow flex items-center justify-center bg-linear-to-br from-[#A33B49] via-[#8B2635] to-[#5A121E]">
              <Heart className="w-7 h-7 text-white fill-white/80" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B2635]">
              Sealed with a Promise
            </span>

            <h2 className="font-serif text-3xl text-[#2A231F] mt-1 mb-2">
              Your keepsake is ready for {name}
            </h2>

            <p className="text-xs text-[#7A6F62] font-serif italic mb-8">
              Send this single link. When opened, it will unfold into the candlelit celebration you just created.
            </p>

            {/* Share & Copy Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleShare}
                className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <Share2 className="w-4 h-4" />
                Send Surprise (WhatsApp / Native Share)
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full btn-ghost py-3 text-sm font-semibold flex items-center justify-center gap-2 bg-white"
              >
                {copied ? <Check className="w-4 h-4 text-[#7D8B75]" /> : <Copy className="w-4 h-4" />}
                {copied ? "Link Copied!" : "Copy Keepsake Link"}
              </button>

              <Link
                href={generatedUrl}
                target="_blank"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-[#8B2635] hover:underline pt-2 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview how {name} will see it
              </Link>
            </div>

            {/* PWA Install Callout */}
            <div className="mt-8 pt-6 border-t border-[#E3D4B8] text-center">
              <p className="text-[11px] text-[#7A6F62] mb-3 font-serif italic">
                Love WishMaker? Keep it on your home screen with one tap:
              </p>
              <PWAInstallButton variant="card" alwaysShow={true} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
