"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  Heart,
  Shield,
  ChevronRight,
  Camera,
  Sparkles,
  Music,
  Cake,
} from "lucide-react";
import Image from "next/image";

/* ── Floating hearts rising through the hero ── */
const FLOATING_HEARTS = [
  { left: "6%", size: 18, delay: "0s", duration: "9s", alpha: 0.35 },
  { left: "16%", size: 12, delay: "2.4s", duration: "11s", alpha: 0.26 },
  { left: "28%", size: 22, delay: "1.2s", duration: "8s", alpha: 0.3 },
  { left: "40%", size: 14, delay: "4s", duration: "12s", alpha: 0.24 },
  { left: "52%", size: 20, delay: "0.6s", duration: "10s", alpha: 0.32 },
  { left: "64%", size: 12, delay: "3.2s", duration: "9.5s", alpha: 0.26 },
  { left: "76%", size: 17, delay: "1.8s", duration: "11.5s", alpha: 0.3 },
  { left: "88%", size: 13, delay: "5s", duration: "8.5s", alpha: 0.28 },
];

function FloatingHearts() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {FLOATING_HEARTS.map((h, i) => (
        <Heart
          key={i}
          className="absolute -bottom-10 animate-float-heart fill-current"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            color: `rgba(201,123,132,${h.alpha})`,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Editorial "How It Works" steps ── */
const STEPS = [
  {
    num: "01",
    title: "Collect your favourite moments",
    description:
      "Gather the photographs, the milestones, the tiny in-jokes only the two of you understand. Every one becomes a page in a keepsake made just for them.",
    icon: <Camera className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "Weave your story with love",
    description:
      "Write the letter you've always meant to write — or let AI find the words when your heart runs ahead of your typing. Pick a theme that feels like the two of you.",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "Send one magical link",
    description:
      "Everything folds into a single link. The moment they open it, the candles light, the music plays, and they feel exactly how much they mean to you.",
    icon: <Gift className="w-5 h-5" />,
  },
];

/* ── Feature highlights ── */
const FEATURES = [
  {
    title: "Wax Seal Envelope",
    tagline: "sealed with a promise",
    description:
      "A textured paper envelope sealed with a crimson wax stamp. One tap cracks the seal and your letter begins.",
  },
  {
    title: "Heartfelt AI Letter",
    tagline: "words straight from your heart",
    description:
      "Write your own words, or let AI compose three drafts tuned to your relationship — from playful to deeply formal.",
  },
  {
    title: "3D Candle Blowing",
    tagline: "make every wish",
    description:
      "A custom 3D cake renders in their browser. They blow into their microphone and the candles flicker out, one by one.",
  },
  {
    title: "Memory Lane Gallery",
    tagline: "every picture tells your story",
    description:
      "Your shared photographs appear as tilted Polaroids with handwritten captions — just like flipping through a real scrapbook.",
  },
  {
    title: "Birthday Melody",
    tagline: "a song just for them",
    description:
      "A real Happy Birthday tune plays when the cake appears and returns for the finale — or pick any song that means something to them.",
  },
  {
    title: "Keepsake Doodles",
    tagline: "drawn with love",
    description:
      "Watch a hand-sketched heart, blooming rose, or cozy coffee cup trace itself on screen to reveal your message.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#FFF8F2]">
      {/* ── Warm ambient glow orbs ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-190 z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-225 h-140 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(216,184,138,0.18) 0%, rgba(216,184,138,0.07) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-24 -left-32 w-105 h-105 rounded-full opacity-45 animate-orb-drift"
          style={{
            background:
              "radial-gradient(circle, rgba(201,123,132,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-48 -right-32 w-105 h-105 rounded-full opacity-45 animate-orb-drift"
          style={{
            background:
              "radial-gradient(circle, rgba(166,179,157,0.13) 0%, transparent 70%)",
            animationDelay: "-8s",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-20 max-w-5xl mx-auto w-full px-6 py-7 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={"/wm-logo.svg"} alt="WishMaker" width={45} height={45} />

          <span
            className="font-serif text-xl tracking-tight text-[#2E2A27]"
            style={{ fontWeight: 500 }}
          >
            WishMaker<span className="text-[#C97B84]">.</span>
          </span>
        </div>

        <Link
          href="#features"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#2E2A27] hover:text-[#C97B84] transition-colors"
        >
          Features <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
        <FloatingHearts />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial copy */}
          <div className="flex flex-col items-start max-w-lg">
            <h1
              className="animate-reveal-up delay-75 font-serif text-[3.5rem] sm:text-[4.5rem] lg:text-[5rem] leading-none text-[#2E2A27] mb-8 text-balance"
              style={{ fontWeight: 400, letterSpacing: "-0.03em" }}
            >
              Every{" "}
              <span className="italic font-cursive text-[#C97B84]">
                birthday
              </span>{" "}
              deserves more than a{" "}
              <span className="italic font-cursive text-[#C97B84]">
                message.
              </span>
            </h1>

            <p className="animate-reveal-up delay-150 text-[1.125rem] text-[#6F655E] leading-[1.75] max-w-152 mb-10">
              Turn your warmest words into a birthday they&rsquo;ll never forget
              &mdash; a letter, a cake to blow out, your photos, and a song, all
              in one loving link.
            </p>

            <div className="animate-reveal-up delay-225 flex flex-col sm:flex-row items-start gap-4">
              <Link href="/create">
                <button className="btn-primary px-8 py-4 text-[1rem]">
                  Create Your Surprise <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/wish?d=eyJuIjoiQWxleGEiLCJhIjoyNSwicyI6Ikphc29uIiwibSI6IllvdSBicmluZyBzbyBtdWNoIGxpZ2h0IGFuZCBqb3kgaW50byBteSBsaWZlLiBFdmVyeSBzaW5nbGUgbW9tZW50IHNoYXJlZCB3aXRoIHlvdSBpcyBhIG1lbW9yeSBJIHRyZWFzdXJlLiBIYXBweSBCaXJ0aGRheSEiLCJ0Ijoicm9tYW5jZSIsImRlbW8iOnRydWV9">
                <button className="btn-ghost px-6 py-4 text-[1rem]">
                  See a Demo <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            <p className="animate-reveal-up delay-300 flex items-center gap-2 mt-8 text-[0.6875rem] text-[#B5ADA5] font-medium tracking-wide">
              <Heart className="w-3.5 h-3.5 text-[#C97B84]" />
              Made with love
              <span className="w-1 h-1 rounded-full bg-[#D6CCBF] opacity-60 mx-1" />
              No account needed
              <span className="w-1 h-1 rounded-full bg-[#D6CCBF] opacity-60 mx-1" />
              <Shield className="w-3.5 h-3.5 text-[#A6B39D]" />
              Zero data stored
            </p>
          </div>

          {/* Right: Hero imagery — visible on all screens */}
          <div className="animate-reveal-up delay-150">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div
                className="rounded-xl overflow-hidden shadow-xl border border-[#ECE3DA]"
                style={{ boxShadow: "0 16px 48px rgba(46,42,39,0.08)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero_main.png"
                  alt="Friends celebrating a birthday with warm golden-hour lighting"
                  className="w-full aspect-4/5 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 -rotate-2 border border-[#ECE3DA] shadow-sm">
                  <span className="font-cursive text-sm text-[#C97B84]">
                    for you, always
                  </span>
                </div>
              </div>

              <div
                className="absolute -bottom-8 -left-4 sm:-left-8 bg-white p-3 pb-10 rounded-sm shadow-lg border border-[#ECE3DA] w-32 sm:w-40 -rotate-3 hover:rotate-0 transition-transform duration-300"
                style={{ boxShadow: "0 8px 24px rgba(46,42,39,0.06)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&auto=format&fit=crop&q=80"
                  alt="Birthday celebration"
                  className="w-full aspect-square object-cover rounded-sm"
                />
                <p className="font-cursive text-xs text-[#6F655E] text-center mt-2 absolute bottom-2.5 left-0 right-0">
                  &ldquo;Best day ever.&rdquo;
                </p>
              </div>

              <div
                className="absolute -top-6 -right-4 sm:-right-6 bg-white p-3 pb-10 rounded-sm shadow-lg border border-[#ECE3DA] w-28 sm:w-36 rotate-2 hover:rotate-0 transition-transform duration-300"
                style={{ boxShadow: "0 8px 24px rgba(46,42,39,0.06)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&auto=format&fit=crop&q=80"
                  alt="Friends together"
                  className="w-full aspect-square object-cover rounded-sm"
                />
                <p className="font-cursive text-xs text-[#6F655E] text-center mt-2 absolute bottom-2.5 left-0 right-0">
                  &ldquo;You &amp; me, always.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 w-full bg-[#F9F5F0] py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-20 max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[#D8B88A]/60" />
              <Heart className="w-3.5 h-3.5 text-[#C97B84] fill-current" />
              <span className="h-px w-10 bg-[#D8B88A]/60" />
            </div>
            <h2
              className="font-serif text-[2.5rem] sm:text-[3rem] text-[#2E2A27] leading-[1.1] text-balance"
              style={{ fontWeight: 400 }}
            >
              Three little steps, made with a lot of{" "}
              <span className="italic font-cursive text-[#C97B84]">love.</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-16">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                className={`flex-1 flex flex-col ${idx === 1 ? "md:pt-8" : ""}`}
              >
                <div
                  className={`flex items-center gap-4 mb-6 ${idx === 1 ? "md:flex-row-reverse md:justify-end" : ""}`}
                >
                  <span
                    className="font-serif text-[3rem] sm:text-[4rem] leading-none text-[#C97B84]/20"
                    style={{ fontWeight: 300 }}
                  >
                    {step.num}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-full bg-white border border-[#ECE3DA] flex items-center justify-center text-[#C97B84] ${idx === 1 ? "md:ml-0" : ""}`}
                    style={{ boxShadow: "0 2px 8px rgba(46,42,39,0.04)" }}
                  >
                    {step.icon}
                  </div>
                </div>
                <h3
                  className="font-serif text-[1.5rem] sm:text-[1.75rem] text-[#2E2A27] mb-3"
                  style={{ fontWeight: 500 }}
                >
                  {step.title}
                </h3>
                <p className="text-[0.9375rem] text-[#6F655E] leading-[1.75] max-w-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A moment of feeling ── */}
      <section className="relative z-10 w-full py-28 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8 text-[#C97B84]">
            <span className="h-px w-14 bg-[#ECE3DA]" />
            <Heart className="w-4 h-4 fill-current" />
            <span className="h-px w-14 bg-[#ECE3DA]" />
          </div>
          <p
            className="font-serif italic text-[2rem] sm:text-[2.75rem] text-[#2E2A27] leading-tight text-balance"
            style={{ fontWeight: 400 }}
          >
            &ldquo;The best gifts aren&rsquo;t things. They&rsquo;re the proof
            that someone really knows you.&rdquo;
          </p>
          <p className="font-cursive text-xl text-[#C97B84] mt-7">
            &mdash; made with all my love
          </p>
        </div>
      </section>

      {/* ── What's Inside ── */}
      <section
        id="features"
        className="relative z-10 max-w-5xl mx-auto w-full px-6 py-28 scroll-mt-8"
      >
        <div className="mb-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#D8B88A]/60" />
            <Heart className="w-3.5 h-3.5 text-[#C97B84] fill-current" />
            <span className="h-px w-10 bg-[#D8B88A]/60" />
          </div>
          <h2
            className="font-serif text-[2.5rem] sm:text-[3rem] text-[#2E2A27] leading-[1.1] text-balance"
            style={{ fontWeight: 400 }}
          >
            Everything a heart could{" "}
            <span className="italic font-cursive text-[#C97B84]">
              hope for.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              className={`relative rounded-xl p-7 border transition-all duration-300 hover:-translate-y-1 ${
                idx % 3 === 1
                  ? "bg-[#F9F5F0] border-[#ECE3DA]"
                  : "bg-white border-[#ECE3DA]"
              }`}
              style={{
                boxShadow:
                  idx === 4
                    ? "0 2px 16px rgba(216,184,138,0.1)"
                    : "0 2px 12px rgba(46,42,39,0.04)",
              }}
            >
              <div
                className="absolute top-4 right-4 text-[#C97B84]/10"
                aria-hidden
              >
                <Heart className="w-5 h-5 fill-current" />
              </div>

              {idx === 0 && (
                <div className="w-10 h-10 rounded-xl bg-[#C97B84]/10 flex items-center justify-center mb-5">
                  <Gift className="w-5 h-5 text-[#C97B84]" />
                </div>
              )}
              {idx === 1 && (
                <div className="w-10 h-10 rounded-xl bg-[#D8B88A]/15 flex items-center justify-center mb-5">
                  <Sparkles className="w-5 h-5 text-[#D8B88A]" />
                </div>
              )}
              {idx === 2 && (
                <div className="w-10 h-10 rounded-xl bg-[#C97B84] flex items-center justify-center mb-5">
                  <Cake className="w-5 h-5 text-white" />
                </div>
              )}
              {idx === 3 && (
                <div className="w-10 h-10 rounded-xl bg-[#C97B84]/10 flex items-center justify-center mb-5">
                  <Camera className="w-5 h-5 text-[#C97B84]" />
                </div>
              )}
              {idx === 4 && (
                <div className="w-10 h-10 rounded-xl bg-[#D8B88A] flex items-center justify-center mb-5">
                  <Music className="w-5 h-5 text-white" />
                </div>
              )}
              {idx === 5 && (
                <div className="w-10 h-10 rounded-xl bg-[#C97B84]/10 flex items-center justify-center mb-5">
                  <Heart className="w-5 h-5 text-[#C97B84]" />
                </div>
              )}
              <h4
                className="font-serif text-[1.25rem] text-[#2E2A27] mb-1.5"
                style={{ fontWeight: 500 }}
              >
                {feature.title}
              </h4>
              <p className="font-cursive text-[0.9375rem] text-[#C97B84] mb-3">
                {feature.tagline}
              </p>
              <p className="text-[0.875rem] text-[#6F655E] leading-[1.7]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Emotional CTA ── */}
      <section className="relative z-10 w-full bg-[#F9F5F0] border-t border-[#ECE3DA] py-24 sm:py-32 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center flex flex-col items-center">
          <div
            className="w-14 h-14 rounded-2xl bg-white border border-[#ECE3DA] flex items-center justify-center mb-8"
            style={{ boxShadow: "0 2px 8px rgba(46,42,39,0.04)" }}
          >
            <Heart className="w-6 h-6 text-[#C97B84] fill-current" />
          </div>
          <h2
            className="font-serif text-[2.25rem] sm:text-[2.75rem] text-[#2E2A27] mb-5 leading-[1.1] text-balance"
            style={{ fontWeight: 400 }}
          >
            Give them a birthday they&rsquo;ll{" "}
            <span className="italic font-cursive text-[#C97B84]">
              never forget.
            </span>
          </h2>
          <p className="text-[#6F655E] text-[1.0625rem] mb-10 max-w-md leading-[1.7]">
            It takes just a few minutes to create. They&rsquo;ll keep the memory
            forever.
          </p>
          <Link href="/create">
            <button className="btn-gold px-10 py-4 text-[1rem]">
              Begin Creating <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="font-cursive text-base text-[#B5616B] mt-7">
            from my heart to yours
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.8125rem] text-[#B5ADA5]">
        <span className="flex items-center gap-1.5">
          <span
            className="font-serif text-[#6F655E]"
            style={{ fontWeight: 500 }}
          >
            WishMaker
          </span>{" "}
          &copy; {new Date().getFullYear()}
        </span>
        <div className="flex items-center gap-5">
          <Link
            href="/create"
            className="hover:text-[#C97B84] transition-colors"
          >
            Create a Surprise
          </Link>
          <span className="text-[#ECE3DA]">·</span>
          <span>Zero Data Stored</span>
        </div>
      </footer>
    </div>
  );
}
