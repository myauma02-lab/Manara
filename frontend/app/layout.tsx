import type { Metadata, Viewport } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import AIChatFloat from "@/components/shared/AIChatFloat";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";

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
    default: "ManaraInstitute",
    template: "%s | ManaraInstitute",
  },
  
  description:
    "Manara adalah kolektif intelektual dan media kreatif berbasis Jawa Timur. Publikasi, riset, layanan hukum, dan gagasan yang tidak mengorbankan kedalaman.",

  keywords: [
    "Manara",
    "kolektif intelektual",
    "media kreatif",
    "riset kebijakan",
    "legal opinion",
    "Surabaya",
    "Jawa Timur",
    "publikasi ilmiah",
    "think tank Indonesia",
  ],

  authors: [{ name: "Manara", url: "https://manarainstitute.id" }],
  creator: "Manara",
  publisher: "Manara",
  
    // Open Graph default
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://manarainstitute.id",
    siteName: "Manara",
    title: "Manara — Kolektif Intelektual & Media Kreatif",
    description:
      "Ruang intelektual dan media kreatif berbasis Jawa Timur. Shaping ideas for the public sphere.",
    images: [
      {
        url: "/og-default.png", // buat file ini (1200x630px)
        width: 1200,
        height: 630,
        alt: "Manara — Kolektif Intelektual",
      },
    ],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical
  alternates: {
    canonical: "https://manarainstitute.id",
  },

  icons: {
    icon: [
      { url: "public/favicon.png" },
      { url: "public/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "public/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "public/favicon/apple-icon.png", sizes: "180x180" }],
  },
  
  // Manifest
  manifest: "/manifest.json",

  verification: {
    google: "GOOGLE_VERIFICATION_CODE", // ganti ini
  },
};



export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body>
        <HeroBackground
          settingKey={HERO_BG_KEYS.homepage}
          fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
          gradientDirection="to-right"
          gradientColor="#0F2830"
          gradientOpacity={0.92}
          style={{ minHeight: "100svh", paddingTop: "140px", paddingBottom: "80px" }}
        >
          {children}
        </HeroBackground>
        <AIChatFloat />
        <WhatsAppFloat />
      </body>
    </html>
  );
}


