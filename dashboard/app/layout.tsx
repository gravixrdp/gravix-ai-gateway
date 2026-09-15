import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gravix AI Gateway — Unified API for Claude, GPT-4o, DeepSeek & Gemini",
  description:
    "One high-performance API key for Claude Code, Cursor, Cline, and AI Agents. Zero rate-limit bottlenecks, rolling 5-hour quota windows, and instant INR & Crypto checkout.",
  metadataBase: new URL("https://gravixhost.app"),
  alternates: {
    canonical: "https://gravixhost.app",
  },
  openGraph: {
    title: "Gravix AI Gateway — One API Key for Every Frontier Model",
    description:
      "Connect Claude 3.7, GPT-4o, DeepSeek R1, and Gemini 2.0 Flash with one unified API key.",
    url: "https://gravixhost.app",
    siteName: "Gravix AI Gateway",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravix AI Gateway — The Ultimate AI Agent API Gateway",
    description: "One API key for Claude Code, Cursor, and all LLMs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#090A0F] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
