"use client";

import React from "react";
import { Calendar, Circle } from "lucide-react";

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events?: TimelineEvent[];
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  { date: "Oct 2021", title: "The Day We Met", description: "A simple introduction that quickly turned into hours of talking about everything and nothing." },
  { date: "May 2022", title: "First Adventure", description: "Our first road trip away from the city, singing along to custom playlists under clear skies." },
  { date: "Dec 2023", title: "New Year's Resolution", description: "Counted down the seconds together, promising that the next orbit would be filled with even more growth." },
];

export default function Timeline({ events = DEFAULT_EVENTS }: TimelineProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto py-5 select-none">
      
      {/* Central Line Track */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent -translate-x-1/2" />

      {/* Events List */}
      <div className="space-y-8">
        {events.map((event, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between w-full ${
                isLeft ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* Spacer for alignment on desktop */}
              <div className="hidden sm:block w-[45%]" />

              {/* Dot indicator */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full glass border border-blue-500/40 flex items-center justify-center bg-[#08090E]">
                  <Circle className="w-2 h-2 text-blue-400 fill-current animate-pulse" />
                </div>
              </div>

              {/* Card content */}
              <div
                className={`ml-10 sm:ml-0 w-[85%] sm:w-[45%] glass rounded-xl p-5 border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1] transition-all duration-200`}
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
              >
                {/* Date header */}
                <div className="flex items-center gap-1.5 text-blue-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">{event.date}</span>
                </div>
                
                {/* Title & description */}
                <h4 className="text-xs font-bold text-slate-100 mb-1.5 leading-snug">{event.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{event.description}</p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
