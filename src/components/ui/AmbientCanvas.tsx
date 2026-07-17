"use client";

import React, { useEffect, useRef } from "react";

export default function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    const handleResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    window.addEventListener("resize", handleResize);
    
    // Draw a soft organic rose petal shape on canvas
    const drawPetal = (x: number, y: number, r: number, angle: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.bezierCurveTo(-r * 1.2, -r * 0.5, -r * 0.8, r * 0.8, 0, r);
      ctx.bezierCurveTo(r * 0.8, r * 0.8, r * 1.2, -r * 0.5, 0, -r);
      ctx.fillStyle = `rgba(200, 106, 118, ${alpha})`; // Cozy dusty rose color
      ctx.fill();
      ctx.restore();
    };

    // Soft drifting rose petals
    const pts = Array.from({ length: 22 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 5 + 3.5, // size 3.5px to 8.5px
      vx: (Math.random() - 0.5) * 0.12,
      vy: -Math.random() * 0.28 - 0.08, // slow upward drift
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.008, // slow spin
      alpha: Math.random() * 0.18 + 0.06,
      phase: Math.random() * Math.PI * 2
    }));
    
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.phase += 0.003;
        p.angle += p.spinSpeed;
        const currentOpacity = p.alpha + Math.sin(p.phase) * 0.03;
        
        drawPetal(p.x, p.y, p.r, p.angle, Math.max(0.01, currentOpacity));
        
        p.x += p.vx + Math.sin(p.phase * 1.5) * 0.04; // swaying sway drift
        p.y += p.vy;
        
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-80" aria-hidden />;
}
