import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Wish from "@/models/Wish";
import type { WishData } from "@/lib/types";
import { toViewableWish } from "@/lib/wishAccess";
import WishClient from "./WishClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ k?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let name = "Someone Special";
  let sender = "A Loved One";
  let theme = "romance";

  try {
    await connectToDatabase();
    const wish = await Wish.findById(id).lean();
    if (wish) {
      if (typeof wish.name === "string" && wish.name.trim()) {
        name = wish.name.trim();
      }
      if (typeof wish.sender === "string" && wish.sender.trim()) {
        sender = wish.sender.trim();
      }
      if (typeof wish.theme === "string" && wish.theme.trim()) {
        theme = wish.theme.trim();
      }
    }
  } catch (err) {
    console.warn("[OG Metadata] Error fetching wish for metadata:", err);
  }

  const ogUrl = new URL("/api/og", siteUrl);
  ogUrl.searchParams.set("n", name);
  ogUrl.searchParams.set("s", sender);
  ogUrl.searchParams.set("t", theme);

  const title = `Happy Birthday, ${name}! 🎂 — WishMaker`;
  const description = `A personal birthday keepsake crafted with love by ${sender}. Open to experience your candlelit surprise.`;

  return {
    title,
    description,
    openGraph: {
      title: `Happy Birthday, ${name}! ✨`,
      description,
      siteName: "WishMaker",
      type: "website",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: `Birthday surprise for ${name} from ${sender}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Happy Birthday, ${name}! ✨`,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function WishPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  // The sender's private key rides along on preview links so their own visit
  // is never counted as an open.
  const { k } = await searchParams;

  let initialWish: WishData | null = null;
  try {
    await connectToDatabase();
    const wish = await Wish.findById(id).lean();
    if (wish) {
      initialWish = toViewableWish(wish as unknown as Record<string, unknown>);
    }
  } catch (err) {
    console.warn("[WishPage] Server fetch error:", err);
  }

  return <WishClient id={id} initialWish={initialWish} previewKey={k} />;
}
