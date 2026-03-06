import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 여행 일정 플래너",
  description: "AI 기반 여행 일정 생성 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
