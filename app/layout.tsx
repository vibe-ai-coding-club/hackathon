import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./_components/navigation";
import { FooterSection } from "./sections/footer-section";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "딸깍톤 2026 — AI 해커톤",
    template: "%s | 딸깍톤 2026",
  },
  description:
    "GPT x Claude x Gemini — 딸깍톤(ttalkkakthon) 2026. 바이브 코딩으로 혁신적인 프로젝트를 만들어보세요.",
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
  openGraph: {
    title: "딸깍톤 2026 — AI 해커톤",
    description:
      "GPT x Claude x Gemini — 딸깍톤(ttalkkakthon) 2026. 바이브 코딩으로 혁신적인 프로젝트를 만들어보세요.",
    type: "website",
    siteName: "딸깍톤 2026",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistMono.variable} font-sans antialiased`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <FooterSection />
      </body>
    </html>
  );
}
