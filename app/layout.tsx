import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "딸깍톤 2026 - 참가 신청",
  description:
    "GPT x Claude x Gemini — 딸깍톤(ttalkkakthon) 2026 참가 신청 페이지. 바이브 코딩으로 혁신적인 프로젝트를 만들어보세요.",
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
    title: "딸깍톤 2026 - 참가 신청",
    description:
      "GPT x Claude x Gemini — 딸깍톤(ttalkkakthon) 2026 참가 신청 페이지. 바이브 코딩으로 혁신적인 프로젝트를 만들어보세요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistMono.variable} font-sans antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
