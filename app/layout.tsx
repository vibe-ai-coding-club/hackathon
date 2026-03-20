import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Navigation } from "./_components/navigation";
import "./globals.css";
import { FooterSection } from "./sections/footer-section";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: {
    default: "딸깍톤 2026 — AI 해커톤",
    template: "%s | 딸깍톤 2026",
  },
  description:
    "딸깍톤(ttalkkakthon) 2026. 바이브 코딩으로 혁신적인 프로젝트를 만들어보세요.",
  keywords: [
    "딸깍톤",
    "ttalkkakthon",
    "AI Hackathon",
    "AI 해커톤",
    "바이브 코딩 클럽",
    "vibe coding club",
    "바이브 코딩",
    "vibe coding",
  ],
  icons: {
    icon: [
      { url: "/favicon/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/favicon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "딸깍톤 2026 — AI 해커톤",
    description:
      "딸깍톤(ttalkkakthon) 2026. 바이브 코딩으로 혁신적인 프로젝트를 만들어보세요.",
    type: "website",
    siteName: "딸깍톤 2026",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "딸깍톤 2026 — AI 해커톤",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body className={`${geistMono.variable} font-sans antialiased`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <FooterSection />
      </body>
    </html>
  );
}
