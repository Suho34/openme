import type { Metadata, Viewport } from "next";
import {
  Inter,
  Geist_Mono,
  Pacifico,
  Cormorant_Garamond,
  Alex_Brush,
  Caveat,
  Homemade_Apple,
} from "next/font/google";
import { Toaster } from "react-hot-toast";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const homemadeApple = Homemade_Apple({
  variable: "--font-homemade",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#8B2635",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "WishMaker — Unforgettable Birthday Experiences",
  description:
    "Create immersive, heartfelt birthday surprises that feel like opening a beautifully wrapped gift. No account needed.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WishMaker",
  },
  icons: {
    icon: [
      { url: "/wm-logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/wm-logo.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "WishMaker — Unforgettable Birthday Experiences",
    description:
      "Create heartfelt birthday surprises that feel like opening a gift.",
    siteName: "WishMaker",
    type: "website",
    images: [
      {
        url: "/api/og?n=Someone+Special&s=A+Loved+One&t=romance",
        width: 1200,
        height: 630,
        alt: "WishMaker — Candlelight & Keepsakes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WishMaker — Unforgettable Birthday Experiences",
    description:
      "Create heartfelt birthday surprises that feel like opening a gift.",
    images: ["/api/og?n=Someone+Special&s=A+Loved+One&t=romance"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${pacifico.variable} ${cormorant.variable} ${alexBrush.variable} ${caveat.variable} ${homemadeApple.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ServiceWorkerRegister />
        {children}
        <Toaster
          position="bottom-right"
          gutter={10}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FFFFFF",
              color: "#2E2A27",
              border: "1px solid #ECE3DA",
              borderRadius: "1rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              boxShadow:
                "0 4px 24px rgba(46,42,39,0.06), 0 1px 3px rgba(46,42,39,0.04)",
              padding: "0.75rem 1rem",
              maxWidth: "340px",
            },
            success: {
              iconTheme: { primary: "#557C4E", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#C46D5E", secondary: "#ffffff" },
            },
          }}
        />
      </body>
    </html>
  );
}
