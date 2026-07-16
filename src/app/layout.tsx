import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Pacifico, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "WishMaker — Interactive Birthday Surprises",
  description:
    "Craft an immersive, personalized birthday page with an AI-composed jingle, Gemini-written letter, 3D WebGL cake, and scheduled surprise delivery — all in one shareable URL.",
  openGraph: {
    title: "WishMaker — Interactive Birthday Surprises",
    description: "Premium interactive birthday experiences. No account needed.",
    siteName: "WishMaker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WishMaker — Interactive Birthday Surprises",
    description: "Premium interactive birthday experiences.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${pacifico.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster
          position="bottom-right"
          gutter={10}
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(15,17,26,0.95)",
              color: "#F1F5F9",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "0.75rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              backdropFilter: "blur(16px)",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
              padding: "0.75rem 1rem",
              maxWidth: "340px",
            },
            success: {
              iconTheme: { primary: "#3B82F6", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#ffffff" },
            },
          }}
        />
      </body>
    </html>
  );
}
