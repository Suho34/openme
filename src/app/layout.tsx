import type { Metadata } from "next";
import { Inter, Geist_Mono, Pacifico, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
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

export const metadata: Metadata = {
  title: "WishMaker — Unforgettable Birthday Experiences",
  description:
    "Create immersive, heartfelt birthday surprises that feel like opening a beautifully wrapped gift. No account needed.",
  openGraph: {
    title: "WishMaker — Unforgettable Birthday Experiences",
    description: "Create heartfelt birthday surprises that feel like opening a gift.",
    siteName: "WishMaker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WishMaker — Unforgettable Birthday Experiences",
    description: "Create heartfelt birthday surprises that feel like opening a gift.",
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
      className={`${inter.variable} ${geistMono.variable} ${pacifico.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
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
              iconTheme: { primary: "#8FA27A", secondary: "#ffffff" },
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
