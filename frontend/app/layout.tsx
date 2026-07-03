import type { Metadata, Viewport } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Manara — Shaping Ideas for the Public Sphere",
    template: "%s | Manara",
  },
  description:
    "Manara adalah kolektif intelektual dan inisiatif media kreatif yang mewujudkan ruang intelektual, kreatif, berpengetahuan guna menciptakan kebermanfaatan sosial.",
  keywords: [
    "manara",
    "intelektual",
    "media",
    "kebijakan publik",
    "youth discourse",
    "indonesia",
  ],
  authors: [{ name: "Manara Collective" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Manara",
    title: "Manara — Shaping Ideas for the Public Sphere",
    description:
      "Ruang intelektual, kreatif, dan berpengetahuan untuk generasi yang berpikir mendalam.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
  lang="id"
  className={`${dmSans.variable} ${cormorant.variable}`}
>
  <body>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </body>
</html>
  );
}
