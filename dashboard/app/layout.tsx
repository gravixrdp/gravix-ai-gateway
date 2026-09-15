import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gravix AI Gateway — Unified API for Claude, GPT-4o, DeepSeek & Gemini",
  description:
    "One high-performance API key for Claude Code, Cursor, Cline, and AI Agents. Zero rate-limit bottlenecks, rolling 5-hour quota windows, and instant INR & Crypto checkout.",
  keywords: [
    "AI API Gateway",
    "Claude Code CLI API Key",
    "Cursor API key",
    "DeepSeek R1 API",
    "OpenAI proxy",
    "Anthropic proxy",
    "Cheap Claude API",
    "Aerolink alternative",
    "FreeModel alternative",
  ],
  authors: [{ name: "Gravix AI" }],
  openGraph: {
    title: "Gravix AI Gateway — One API Key for Every Frontier Model",
    description:
      "Connect Claude 3.7, GPT-4o, DeepSeek R1, and Gemini 2.0 Flash with one unified API key. Built for developers and autonomous agents.",
    url: "https://gravixhost.app",
    siteName: "Gravix AI Gateway",
    images: [
      {
        url: "https://gravixhost.app/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Gravix AI Gateway",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravix AI Gateway — The Ultimate AI Agent API Gateway",
    description: "One API key for Claude Code, Cursor, and all LLMs.",
    creator: "@gravixai",
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
    <html lang="en" className="dark">
      <head>
        <link rel="canonical" href="https://gravixhost.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Gravix AI Gateway",
              operatingSystem: "All",
              applicationCategory: "DeveloperApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              description:
                "Unified High-Performance AI API Gateway for developers, autonomous agents, Claude Code CLI, and Cursor.",
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#090A0F] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
