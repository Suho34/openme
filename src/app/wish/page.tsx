"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WishViewer, { ErrorView, LoadingView } from "@/components/birthday/WishViewer";
import type { WishData } from "@/lib/types";

const DEMO_WISH_DATA: WishData = {
  name: "Elena",
  age: 24,
  sender: "Julian",
  message:
    "Every day with you feels like home, but today the universe pauses just to celebrate the day you arrived into it. May your year ahead be as luminous, warm, and gentle as candlelight.",
  theme: "romance",
  cakeStyle: "berry",
  memories: [
    {
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
      caption: "That quiet sunrise over the coast, where time stood still.",
    },
    {
      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
      caption: "Our favorite corner table, laughing until the café closed.",
    },
    {
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
      caption: "Hand in hand beneath the autumn leaves in Central Park.",
    },
  ],
  tuneUrl: "/tunes/acoustic.mp3",
  voiceNoteUrl: "/sub_clair-happy-birthday-579516.mp3",
  scrollJarTitle: "7 Reasons You Make Every Day Brighter",
  scrollNotes: [
    { id: "s-1", text: "The quiet way your hand always finds mine when we're walking together." },
    { id: "s-2", text: "How you always laugh hardest at your own stories before you finish telling them." },
    { id: "s-3", text: "That unforgettable rainy night where we lost track of time and talked until dawn." },
    { id: "s-4", text: "Your kindness to strangers, even when the world is heavy." },
    { id: "s-5", text: "How you always know when I've had a tough day before I say a single word." },
    { id: "s-6", text: "Every small triumph you achieved this year that made me burst with pride." },
    { id: "s-7", text: "Simply this: the universe gave me you, and that makes every day a gift." },
  ],
  timeCapsules: [
    {
      id: "tc-1",
      prompt: "Open when you miss me",
      message: "Close your eyes. Remember that distance is just geography — not a single mile can diminish how proud I am of you, or how fiercely you are loved.",
      voucher: "Valid for one late-night emergency call, no matter what time zone I'm in.",
    },
    {
      id: "tc-2",
      prompt: "Open when you've had a stressful day",
      message: "Take a deep breath and drop your shoulders. Whatever happened today does not define your worth or your future. You did your best, and that is more than enough.",
      voucher: "Valid for one full home-cooked dinner & dessert on me next time we're together.",
    },
    {
      id: "tc-3",
      prompt: "Open on a quiet Sunday morning",
      message: "Pour yourself a warm cup of coffee, sit by the window, and let the quiet sink in. I hope this week treats you with all the gentleness and joy you bring to others.",
    },
  ],
  demo: false,
};

function parseLegacyWishData(raw: Record<string, unknown>): WishData {
  return {
    name: (raw.n as string) || "",
    age: raw.a as number | undefined,
    sender: (raw.s as string) || "",
    message: (raw.m as string) || "",
    theme: (raw.t as string) || "romance",
    memories: raw.mm as WishData["memories"],
    deliveryLock: raw.dl as number | undefined,
    timeline: raw.tl as WishData["timeline"],
    doodleType: raw.dt as WishData["doodleType"],
    ambience: raw.am as WishData["ambience"],
    cakeStyle: raw.cs as WishData["cakeStyle"],
    voiceNoteUrl: raw.vn as string | undefined,
    tuneUrl: raw.tu as string | undefined,
    scrollNotes: raw.sn as WishData["scrollNotes"],
    scrollJarTitle: raw.sjt as string | undefined,
    timeCapsules: raw.tc as WishData["timeCapsules"],
    demo: Boolean(raw.demo),
  };
}

function WishContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams?.get("d");
  const isDemo = searchParams?.get("demo") === "true";

  const [wishData, setWishData] = useState<WishData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setWishData(DEMO_WISH_DATA);
      return;
    }

    if (!dataParam) {
      // Default to demo wish data if no params provided
      setWishData(DEMO_WISH_DATA);
      return;
    }

    try {
      const decoded = decodeURIComponent(
        atob(dataParam)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const parsed = JSON.parse(decoded);
      if (!parsed.n || !parsed.s || !parsed.m) {
        setError(true);
        return;
      }
      setWishData(parseLegacyWishData(parsed));
    } catch {
      setError(true);
    }
  }, [dataParam, isDemo]);

  if (error) return <ErrorView />;
  if (!wishData) return <LoadingView />;
  return <WishViewer wishData={wishData} />;
}

export default function WishPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <WishContent />
    </Suspense>
  );
}
