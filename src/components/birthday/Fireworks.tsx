"use client";

import React, { useRef, useEffect } from "react";

// Premium fireworks palette: gold, silver, electric blue, platinum white — no toy primaries
const PALETTES = [
  ["#F59E0B", "#FBBF24", "#FDE68A"],   // gold
  ["#60A5FA", "#93C5FD", "#BFDBFE"],   // electric blue
  ["#E2E8F0", "#F1F5F9", "#FFFFFF"],   // platinum white
  ["#818CF8", "#A5B4FC", "#C7D2FE"],   // indigo
  ["#F59E0B", "#60A5FA", "#FFFFFF"],   // gold + blue mix
];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; decay: number;
  gravity: number; friction: number;
  color: string;
  length: number; // trail segment length
}

function createParticle(x: number, y: number, color: string): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 5.5 + 1.5;
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    alpha: 1,
    decay: Math.random() * 0.018 + 0.008,
    gravity: 0.055,
    friction: 0.955,
    color,
    length: Math.random() * 6 + 2,
  };
}

interface Rocket {
  x: number; y: number; vy: number;
  palette: string[];
  exploded: boolean;
  targetY: number;
  trail: { x: number; y: number; alpha: number }[];
}

function createRocket(w: number, h: number): Rocket {
  return {
    x: Math.random() * (w * 0.7) + w * 0.15,
    y: h,
    vy: -(Math.random() * 4 + 7),
    palette: PALETTES[Math.floor(Math.random() * PALETTES.length)],
    exploded: false,
    targetY: Math.random() * (h * 0.45) + h * 0.05,
    trail: [],
  };
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let rockets: Rocket[]    = [];
    let particles: Particle[] = [];
    let frame = 0;
    let raf: number;

    const explode = (x: number, y: number, palette: string[]) => {
      const count = Math.floor(Math.random() * 50) + 80;
      for (let i = 0; i < count; i++) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        particles.push(createParticle(x, y, color));
      }
    };

    const draw = () => {
      // Dark trail — mix-blend-mode screen handles the glow on the CSS side
      ctx.fillStyle = "rgba(8,9,14,0.22)";
      ctx.fillRect(0, 0, w, h);

      frame++;

      // Launch a new rocket every ~55 frames
      if (frame % 55 === 0) {
        rockets.push(createRocket(w, h));
      }

      // Update rockets
      rockets = rockets.filter(r => {
        // Trail
        r.trail.push({ x: r.x, y: r.y, alpha: 0.9 });
        if (r.trail.length > 12) r.trail.shift();

        // Draw trail as thin glowing line segments
        for (let i = 1; i < r.trail.length; i++) {
          const a = r.trail[i - 1];
          const b = r.trail[i];
          ctx.save();
          ctx.globalAlpha = b.alpha * (i / r.trail.length) * 0.7;
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#F59E0B";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
          r.trail[i].alpha *= 0.87;
        }

        r.y  += r.vy;
        r.vy += 0.06; // gravity slows ascent

        if (r.y <= r.targetY || r.vy >= -0.4) {
          explode(r.x, r.y, r.palette);
          return false; // remove rocket
        }
        return true;
      });

      // Update particles — drawn as glowing line segments in travel direction
      particles = particles.filter(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.lineCap = "round";

        // Line segment from current to previous position based on velocity
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * p.length, p.y - p.vy * p.length);
        ctx.stroke();
        ctx.restore();

        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x  += p.vx;
        p.y  += p.vy;
        p.alpha -= p.decay;

        return p.alpha > 0;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    />
  );
}
