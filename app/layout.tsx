import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MerKora GDJ V2 — Parlons de votre idée",
  description:
    "Rencontrez MerKora, exprimez votre idée librement et choisissez de discuter par la voix ou par écrit.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}