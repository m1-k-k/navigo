import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "NaviGo — A smarter, safer way to get home",
  description:
    "Safety-first navigation for young people. Dual routing, SOS safe spaces, and live TfL data for London.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NaviGo",
  },
};

export const viewport: Viewport = {
  themeColor: "#8BA888",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
