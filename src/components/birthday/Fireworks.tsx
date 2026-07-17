"use client";

import React, { useRef, useEffect } from "react";

// Warm editorial fireworks palette: champagne gold, dusty rose, sage, ivory — no blue/neon
const PALETTES = [
  ["#D8B88A", "#E5CDA5", "#EDD9B8"],   // champagne gold
  ["#C97B84", "#D89BA3", "#E8BCC2"],   // dusty rose
  ["#F5EDE3", "#FFF8F2", "#FFFFFF"],   // warm ivory
  ["#A6B39D", "#BCC9B5", "#D3DDCE"],   // muted sage
  ["#D8B88A", "#C97B84", "#FFFFFF"],   // gold + rose mix
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
  x: number; y: number; vx: number; vy: number;
  palette: string[];
  exploded: boolean;
  targetY: number;
  trail: { x: number; y: number; alpha: number }[];
  isText: boolean;
  textIndex?: number;
}

function createRocket(w: number, h: number): Rocket {
  return {
    x: Math.random() * (w * 0.7) + w * 0.15,
    y: h,
    vx: 0,
    vy: -(Math.random() * 4 + 7),
    palette: PALETTES[Math.floor(Math.random() * PALETTES.length)],
    exploded: false,
    targetY: Math.random() * (h * 0.45) + h * 0.05,
    trail: [],
    isText: false,
  };
}

function createTextRocket(w: number, h: number, index: number): Rocket {
  const spread = (index - 2) * (w * 0.08); // Spread out 5 rockets
  return {
    x: w / 2 + spread,
    y: h,
    vx: -spread * 0.015, // curve inwards toward center slightly
    vy: -(Math.random() * 1.5 + 7.5), // fly up slower
    palette: ["#D8B88A", "#E5CDA5", "#EDD9B8"], // warm champagne gold text
    exploded: false,
    targetY: h * 0.35, // top center
    trail: [],
    isText: true,
    textIndex: index,
  };
}


interface FireworksProps {
  name?: string;
}

export default function Fireworks({ name = "Friend" }: FireworksProps) {
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

    let rockets: Rocket[] = [];
    let particles: Particle[] = [];
    let frame = 0;
    let raf: number;
    let textFade = 0;

    const explode = (rocket: Rocket) => {
      const { x, y, palette, isText, textIndex } = rocket;
      if (isText) {
        // Only trigger giant text for the center rocket to prevent overlap
        if (textIndex === 2) {
          textFade = 3.0; // Stay solid for ~4 seconds before fading
        }
        
        // Everyone gets a small normal explosion too
        const count = 40;
        for (let i = 0; i < count; i++) {
          particles.push(createParticle(x, y, palette[Math.floor(Math.random() * palette.length)]));
        }
      } else {
        const count = Math.floor(Math.random() * 50) + 80;
        for (let i = 0; i < count; i++) {
          const color = palette[Math.floor(Math.random() * palette.length)];
          particles.push(createParticle(x, y, color));
        }
      }
    };

    const draw = () => {
      // Dark screen overlay to create fading trails
      ctx.fillStyle = "rgba(8,9,14,0.22)";
      ctx.fillRect(0, 0, w, h);

      frame++;

      // Launch 5 text-rockets at frame 40, and then every 200 frames
      if (frame === 40 || (frame > 40 && (frame - 40) % 200 === 0)) {
        for (let i = 0; i < 5; i++) {
          rockets.push(createTextRocket(w, h, i));
        }
      }

      // Launch normal rocket every 45 frames for more continuous fireworks
      if (frame % 45 === 0) {
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
          ctx.strokeStyle = r.isText ? "#D8B88A" : "#E5CDA5";
          ctx.lineWidth = r.isText ? 2.5 : 1.5;
          ctx.shadowBlur = 6;
          ctx.shadowColor = r.isText ? "#D8B88A" : "#E5CDA5";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
          r.trail[i].alpha *= 0.87;
        }

        r.x  += r.vx;
        r.y  += r.vy;
        r.vy += r.isText ? 0.025 : 0.045; // gravity slows ascent

        if (r.y <= r.targetY || r.vy >= -0.4) {
          explode(r);
          return false; // remove rocket
        }
        return true;
      });

      // Update normal particles
      particles = particles.filter(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.lineCap = "round";

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

      // Render clean glowing text if triggered
      if (textFade > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, textFade);
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#D8B88A";
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (w < 600) {
          // Stack on mobile
          let fontSize = Math.min(w / 8, 60);
          ctx.font = `bold ${fontSize}px Georgia, serif`;
          
          // Ensure it doesn't overflow even on very small screens
          const nameText = `${name}!`;
          const nameWidth = ctx.measureText(nameText).width;
          if (nameWidth > w * 0.9) {
            fontSize = fontSize * (w * 0.9 / nameWidth);
            ctx.font = `bold ${fontSize}px Georgia, serif`;
          }
          
          ctx.fillText("Happy Birthday,", w / 2, h * 0.35 - fontSize * 0.6);
          ctx.fillText(nameText, w / 2, h * 0.35 + fontSize * 0.6);
        } else {
          // Single line on desktop
          let fontSize = Math.min(w / 12, 100);
          ctx.font = `bold ${fontSize}px Georgia, serif`;
          const text = `Happy Birthday, ${name}!`;
          let textWidth = ctx.measureText(text).width;
          
          if (textWidth > w * 0.9) {
            fontSize = fontSize * (w * 0.9 / textWidth);
            ctx.font = `bold ${fontSize}px Georgia, serif`;
          }
          ctx.fillText(text, w / 2, h * 0.35);
        }
        
        ctx.restore();
        textFade -= 0.003; // very slow fade out
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [name]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    />
  );
}
