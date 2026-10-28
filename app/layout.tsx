import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MerKora GDJ — Vos besoins, des solutions concrètes",
  description:
    "Décrivez votre besoin, structurez votre projet et explorez les prochaines étapes avec MerKora GDJ.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}