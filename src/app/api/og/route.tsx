import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("n") ?? searchParams.get("name") ?? "Someone Special";
  const sender = searchParams.get("s") ?? searchParams.get("sender") ?? "A Loved One";

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
          backgroundColor: "#FAF6F0",
          backgroundImage: "radial-gradient(ellipse at 50% 20%, rgba(197, 160, 89, 0.25) 0%, transparent 65%)",
          padding: "40px",
          fontFamily: "Georgia, serif",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Outer Deckle Frame */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "2px solid #E3D4B8",
            borderRadius: "16px",
            display: "flex",
            pointerEvents: "none",
          }}
        />

        {/* Inner Gold Inset Frame */}
        <div
          style={{
            position: "absolute",
            inset: "32px",
            border: "1px solid rgba(197, 160, 89, 0.6)",
            borderRadius: "12px",
            display: "flex",
            pointerEvents: "none",
          }}
        />

        {/* Decorative Brass Corners */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "28px",
            height: "28px",
            borderTop: "3px solid #C5A059",
            borderLeft: "3px solid #C5A059",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "28px",
            height: "28px",
            borderTop: "3px solid #C5A059",
            borderRight: "3px solid #C5A059",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            width: "28px",
            height: "28px",
            borderBottom: "3px solid #C5A059",
            borderLeft: "3px solid #C5A059",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "28px",
            height: "28px",
            borderBottom: "3px solid #C5A059",
            borderRight: "3px solid #C5A059",
          }}
        />

        {/* Top Postmark Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "6px 20px",
            borderRadius: "999px",
            border: "1px dashed rgba(139, 38, 53, 0.4)",
            backgroundColor: "rgba(244, 239, 230, 0.8)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#8B2635",
            }}
          />
          <span
            style={{
              color: "#8B2635",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Special Delivery • Sealed With Love
          </span>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#8B2635",
            }}
          />
        </div>

        {/* Center Card Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "960px",
            backgroundColor: "#F4EFE6",
            border: "1px solid #E3D4B8",
            borderRadius: "16px",
            padding: "36px 48px",
            boxShadow: "0 15px 35px rgba(59, 39, 30, 0.08)",
            position: "relative",
          }}
        >
          {/* Crimson Wax Seal Graphic */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#8B2635",
              backgroundImage: "radial-gradient(circle at 35% 35%, #A33B49 0%, #8B2635 60%, #5A121E 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(139, 38, 53, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.3)",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "32px", color: "#FAF6F0" }}>♥</span>
          </div>

          <span
            style={{
              fontSize: "13px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#C5A059",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            A Keepsake Sealed in Time
          </span>

          <h1
            style={{
              fontSize: "56px",
              fontWeight: 400,
              color: "#2A231F",
              margin: "0 0 12px 0",
              lineHeight: 1.15,
              fontStyle: "italic",
            }}
          >
            Happy Birthday, {name}! ✨
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#554A44",
              margin: "0 0 20px 0",
              fontStyle: "italic",
            }}
          >
            A personal candlelit surprise crafted with love by {sender}.
          </p>

          {/* Sensory Icons Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              padding: "8px 24px",
              borderRadius: "999px",
              backgroundColor: "#FAF6F0",
              border: "1px solid #E3D4B8",
              color: "#7A6F62",
              fontSize: "14px",
            }}
          >
            <span>📜 Handwritten Letter</span>
            <span>•</span>
            <span>🕯️ 3D Bakery Cake</span>
            <span>•</span>
            <span>📸 Photo Scrapbook</span>
          </div>
        </div>

        {/* Brand Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "44px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#7A6F62",
            fontSize: "14px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span>WishMaker</span>
          <span style={{ color: "#8B2635" }}>•</span>
          <span>Candlelight &amp; Linen Edition</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
