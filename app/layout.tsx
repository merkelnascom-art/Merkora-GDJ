import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MerKora GDJ — Des idées aux solutions numériques",
  description:
    "Une idée, un problème ou une ambition ? MerKora GDJ t'accompagne pour concevoir et concrétiser la solution numérique qui te correspond.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
