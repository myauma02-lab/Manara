import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    default: "Manara — Shaping Ideas for the Public Sphere",
    template: "%s | Manara",
  },
  description: "Manara adalah kolektif intelektual dan inisiatif media kreatif yang mewujudkan ruang intelektual, kreatif, berpengetahuan guna menciptakan kebermanfaatan sosial.",
  keywords: ["manara", "intelektual", "media", "kebijakan publik", "youth discourse", "indonesia"],
  authors: [{ name: "Manara Collective" }],
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Manara",
    title: "Manara — Shaping Ideas for the Public Sphere",
    description: "Ruang intelektual, kreatif, dan berpengetahuan untuk generasi yang berpikir mendalam.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}