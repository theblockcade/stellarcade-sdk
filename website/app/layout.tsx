import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

/**
 * globals.css has always declared "Plus Jakarta Sans" (body) and
 * "Space Mono" (code), but nothing ever loaded them — no next/font, no
 * <link>, no @import — so every visitor fell back to a system sans and,
 * worse, generic monospace (Courier New on Windows) for code blocks.
 * Loaded here via next/font so they're self-hosted at build time with no
 * runtime request to fonts.googleapis.com.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const title = "stellarcade-sdk — provably-fair arcade gaming on Stellar";
const description =
  "TypeScript client SDK for TheBlockCade: games, prize pools, quests and tournaments on Stellar/Soroban, with client-side fairness verification you never have to trust us for.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, siteName: "stellarcade-sdk", type: "website" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
