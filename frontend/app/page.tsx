import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedArticlesSection from "@/components/sections/FeaturedArticlesSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import FoundersSection from "@/components/sections/FoundersSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manara — Kolektif Intelektual & Media Kreatif",
  description: "Manara adalah ruang intelektual dan media kreatif berbasis Jawa Timur. Publikasi, riset, dan gagasan yang tidak mengorbankan kedalaman.",
  openGraph: {
    title: "Manara",
    description: "Shaping Ideas for the Public Sphere",
    url: "https://manarainstitute.id",
    siteName: "Manara",
    type: "website",
  },
};

function PageHeroBackground() {
  return (
    <HeroBackground
      settingKey={HERO_BG_KEYS.homepage}
      fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
      gradientDirection="to-right"
      gradientColor="#0F2830"
      gradientOpacity={0.92}
      style={{ minHeight: "100svh", paddingTop: "140px", paddingBottom: "80px" }}
    >
      {/* Semua konten hero yang sudah ada sebelumnya */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px,5vw,48px)" }}>
        {/* ... isi hero section ... */}
      </div>
    </HeroBackground>
  );
}

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedArticlesSection />
      <ResearchSection />
      <ProjectsSection />
      <FoundersSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </main>
  );
}