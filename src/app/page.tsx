"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Shield,
  ChevronRight,
  Camera,
  Sparkles,
  Download,
  Flame,
  Smartphone,
} from "lucide-react";

/* ── Floating warm embers rising through the hero ── */
const FLOATING_EMBERS = [
  { left: "8%", size: 14, delay: "0s", duration: "10s", alpha: 0.3 },
  { left: "20%", size: 10, delay: "2.4s", duration: "12s", alpha: 0.25 },
  { left: "34%", size: 16, delay: "1.2s", duration: "9s", alpha: 0.35 },
  { left: "48%", size: 12, delay: "4s", duration: "13s", alpha: 0.2 },
  { left: "62%", size: 18, delay: "0.6s", duration: "11s", alpha: 0.3 },
  { left: "75%", size: 10, delay: "3.2s", duration: "10s", alpha: 0.25 },
  { left: "88%", size: 14, delay: "1.8s", duration: "12.5s", alpha: 0.28 },
];

function FloatingEmbers() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {FLOATING_EMBERS.map((h, i) => (
        <Heart
          key={i}
          className="absolute -bottom-10 animate-float-heart fill-current"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            color: `rgba(139,38,53,${h.alpha})`,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Editorial Chapters ── */
const CHAPTERS = [
  {
    num: "01",
    tagline: "SEALED WITH WAX",
    title: "The Deckle-Edge Letter",
    description:
      "A textured cotton-rag parchment sealed with an embossed crimson wax stamp. One gentle tap cracks the seal with haptics and acoustic sound, revealing your letter in authentic cursive calligraphy.",
    icon: <Heart className="w-5 h-5 text-[#8B2635]" />,
  },
  {
    num: "02",
    tagline: "CANDLELIT RITUAL",
    title: "3D Artisan Bakery Cake",
    description:
      "Resting on a scalloped porcelain plate on an aged walnut table. Five glowing beeswax candles illuminate the room — blow into your microphone or touch the flames to extinguish them with curls of smoke.",
    icon: <Flame className="w-5 h-5 text-[#C5A059]" />,
  },
  {
    num: "03",
    tagline: "HEIRLOOM MEMORIES",
    title: "Linen & Brass Scrapbook",
    description:
      "Your shared moments mounted with aged brass photo corners, rose-gold washi tape, and handwritten ink captions. Swipe like flipping through an authentic leather-bound photo album.",
    icon: <Camera className="w-5 h-5 text-[#8B2635]" />,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#FAF6F0] text-[#2A231F] selection:bg-[#8B2635]/20 selection:text-[#2A231F]">
      {/* ── Warm Candlelight Ambient Glow ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[48rem] z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[55rem] h-[35rem] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(197,160,89,0.22) 0%, rgba(139,38,53,0.08) 50%, transparent 75%)",
          }}
        />
        <div
          className="absolute top-28 -left-32 w-96 h-96 rounded-full opacity-45 animate-orb-drift"
          style={{
            background:
              "radial-gradient(circle, rgba(139,38,53,0.16) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-52 -right-32 w-96 h-96 rounded-full opacity-45 animate-orb-drift"
          style={{
            background:
              "radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%)",
            animationDelay: "-8s",
          }}
        />
      </div>

      {/* ── Navigation Header ── */}
      <header className="relative z-20 max-w-5xl mx-auto w-full px-6 py-7 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#8B2635] to-[#721C28] flex items-center justify-center shadow-sm wax-seal-shadow transition-transform group-hover:scale-105">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="font-serif text-xl text-[#2A231F] font-medium tracking-tight">
            WishMaker<span className="text-[#8B2635]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/create"
            className="btn-primary text-xs sm:text-sm py-2.5 px-5"
          >
            Craft Surprise
          </Link>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-12 sm:pt-20 pb-20 sm:pb-28">
        <FloatingEmbers />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Editorial & Romance Copy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <h1 className="font-serif text-[3.25rem] sm:text-[4.25rem] lg:text-[4.75rem] leading-[1.05] text-[#2A231F] mb-6 tracking-tight text-balance">
              Every{" "}
              <span className="font-handwriting text-[3.75rem] sm:text-[5rem] lg:text-[5.5rem] text-[#8B2635] font-normal leading-none">
                birthday
              </span>{" "}
              deserves more than a{" "}
              <span className="font-handwriting text-[3.75rem] sm:text-[5rem] lg:text-[5.5rem] text-[#8B2635] font-normal leading-none">
                message.
              </span>
            </h1>

            <p className="text-lg text-[#554A44] font-serif italic leading-relaxed max-w-xl mb-9">
              Turn your deepest feelings into an authentic, candlelit keepsake
              &mdash; an unfolding cotton-rag letter, a 3D bakery cake you can
              blow out or touch, and a turnable photo scrapbook. All in one
              loving link, or crafted right inside our Android app.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link href="/create">
                <button className="btn-primary w-full sm:w-auto px-8 py-4 text-base">
                  Craft Your Surprise <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </Link>

              <Link href="/wish?demo=true">
                <button className="btn-ghost w-full sm:w-auto px-6 py-4 text-sm font-semibold">
                  Preview Recipient Demo{" "}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </Link>
            </div>

            {/* Trust and Feature Points */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-8 text-xs text-[#7A6F62] font-medium">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#8B2635] fill-current" />
                Made with love
              </span>
              <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
              <span>Zero accounts needed</span>
              <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#7D8B75]" />
                Private &amp; Client-Encrypted
              </span>
            </div>
          </div>

          {/* Right: The Candlelight & Linen Keepsake Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative max-w-sm mx-auto">
              {/* Parchment Letter preview frame */}
              <div
                className="paper-deckle p-6 sm:p-7 rounded-sm relative transform -rotate-1 hover:rotate-0 transition-transform duration-500"
                style={{
                  background: "#F4EFE6",
                  boxShadow:
                    "0 25px 50px -12px rgba(59, 39, 30, 0.22), 0 0 0 1px rgba(227, 212, 184, 0.9)",
                }}
              >
                {/* Crimson Wax Seal Emblem */}
                <div className="w-12 h-12 rounded-full absolute -top-5 left-8 wax-seal-shadow flex items-center justify-center bg-linear-to-br from-[#A33B49] via-[#8B2635] to-[#5A121E]">
                  <Heart className="w-5 h-5 text-white/90 fill-white/80" />
                </div>

                <div className="pt-5 pb-3">
                  <div className="flex items-center justify-between border-b border-[#E3D4B8] pb-3 mb-4">
                    <span className="text-[9px] uppercase tracking-widest text-[#8B2635] font-semibold">
                      Chapter I • The Letter
                    </span>
                    <span className="text-[9px] font-serif italic text-[#7A6F62]">
                      Sealed with love
                    </span>
                  </div>

                  <p className="font-handwriting text-2xl sm:text-3xl text-[#2A231F] leading-tight ink-bleed mb-2">
                    My Dearest,
                  </p>
                  <p className="font-handwriting text-xl text-[#2A231F] leading-relaxed ink-bleed">
                    Every candle lit tonight carries a wish I’ve made for you.
                    Happy Birthday, my favorite person in the universe.
                  </p>
                </div>

                {/* Overlapping Polaroid Memory Card */}
                <div
                  className="paper-deckle p-2.5 pb-8 rounded-xs absolute -bottom-10 -right-4 w-44 sm:w-48 transform rotate-6 shadow-xl border border-[#E3D4B8]"
                  style={{ background: "#FAF7F2" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop&q=80"
                    alt="Birthday memory"
                    className="w-full aspect-square object-cover rounded-xs"
                  />
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]" />
                  <p className="font-handwriting text-sm text-[#2A231F] text-center mt-2.5 ink-bleed absolute bottom-2 left-0 right-0">
                    Always with you ♥
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Three Keepsake Chapters ── */}
      <section className="relative z-10 w-full bg-[#F4EFE6] border-y border-[#E3D4B8] py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-px bg-[#C5A059]/50" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B2635]">
                The Sensory Journey
              </span>
              <span className="w-8 h-px bg-[#C5A059]/50" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2A231F] font-normal tracking-tight">
              Crafted as an heirloom keepsake
            </h2>
            <p className="text-sm text-[#7A6F62] font-serif italic mt-2">
              Three synchronized chapters designed to make them feel deeply
              loved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CHAPTERS.map((c) => (
              <div
                key={c.num}
                className="paper-deckle p-8 rounded-lg flex flex-col justify-between border border-[#E3D4B8] relative group hover:-translate-y-1 transition-transform duration-300"
                style={{ background: "#FBF8F2" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E3D4B8] flex items-center justify-center shadow-xs">
                      {c.icon}
                    </span>
                    <span className="font-mono text-xs text-[#C5A059] font-medium">
                      {c.num}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-[#8B2635] font-semibold">
                    {c.tagline}
                  </span>
                  <h3 className="font-serif text-2xl text-[#2A231F] mt-1 mb-3">
                    {c.title}
                  </h3>
                  <p className="text-sm text-[#554A44] leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Android App Feature Banner ── */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-6 py-20">
        <div
          className="paper-deckle rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background:
              "linear-gradient(135deg, #3B271E 0%, #261610 70%, #150B07 100%)",
            color: "#FAF6F0",
            boxShadow: "0 25px 50px -12px rgba(38, 22, 16, 0.45)",
          }}
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#EADDC9] text-[10px] font-semibold uppercase tracking-widest mb-4">
              <Smartphone className="w-3.5 h-3.5 text-[#C5A059]" />
              Designed for Mobile & Desktop
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF6F0] mb-3">
              Craft surprises on your phone. Send with one tap.
            </h3>
            <p className="text-sm text-[#EADDC9]/80 leading-relaxed font-serif italic mb-6">
              Create a personalized keepsake right from your mobile browser. Fill in your
              wishes, upload your favorite photos, and share directly with those who matter most.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/create"
                className="btn-gold px-6 py-3 text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-40 sm:w-48 aspect-square rounded-full border border-[#C5A059]/30 flex items-center justify-center p-6 bg-black/20 backdrop-blur-xs text-center">
            <div>
              <Heart className="w-8 h-8 text-[#C5A059] mx-auto mb-2 fill-current" />
              <p className="text-xs uppercase tracking-wider text-[#FAF6F0] font-semibold">
                WishMaker
              </p>
              <p className="text-[10px] text-[#EADDC9]/70 font-mono mt-0.5">
                v2.0
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[#E3D4B8] py-12 text-center text-xs text-[#7A6F62] bg-[#F4EFE6]/60">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif italic text-sm text-[#2A231F]">
            WishMaker. Crafted with love for the people who truly matter.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/create"
              className="text-[#8B2635] hover:underline font-semibold"
            >
              Create a Surprise
            </Link>
            <Link
              href="/wish?demo=true"
              className="hover:text-[#2A231F]"
            >
              Experience Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
