import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import SiteWidgets from "@/components/shared/SiteWidgets";

const dmSans = localFont({
  src: "../assets/fonts/dm-sans-latin.woff2",
  variable: "--font-dm-sans",
  display: "swap",
  weight: "100 1000",
});

const newsreader = localFont({
  src: [
    { path: "../assets/fonts/newsreader-latin.woff2", weight: "200 800", style: "normal" },
    { path: "../assets/fonts/newsreader-italic-latin.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://manarainstitute.id"),
  title: {
    default: "Manara Institute",
    template: "%s | Manara Institute",
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
        alt: "Manara : Kolektif Intelektual",
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
    { url: "/favicon.png" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [
    { url: "/apple-icon.png", sizes: "180x180" }
  ],
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${dmSans.variable} ${newsreader.variable}`}>
      <body>
        {children}
        <SiteWidgets />
      </body>
    </html>
  );
}


