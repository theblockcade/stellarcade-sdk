import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
