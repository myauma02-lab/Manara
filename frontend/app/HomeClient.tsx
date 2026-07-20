"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedArticlesSection from "@/components/sections/FeaturedArticlesSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import FoundersSection from "@/components/sections/FoundersSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ContactSection from "@/components/sections/ContactSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";



export default function HomeClient() {
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