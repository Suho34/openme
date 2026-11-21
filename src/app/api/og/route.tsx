import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { WAX_SEAL_ICON_BASE64 } from "@/lib/ogIcon";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("n") ?? "Someone Special";
  const sender = searchParams.get("s") ?? "A Loved One";
  const theme = searchParams.get("t") ?? "romance";

  // Theme palettes matching Candlelight & Linen and style options
  const THEME_STYLES: Record<
    string,
    {
      bg: string;
      frameBorder: string;
      accent: string;
      accentBadge: string;
      nameColor: string;
      subColor: string;
      glow: string;
    }
  > = {
    romance: {
      bg: "linear-gradient(135deg, #2D0A12 0%, #150307 100%)",
      frameBorder: "rgba(197, 160, 89, 0.45)",
      accent: "#C5A059",
      accentBadge: "rgba(197, 160, 89, 0.15)",
      nameColor: "#FAF6F0",
      subColor: "#EADDC9",
      glow: "rgba(201, 123, 132, 0.28)",
    },
    starry: {
      bg: "linear-gradient(135deg, #0A0F2E 0%, #060919 100%)",
      frameBorder: "rgba(96, 165, 250, 0.45)",
      accent: "#F59E0B",
      accentBadge: "rgba(96, 165, 250, 0.15)",
      nameColor: "#FFFFFF",
      subColor: "#93C5FD",
      glow: "rgba(96, 165, 250, 0.28)",
    },
    neon: {
      bg: "linear-gradient(135deg, #18002E 0%, #0B0014 100%)",
      frameBorder: "rgba(167, 139, 250, 0.45)",
      accent: "#22D3EE",
      accentBadge: "rgba(167, 139, 250, 0.15)",
      nameColor: "#FFFFFF",
      subColor: "#F472B6",
      glow: "rgba(167, 139, 250, 0.32)",
    },
    pastel: {
      bg: "linear-gradient(135deg, #2E1F1A 0%, #1A110E 100%)",
      frameBorder: "rgba(201, 123, 132, 0.45)",
      accent: "#C5A059",
      accentBadge: "rgba(201, 123, 132, 0.15)",
      nameColor: "#FAF6F0",
      subColor: "#FDE2E4",
      glow: "rgba(201, 123, 132, 0.24)",
    },
    retro: {
      bg: "linear-gradient(135deg, #2A170C 0%, #130B05 100%)",
      frameBorder: "rgba(212, 175, 55, 0.45)",
      accent: "#D4AF37",
      accentBadge: "rgba(212, 175, 55, 0.15)",
      nameColor: "#FAF6F0",
      subColor: "#FDE68A",
      glow: "rgba(212, 175, 55, 0.28)",
    },
  };

  const style = THEME_STYLES[theme] ?? THEME_STYLES.romance;

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
          background: style.bg,
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
          padding: "48px 60px",
        }}
      >
        {/* Soft atmospheric candlelight glow in center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${style.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Vintage Inset Gold Border Frame */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: `1.5px solid ${style.frameBorder}`,
            borderRadius: 18,
            display: "flex",
          }}
        />

        {/* Inner thin decorative border */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: "1px dashed rgba(197, 160, 89, 0.2)",
            borderRadius: 12,
            display: "flex",
          }}
        />

        {/* Decorative Crimson Wax Seal Icon Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 104,
            height: 104,
            borderRadius: 52,
            border: `3px solid ${style.accent}`,
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6), 0 0 35px rgba(197, 160, 89, 0.35)",
            background: "linear-gradient(135deg, #8B2635 0%, #5A121E 100%)",
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WAX_SEAL_ICON_BASE64}
            width="96"
            height="96"
            alt="Wax Seal Emblem"
            style={{ borderRadius: 48 }}
          />
        </div>

        {/* Overline Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 24px",
            borderRadius: 999,
            background: style.accentBadge,
            border: `1px solid ${style.frameBorder}`,
            color: style.accent,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          ✦ Special Birthday Keepsake ✦
        </div>

        {/* Main Recipient Headline */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: style.nameColor,
            textAlign: "center",
            lineHeight: 1.12,
            letterSpacing: -1,
            maxWidth: 1020,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <span>Happy Birthday,</span>
          <span
            style={{
              color: style.accent,
              textDecoration: "underline",
              textDecorationColor: "rgba(197, 160, 89, 0.5)",
            }}
          >
            {name}
          </span>
          <span>✨</span>
        </div>

        {/* Sender Dedication Subtitle */}
        <div
          style={{
            marginTop: 20,
            fontSize: 27,
            color: style.subColor,
            opacity: 0.9,
            textAlign: "center",
            maxWidth: 900,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>A personal candlelit keepsake crafted with love by</span>
          <span style={{ fontWeight: 700, color: style.accent }}>{sender}</span>
        </div>

        {/* Footer Brand Mark */}
        <div
          style={{
            position: "absolute",
            bottom: 42,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: style.accent,
            opacity: 0.75,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>♥</span>
          <span>WishMaker • Sealed with Love</span>
          <span>♥</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
