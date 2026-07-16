import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedArticlesSection from "@/components/sections/FeaturedArticlesSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import FoundersSection from "@/components/sections/FoundersSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ContactSection from "@/components/sections/ContactSection";
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