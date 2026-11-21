import { Suspense } from "react";
import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Wish from "@/models/Wish";
import { LoadingView } from "@/components/birthday/WishViewer";
import WishClient from "./WishClient";
import type { WishData } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    await connectToDatabase();
    const wish = await Wish.findById(id).lean();
    if (wish) {
      const name = (wish as unknown as { name?: string }).name || "Someone Special";
      const sender = (wish as unknown as { sender?: string }).sender || "A Loved One";
      const ogUrl = `/api/og?n=${encodeURIComponent(name)}&s=${encodeURIComponent(sender)}`;
      return {
        title: `💌 Happy Birthday, ${name}! — A Keepsake from ${sender}`,
        description: `A candlelit birthday surprise sealed with wax for ${name}. Tap to open your letter, blow out candles, and explore heirloom memories.`,
        openGraph: {
          title: `💌 Happy Birthday, ${name}! ✨`,
          description: `A personal birthday keepsake crafted with love by ${sender}. Tap to break the wax seal.`,
          type: "website",
          images: [
            {
              url: ogUrl,
              width: 1200,
              height: 630,
              type: "image/png",
              alt: `Birthday Keepsake for ${name} from ${sender}`,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: `💌 Happy Birthday, ${name}! ✨`,
          description: `A personal birthday keepsake crafted with love by ${sender}. Tap to break the wax seal.`,
          images: [ogUrl],
        },
      };
    }
  } catch (err) {
    console.warn("[Metadata] Error generating dynamic metadata:", err);
  }

  return {
    title: "WishMaker — Birthday Surprise Keepsake",
    description: "An intimate, candlelit birthday keepsake experience sealed with wax.",
    openGraph: {
      title: "WishMaker — Birthday Surprise Keepsake",
      description: "An intimate, candlelit birthday keepsake experience sealed with wax.",
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "WishMaker — Birthday Surprise Keepsake",
      description: "An intimate, candlelit birthday keepsake experience sealed with wax.",
      images: ["/api/og"],
    },
  };
}

export default async function WishPage({ params }: PageProps) {
  const { id } = await params;
  let initialWish: WishData | null = null;

  try {
    await connectToDatabase();
    const wishDoc = await Wish.findById(id).lean();
    if (wishDoc) {
      initialWish = JSON.parse(JSON.stringify(wishDoc));
    }
  } catch {
    // Client fallback will fetch via API
  }

  return (
    <Suspense fallback={<LoadingView />}>
      <WishClient id={id} initialWish={initialWish} />
    </Suspense>
  );
}
