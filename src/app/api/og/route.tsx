import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name   = searchParams.get("n")  ?? "Someone Special";
  const sender = searchParams.get("s")  ?? "A Loved One";
  const theme  = searchParams.get("t")  ?? "starry";

  // Theme → gradient colours
  const THEME_COLORS: Record<string, { bg1: string; bg2: string; accent: string; star: string }> = {
    starry:  { bg1: "#0A0F2E", bg2: "#0E1A5C", accent: "#60A5FA", star: "#F59E0B" },
    neon:    { bg1: "#0D0020", bg2: "#160040", accent: "#A78BFA", star: "#22D3EE" },
    romance: { bg1: "#1A0010", bg2: "#3D0020", accent: "#FB7185", star: "#FBBF24" },
    pastel:  { bg1: "#E0E7FF", bg2: "#F0FDF4", accent: "#818CF8", star: "#F472B6" },
    retro:   { bg1: "#1C1008", bg2: "#2E1C0A", accent: "#F59E0B", star: "#FDE68A" },
  };
  const c = THEME_COLORS[theme] ?? THEME_COLORS.starry;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${c.bg1} 0%, ${c.bg2} 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow orb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${c.accent}44 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />

        {/* Stars scattered */}
        {["10%,15%", "85%,20%", "15%,80%", "90%,75%", "50%,10%"].map((pos, i) => {
          const [left, top] = pos.split(",");
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left,
                top,
                fontSize: [18, 14, 22, 16, 20][i],
                opacity: 0.7,
              }}
            >
              ✦
            </div>
          );
        })}

        {/* Pill badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 999,
            background: `${c.accent}22`,
            border: `1px solid ${c.accent}55`,
            color: c.accent,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          ✦  Birthday Surprise  ✦
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Happy Birthday,{" "}
          <span style={{ color: c.star }}>{name}</span>
          <span style={{ color: c.star }}>!</span>
        </div>

        {/* Sub */}
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
          }}
        >
          A special surprise from {sender}
        </div>

        {/* Bottom brand */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(255,255,255,0.3)",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          🎁  WishMaker
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
