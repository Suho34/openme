"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight, Gift, Heart, Shield, ChevronRight,
  Camera, Sparkles, Music
} from "lucide-react";

/* ── Editorial "How It Works" steps ── */
const STEPS = [
  {
    num: "01",
    title: "Choose your moments",
    description: "Select from photographs, letters, timeline milestones, interactive games, and custom doodle sketches. Each piece becomes a page in your digital scrapbook.",
    icon: <Camera className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "Arrange your story",
    description: "Write a heartfelt letter (or let AI draft one for you), pick a visual theme, set a delivery date, and add personal photographs with handwritten captions.",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "Share one magical link",
    description: "Everything is packed into a single URL. Send it via WhatsApp, text, or email. When they open it, they experience an immersive birthday surprise.",
    icon: <Gift className="w-5 h-5" />,
  },
];

/* ── Feature highlights ── */
const FEATURES = [
  {
    title: "Wax Seal Envelope",
    description: "The recipient receives a textured paper envelope sealed with a crimson wax stamp. One tap cracks the seal to reveal your letter.",
  },
  {
    title: "Heartfelt AI Letter",
    description: "Write your own words or let Gemini compose three unique drafts tuned to your relationship — from playful to deeply formal.",
  },
  {
    title: "3D Candle Blowing",
    description: "A custom 3D cake renders in their browser. They blow into their microphone to extinguish the candles one by one.",
  },
  {
    title: "Memory Lane Gallery",
    description: "Your shared photographs appear as tilted Polaroids with handwritten captions, just like flipping through a physical scrapbook.",
  },
  {
    title: "Birthday Melody",
    description: "A unique Happy Birthday jingle synthesizes live in their browser, with instrument timbres matched to the visual theme.",
  },
  {
    title: "Keepsake Doodles",
    description: "Watch a hand-sketched heart, blooming rose, or cozy coffee cup trace itself on screen to reveal your birthday message.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#FFF8F2]">

      {/* ── Navbar ── */}
      <header className="relative z-20 max-w-5xl mx-auto w-full px-6 py-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#C97B84]"
            style={{ boxShadow: "0 2px 8px rgba(201,123,132,0.15)" }}>
            <Gift className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-xl tracking-tight text-[#2E2A27]" style={{ fontWeight: 500 }}>
            WishMaker<span className="text-[#C97B84]">.</span>
          </span>
        </div>

        <Link href="/create">
          <button className="btn-primary px-5 py-2.5 text-sm">
            Create a surprise <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-16 sm:pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Editorial copy */}
          <div className="flex flex-col items-start max-w-lg">
            <div className="animate-reveal-scale mb-8">
              <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold text-[#C97B84] uppercase tracking-[0.15em]">
                <Heart className="w-3 h-3 fill-current" />
                Made with love · No account needed
              </span>
            </div>

            <h1 className="animate-reveal-up delay-75 font-serif text-[3.25rem] sm:text-[4rem] leading-[1.05] text-[#2E2A27] mb-8" style={{ fontWeight: 400 }}>
              Every birthday deserves more than a message.
            </h1>

            <p className="animate-reveal-up delay-150 text-[1.0625rem] text-[#6F655E] leading-[1.75] max-w-[38rem] mb-10">
              Create unforgettable birthday experiences that feel like opening a beautifully wrapped gift. Pack a handwritten letter, interactive cake, photo memories, and a personal melody into a single link.
            </p>

            <div className="animate-reveal-up delay-225 flex flex-col sm:flex-row items-start gap-4">
              <Link href="/create">
                <button className="btn-primary px-7 py-3.5 text-[0.9375rem]">
                  Create Your Surprise <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/wish?d=eyJuIjoiQWxleGEiLCJhIjoyNSwicyI6Ikphc29uIiwibSI6IllvdSBicmluZyBzbyBtdWNoIGxpZ2h0IGFuZCBqb3kgaW50byBteSBsaWZlLiBFdmVyeSBzaW5nbGUgbW9tZW50IHNoYXJlZCB3aXRoIHlvdSBpcyBhIG1lbW9yeSBJIHRyZWFzdXJlLiBIYXBweSBCaXJ0aGRheSEiLCJ0Ijoicm9tYW5jZSIsImRlbW8iOnRydWV9">
                <button className="btn-ghost px-6 py-3 text-[0.9375rem]">
                  See a Demo
                </button>
              </Link>
            </div>

            <p className="animate-reveal-up delay-300 flex items-center gap-2 mt-8 text-[0.6875rem] text-[#B5ADA5] font-medium tracking-wide">
              <Shield className="w-3.5 h-3.5 text-[#A6B39D]" />
              Private · Client-side encryption · Zero data stored
            </p>
          </div>

          {/* Right: Golden-hour hero photograph */}
          <div className="animate-reveal-up delay-150 hidden lg:block">
            <div className="relative">
              {/* Main photo — warm golden-hour */}
              <div className="rounded-[1.75rem] overflow-hidden shadow-xl border border-[#ECE3DA]" style={{ boxShadow: "0 16px 48px rgba(46,42,39,0.08)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero_main.png"
                  alt="Friends celebrating a birthday with warm golden-hour lighting"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>

              {/* Floating Polaroid #1 — offset bottom-left */}
              <div className="absolute -bottom-8 -left-8 bg-white p-3 pb-10 rounded-sm shadow-lg border border-[#ECE3DA] w-40 -rotate-3"
                style={{ boxShadow: "0 8px 24px rgba(46,42,39,0.06)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&auto=format&fit=crop&q=80"
                  alt="Birthday celebration"
                  className="w-full aspect-square object-cover rounded-sm"
                />
                <p className="font-cursive text-xs text-[#6F655E] text-center mt-2 absolute bottom-2.5 left-0 right-0">&ldquo;Best day ever.&rdquo;</p>
              </div>

              {/* Floating Polaroid #2 — offset top-right */}
              <div className="absolute -top-6 -right-6 bg-white p-3 pb-10 rounded-sm shadow-lg border border-[#ECE3DA] w-36 rotate-2"
                style={{ boxShadow: "0 8px 24px rgba(46,42,39,0.06)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&auto=format&fit=crop&q=80"
                  alt="Friends together"
                  className="w-full aspect-square object-cover rounded-sm"
                />
                <p className="font-cursive text-xs text-[#6F655E] text-center mt-2 absolute bottom-2.5 left-0 right-0">&ldquo;Our first trip.&rdquo;</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 w-full bg-[#F9F5F0] py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-20">
            <span className="text-[0.6875rem] font-semibold text-[#C97B84] uppercase tracking-[0.15em] block mb-3">How it works</span>
            <h2 className="font-serif text-[2.5rem] sm:text-[3rem] text-[#2E2A27] leading-[1.1]" style={{ fontWeight: 400 }}>
              Three simple steps<br />to something unforgettable.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-serif text-[2rem] text-[#ECE3DA]" style={{ fontWeight: 300 }}>{step.num}</span>
                  <div className="w-10 h-10 rounded-full bg-white border border-[#ECE3DA] flex items-center justify-center text-[#C97B84]"
                    style={{ boxShadow: "0 2px 8px rgba(46,42,39,0.04)" }}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-serif text-[1.5rem] text-[#2E2A27] mb-3" style={{ fontWeight: 500 }}>{step.title}</h3>
                <p className="text-[0.9375rem] text-[#6F655E] leading-[1.75] max-w-[32rem]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Inside ── */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-6 py-28">
        <div className="mb-20">
          <span className="text-[0.6875rem] font-semibold text-[#C97B84] uppercase tracking-[0.15em] block mb-3">What&apos;s inside</span>
          <h2 className="font-serif text-[2.5rem] sm:text-[3rem] text-[#2E2A27] leading-[1.1] max-w-lg" style={{ fontWeight: 400 }}>
            Every detail crafted to feel personal.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              className="bg-white rounded-[1.375rem] p-7 border border-[#ECE3DA] transition-all duration-300 hover:-translate-y-1"
              style={{
                boxShadow: "0 2px 16px rgba(46,42,39,0.04)",
                rotate: idx % 3 === 1 ? "0deg" : idx % 2 === 0 ? "-0.5deg" : "0.5deg",
              }}
            >
              <div className="w-9 h-9 rounded-full bg-[#F9F5F0] border border-[#ECE3DA] flex items-center justify-center mb-5 text-[#C97B84]">
                {idx === 0 && <Gift className="w-4 h-4" />}
                {idx === 1 && <Sparkles className="w-4 h-4" />}
                {idx === 2 && <span className="text-sm">🎂</span>}
                {idx === 3 && <Camera className="w-4 h-4" />}
                {idx === 4 && <Music className="w-4 h-4" />}
                {idx === 5 && <Heart className="w-4 h-4" />}
              </div>
              <h4 className="font-serif text-[1.25rem] text-[#2E2A27] mb-2.5" style={{ fontWeight: 500 }}>{feature.title}</h4>
              <p className="text-[0.875rem] text-[#6F655E] leading-[1.7]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Emotional CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-32">
        <div className="rounded-[1.75rem] p-12 sm:p-16 text-center flex flex-col items-center bg-[#F9F5F0] border border-[#ECE3DA]"
          style={{ boxShadow: "0 4px 24px rgba(46,42,39,0.04)" }}>
          <div className="w-12 h-12 rounded-full bg-white border border-[#ECE3DA] flex items-center justify-center mb-8"
            style={{ boxShadow: "0 2px 8px rgba(46,42,39,0.04)" }}>
            <Heart className="w-5 h-5 text-[#C97B84] fill-current" />
          </div>
          <h2 className="font-serif text-[2rem] sm:text-[2.5rem] text-[#2E2A27] mb-5 leading-[1.15]" style={{ fontWeight: 400 }}>
            Craft a digital keepsake<br />for someone special today.
          </h2>
          <p className="text-[#6F655E] text-[0.9375rem] mb-10 max-w-sm leading-[1.7]">
            It takes just a few minutes to create. But the memory lasts forever.
          </p>
          <Link href="/create">
            <button className="btn-primary px-8 py-4 text-[0.9375rem]">
              Begin Creating <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-10 border-t border-[#ECE3DA] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.8125rem] text-[#B5ADA5]">
        <span className="flex items-center gap-1.5">
          <span className="font-serif text-[#6F655E]" style={{ fontWeight: 500 }}>WishMaker</span> &copy; {new Date().getFullYear()}
        </span>
        <div className="flex gap-5">
          <Link href="/create" className="hover:text-[#C97B84] transition-colors">Create a Surprise</Link>
          <span className="text-[#ECE3DA]">·</span>
          <span>Zero Data Stored</span>
        </div>
      </footer>
    </div>
  );
}
