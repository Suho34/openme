import type { Metadata } from "next";
import WishDirectClient from "./WishDirectClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sParams = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let name = (sParams?.n as string) || "Someone Special";
  let sender = (sParams?.s as string) || "A Loved One";
  let theme = (sParams?.t as string) || "romance";

  if (sParams?.demo === "true") {
    name = "Elena";
    sender = "Julian";
    theme = "romance";
  } else if (typeof sParams?.d === "string") {
    try {
      const decoded = decodeURIComponent(
        atob(sParams.d)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const parsed = JSON.parse(decoded);
      if (parsed.n) name = parsed.n;
      if (parsed.s) sender = parsed.s;
      if (parsed.t) theme = parsed.t;
    } catch {}
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

export default function WishPage() {
  return <WishDirectClient />;
}
