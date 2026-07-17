"use client";

import React, { useRef, useEffect, useState } from "react";
import { Image as ImageIcon, Heart } from "lucide-react";

interface DevelopingPolaroidProps {
  url: string;
  caption: string;
  tilt: number;
  onClick: () => void;
}

export default function DevelopingPolaroid({ url, caption, tilt, onClick }: DevelopingPolaroidProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill the canvas with dark polaroid chemical layer
    ctx.fillStyle = "#1e1d1c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let strokes = 0;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const checkReveal = () => {
      strokes++;
      if (strokes > 40 && !revealed) {
        setRevealed(true);
      }
    };

    const startDraw = (e: MouseEvent | TouchEvent) => {
      if (revealed) return;
      isDrawing = true;
      const { x, y } = getPos(e);
      lastX = x;
      lastY = y;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || revealed) return;
      e.preventDefault(); 
      const { x, y } = getPos(e);
      
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 60; // Thick brush for quick reveal
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      lastX = x;
      lastY = y;
      
      checkReveal();
    };

    const stopDraw = () => {
      isDrawing = false;
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw, { passive: false });
    window.addEventListener("mouseup", stopDraw);
    
    canvas.addEventListener("touchstart", startDraw, { passive: true });
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("touchend", stopDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      window.removeEventListener("touchend", stopDraw);
    };
  }, [revealed]);

  return (
    <div 
      className="bg-white p-4 pb-6 rounded-sm shadow-md border border-[#ECE3DA] w-64 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(46,42,39,0.05)] select-none"
      style={{ rotate: `${tilt}deg`, zIndex: revealed ? 10 : 1 }}
      onClick={() => {
        if (revealed) onClick();
      }}
    >
      <div className="w-full h-48 bg-[#F9F5F0] overflow-hidden relative border border-[#ECE3DA] rounded-sm">
        {/* Actual Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={url} 
          alt={caption} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-500 hover:scale-105"
          crossOrigin="anonymous"
        />
        
        {/* Scratch-off Canvas */}
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />
        
        {!revealed && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-white/60">
            <span className="text-[0.65rem] uppercase tracking-widest font-semibold mt-2">Rub to develop</span>
          </div>
        )}
        
        {/* Love tape on top of polaroid */}
        <div className="absolute -top-3 left-[35%] right-[35%] h-6 bg-[#C97B84]/20 backdrop-blur-[1px] border border-white/40 rotate-[2deg] shadow-sm flex items-center justify-center text-[10px] text-[#C97B84] font-bold">
          <Heart className="w-2.5 h-2.5 fill-current" />
        </div>
      </div>

      {/* Caption text */}
      <p className="text-center font-cursive text-lg text-[#2E2A27] leading-normal mt-4 line-clamp-2 px-1 transition-opacity duration-1000" style={{ opacity: revealed ? 1 : 0.2 }}>
        {caption}
      </p>
    </div>
  );
}
