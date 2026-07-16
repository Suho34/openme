"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Gift, Wand2, Music, Clock,
  Sparkles, Shield, Zap, Star, ChevronRight,
  Heart, Calendar, Compass, MessageSquare
} from "lucide-react";

/* ── Cozy Ambient fireflies canvas ── */
function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    window.addEventListener("resize", () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; });
    
    // Slow drifting amber particles simulating candle ember or fireflies
    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.05, vy: (Math.random() - 0.5) * 0.05,
      a: Math.random() * 0.28 + 0.05,
      phase: Math.random() * Math.PI * 2
    }));
    
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        // Slow organic pulse
        p.phase += 0.006;
        const currentOpacity = p.a + Math.sin(p.phase) * 0.04;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Soft amber candle gold color
        ctx.fillStyle = `rgba(251,191,36,${Math.max(0.01, currentOpacity)})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-70" aria-hidden />;
}

/* ── Romantic Envelope/Cake Preview Widget ── */
function ProductPreview() {
  return (
    <div className="relative select-none">
      {/* Warm background glow */}
      <div className="absolute -inset-px rounded-3xl opacity-40"
        style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(244,63,94,0.15))", filter: "blur(2px)" }} />

      <div className="relative rounded-3xl p-6 overflow-hidden border border-white/[0.05]"
        style={{ background: "linear-gradient(160deg, #180C0A 0%, #0A0403 100%)" }}>

        {/* Envelope Mockup with Wax Seal */}
        <div className="w-full aspect-[1.5/1] rounded-2xl bg-zinc-950/90 border border-white/[0.04] relative overflow-hidden flex items-center justify-center shadow-2xl mb-5">
          {/* Fold diagonals */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-tr from-stone-950 to-zinc-900/60" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-tl from-stone-950 to-zinc-900/60" style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />
          <div className="absolute bottom-0 inset-x-0 h-[65%] bg-gradient-to-t from-stone-950 via-zinc-900/40 to-zinc-900/30" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
          <div className="absolute top-0 left-0 w-full h-[62%] bg-gradient-to-b from-stone-900/70 to-zinc-900/50 origin-top" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          
          {/* Crimson Wax Seal */}
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-red-800/10 cursor-pointer transition-transform hover:scale-105"
            style={{ background: "radial-gradient(circle, #991B1B 0%, #7F1D1D 100%)" }}>
            <span className="text-amber-400/90 text-xs font-serif italic">✦</span>
          </div>
        </div>

        {/* Card info */}
        <div className="text-center">
          <span className="font-serif italic text-amber-200/90 text-sm block">A digital keep-sake envelope</span>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">unseals with a warm melody</p>
        </div>
      </div>
    </div>
  );
}

/* ── Narrative Chapters list ── */
interface Chapter {
  num: string;
  title: string;
  serifQuote: string;
  description: string;
  colorClass: string;
  element: React.ReactNode;
}

const CHAPTERS: Chapter[] = [
  {
    num: "Chapter I",
    title: "The Wax Seal Envelope",
    serifQuote: "“To be unlocked only on the anniversary of your birth.”",
    description: "The recipient receives a premium dark linen envelope locked with a wax stamp. If scheduled, an active countdown keeps it sealed. Once tapped, the stamp cracks to reveal the contents.",
    colorClass: "text-red-400 border-red-500/15 bg-red-500/5",
    element: (
      <div className="flex gap-2">
        <span className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06] text-[9px] font-mono text-stone-500">Feature C: Countdown Lock</span>
        <span className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06] text-[9px] font-mono text-stone-500">Cracking wax seal</span>
      </div>
    )
  },
  {
    num: "Chapter II",
    title: "The Heartfelt Letterpress Card",
    serifQuote: "“Write it with depth, or let the AI search your shared history.”",
    description: "Your greeting card slides out in custom serif typography. Use the AI tone slider (from Playful to Formal) to generate 3 letter drafts tuned to your personal bond.",
    colorClass: "text-amber-400 border-amber-500/15 bg-amber-500/5",
    element: (
      <div className="mt-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex items-center justify-between text-[9px] mb-2 font-bold uppercase tracking-wider">
          <span className="text-stone-600">😄 Playful</span>
          <span className="text-amber-400/90">Heartfelt</span>
          <span className="text-stone-600">🎩 Formal</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.05] relative">
          <div className="absolute left-0 top-0 h-full w-[72%] rounded-full bg-gradient-to-r from-amber-500 to-rose-500" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-200" style={{ left: "72%" }} />
        </div>
      </div>
    )
  },
  {
    num: "Chapter III",
    title: "PROCEDURAL CATHEDRAL JINGLE",
    serifQuote: "“Procedural audio designed live, unique to their name.”",
    description: "The Happy Birthday song synthesizes automatically inside their browser. Procedural instrument timbres (from romantic sine waves to nostalgic triangles) are synthesized live to match the visual theme.",
    colorClass: "text-yellow-400 border-yellow-500/15 bg-yellow-500/5",
    element: (
      <div className="flex items-end gap-1 h-8 px-1">
        {[2,5,3,7,4,8,3,6,2,7,5,3,8,4,6].map((h, i) => (
          <div key={i} className="flex-1 rounded" style={{ height: `${h * 10}%`, background: "linear-gradient(to top, #BA7A42, #E6E2D8)" }} />
        ))}
      </div>
    )
  },
  {
    num: "Chapter IV",
    title: "THE 3D CAKE & MIC CANDLE BLOW",
    serifQuote: "“Blow out candles by breathing onto your screen.”",
    description: "Renders a customized chocolate-glazed cake on a gold pedestal. The recipient blows into their microphone to extinguish the candles, releasing birthday smoke particles.",
    colorClass: "text-rose-400 border-rose-500/15 bg-rose-500/5",
    element: (
      <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Microphone blowing active
      </div>
    )
  },
  {
    num: "Chapter V",
    title: "The Constellation Sky",
    serifQuote: "“Type a secret wish, and watch it morph into a star.”",
    description: "After the candles go out, typing a birthday wish morphs it into a glowing orb that rises into an interactive starry sky. Hovering over stars reveals micro-memories and key coordinates of your friendship.",
    colorClass: "text-blue-400 border-blue-500/15 bg-blue-500/5",
    element: (
      <div className="relative h-12 rounded-lg bg-zinc-950/60 border border-white/[0.04] overflow-hidden flex items-center justify-center">
        <div className="absolute top-2 left-6 w-1 h-1 rounded-full bg-white opacity-80" />
        <div className="absolute bottom-2 right-12 w-1.5 h-1.5 rounded-full bg-white opacity-40 animate-pulse" />
        <span className="text-[9px] font-serif italic text-stone-400">Memory constellations mapping</span>
      </div>
    )
  },
  {
    num: "Chapter VI",
    title: "The Timeline, Memories & Balloons",
    serifQuote: "“Walk down memory lane card-by-card.”",
    description: "The celebration finishes with a scrolling timeline detail of your relationship milestones, a mosaic gallery of shared photos, and helium-filled metallic balloons that pop to reveal positive wishes.",
    colorClass: "text-violet-400 border-violet-500/15 bg-violet-500/5",
    element: (
      <div className="flex gap-1.5 justify-center">
        {["Milestones", "Photos", "Balloon Game"].map(l => (
          <span key={l} className="px-2 py-0.5 rounded text-[8px] font-bold uppercase text-stone-500 border border-white/[0.04] bg-white/[0.01]">{l}</span>
        ))}
      </div>
    )
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#0C0605]" style={{ backgroundImage: "radial-gradient(circle at top, #1A0D0A 0%, #0A0403 100%)" }}>
      {mounted && <AmbientCanvas />}

      {/* ── Navbar ── */}
      <header className="relative z-20 max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #BA7A42, #9E6330)",
              boxShadow: "0 0 0 1px rgba(251,191,36,0.3), 0 2px 8px rgba(186,122,66,0.25)"
            }}>
            <Gift className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[0.9375rem] tracking-tight text-white font-serif italic">
            WishMaker<span className="text-amber-400">.</span>
          </span>
        </div>

        <Link href="/create">
          <button className="btn-gold px-5 py-2 text-xs font-semibold">
            Create page <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-12 pb-24 text-center sm:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-center">
          
          <div className="flex flex-col items-center sm:items-start">
            <div className="animate-reveal-scale mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold border uppercase tracking-widest"
                style={{ color: "#FBBF24", borderColor: "rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.06)" }}>
                <Sparkles className="w-3 h-3 text-amber-400" />
                Cozy · Intimate · No account needed
              </span>
            </div>

            <h1 className="animate-reveal-up delay-75 text-[2.75rem] sm:text-[3.5rem] font-serif font-normal leading-[1.08] text-stone-100 mb-6">
              Hand-crafted surprises<br />
              that feel like a{" "}
              <span className="relative inline-block italic text-amber-200">
                keepsake
                <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] opacity-40"
                  style={{ background: "linear-gradient(90deg, #FBBF24, transparent)" }} />
              </span>
            </h1>

            <p className="animate-reveal-up delay-150 text-[13px] text-stone-400 leading-[1.75] max-w-md mb-8 font-medium">
              Create an intimate, slow-paced birthday experience. Pack a wax-sealed envelope, procedural Happy Birthday jingle, candlelit cake, constellation stars, and shared timeline milestones into a single URL.
            </p>

            <div className="animate-reveal-up delay-225 flex flex-col sm:flex-row items-center gap-3">
              <Link href="/create">
                <button className="btn-gold px-6 py-3 text-sm">
                  Create a surprise <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/wish?d=eyJuIjoiQWxleGEiLCJhIjoyNSwicyI6Ikphc29uIiwibSI6IllvdSBicmluZyBzbyBtdWNoIGxpZ2h0IGFuZCBqb3kgaW50byBteSBsaWZlLiBFdmVyeSBzaW5nbGUgbW9tZW50IHNoYXJlZCB3aXRoIHlvdSBpcyBhIG1lbW9yeSBJIHRyZWFzdXJlLiBIYXBweSBCaXJ0aGRheSEiLCJ0Ijoic3RhcnJ5IiwibW0iOlt7InVybCI6Imh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTMwMTAzODYyNjc2LWRlOGM5ZGViYWQxZD93PTYwMCZhdXRvPWZvcm1hdCZmaXQ9Y3JvcCZxPTgwIiwiY2FwdGlvbiI6IkxhdWdodGVyIGFuZCBlbmRsZXNzIHRhbGtzLiJ9LHsidXJsIjoiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjQzNjY0MDA2MDAtNzE2OGI4YWY5YmMzP3c9NjAwJmF1dG89Zm9ybWF0JmZpdD1jcm9wJnE9ODAiLCJjYXB0aW9uIjoiVW5kZXIgdGhlIHF1aWV0IGNpdHkgc3RhcnMuIn1dLCJ0bCI6W3siZGF0ZSI6Ik9jdCAyMDIxIiwidGl0bGUiOiJPdXIgRmlyc3QgTWVldGluZyIsImRlc2NyaXB0aW9uIjoiV2Ugc2F0IGF0IHRoZSBjb2ZmZWUgc2hvcCB0YWxraW5nIGZvciBob3VycywgY29tcGxldGVseSBsb3NpbmcgdHJhY2sgb2YgdGltZS4ifSx7ImRhdGUiOiJKdW4gMjAyMiIsInRpdGxlIjoiRmlyc3QgUm9hZCBUcmlwIiwiZGVzY3JpcHRpb24iOiJXZSBkcm92ZSBkb3duIHRvIHRoZSBjb2FzdCwgcGxheWluZyBvdXIgZmF2b3JpdGUgYWxidW1zIG9uIHJlcGVhdCB1bmRlciBjbGVhciBza2llcy4ifSx7ImRhdGUiOiJEZWMgMjAyMyIsInRpdGxlIjoiQ291bnRsZXNzIE1pbGVzdG9uZXMiLCJkZXNjcmlwdGlvbiI6IkNlbGVicmF0aW5nIGdyb3d0aCwgc2hhcmVkIGdvYWxzLCBhbmQgc3VwcG9ydGluZyBlYWNoIG90aGVyIHRocm91Z2ggZXZlcnkgc3RlcC4ifV0sInN0IjpbeyJpZCI6MSwibGFiZWwiOiJUaGUgRmlyc3QgSGVsbG8iLCJkYXRlIjoiSmFuIDEyLCAyMDIxIiwiZGVzY3JpcHRpb24iOiJBIHNpbXBsZSBzbWlsZSB0aGF0IHN0YXJ0ZWQgZXZlcnl0aGluZyB3ZSBoYXZlIHRvZGF5LiIsIngiOjI1LCJ5IjozNX0seyJpZCI6MiwibGFiZWwiOiJDaXR5IExpZ2h0cyBXYWxrIiwiZGF0ZSI6Ikp1bCAxOCwgMjAyMiIsImRlc2NyaXB0aW9uIjoiTGF0ZS1uaWdodCBjb252ZXJzYXRpb25zIHdhdGNoaW5nIHRoZSBjaXR5IGdsb3cgYmVsb3cuIiwieCI6NjAsInkiOjIyfSx7ImlkIjozLCJsYWJlbCI6Ikhvcml6b24gR2F6aW5nIiwiZGF0ZSI6Ik5vdiAwNSwgMjAyMyIsImRlc2NyaXB0aW9uIjoiV2F0Y2hpbmcgdGhlIHN1biBmYWRlIGJlaGluZCBtb3VudGFpbnMgdG9nZXRoZXIuIiwieCI6NDUsInkiOjcwfV19">
                <button className="btn-ghost px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white">
                  Preview Demo
                </button>
              </Link>
            </div>

            <p className="animate-reveal-up delay-300 flex items-center gap-1.5 mt-6 text-[10px] text-stone-500 font-bold tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5 text-amber-500/80" /> Private · client-side encryption · zero backend
            </p>
          </div>

          <div className="animate-reveal-up delay-150 hidden lg:block">
            <ProductPreview />
          </div>

        </div>
      </section>

      {/* ── Story Showcase Chapters ── */}
      <section id="features" className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-24">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">The Walkthrough</span>
          <h2 className="text-3xl font-serif text-white mt-1.5">Chapters of the Surprise Story</h2>
          <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto">Explore how the recipient travels through the digital keepsake.</p>
        </div>

        <div className="relative border-l border-white/[0.05] ml-4 sm:ml-6 space-y-12 pl-6 sm:pl-10">
          {CHAPTERS.map((ch, idx) => (
            <div key={ch.num} className="relative animate-reveal-up">
              {/* Star Node on timeline */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#0C0605] border border-white/[0.08] flex items-center justify-center text-[8px] text-amber-400 shadow-md">
                ✦
              </div>

              {/* Chapter Card */}
              <div className="surface rounded-2xl p-6 space-y-4 border border-white/[0.04]" style={{ background: "rgba(255,255,255,0.01)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{ch.num}</span>
                    <h3 className="text-base font-serif text-stone-200 mt-0.5">{ch.title}</h3>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${ch.colorClass} w-fit`}>
                    Interactive
                  </div>
                </div>

                <p className="text-xs font-serif italic text-stone-400 leading-normal pl-3 border-l border-amber-500/30">
                  {ch.serifQuote}
                </p>

                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {ch.description}
                </p>

                {ch.element}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-24">
        <div className="divider mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "I. Create", label: "Configure Details", desc: "Select custom presets, draft a letterpress greeting, coordinates list, and delivery unlock schedules." },
            { step: "II. Seal", label: "Acquire Surprise URL", desc: "Our generator packages all coordinates and assets directly inside the URL hash. Copy and send." },
            { step: "III. Reveal", label: "Blow Out & Enjoy", desc: "The page stays locked until the hour. The recipient unseals the wax stamp, blows the candles, and stargazes." }
          ].map(({ step, label, desc }) => (
            <div key={step} className="space-y-2">
              <span className="text-[10px] font-bold text-stone-600 font-mono block">{step}</span>
              <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">{label}</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Intimate CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-28">
        <div className="rounded-3xl p-10 sm:p-14 text-center flex flex-col items-center border border-white/[0.04]"
          style={{ background: "radial-gradient(circle, rgba(186,122,66,0.06) 0%, rgba(12,6,5,0.98) 100%)" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6 bg-red-500/5 border border-red-500/15">
            <Heart className="w-4 h-4 text-red-400 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 mb-4 leading-snug">
            Craft a digital keepsake<br />for someone special today
          </h2>
          <p className="text-stone-500 text-xs mb-8 max-w-xs leading-relaxed">
            Takes minutes to outline. Renders a lasting, intimate memory.
          </p>
          <Link href="/create">
            <button className="btn-gold px-8 py-3.5 text-xs uppercase tracking-widest font-bold">
              Begin writing surprise
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-8 border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-600 font-medium">
        <span className="flex items-center gap-1">
          WishMaker Keepsakes &copy; {new Date().getFullYear()} · built with Next.js 16
        </span>
        <div className="flex gap-4">
          <Link href="/create" className="hover:text-stone-400 transition-colors">Start Builder</Link>
          <span>·</span>
          <span>Zero Server Logs</span>
        </div>
      </footer>
    </div>
  );
}
