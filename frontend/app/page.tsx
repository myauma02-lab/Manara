import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import VisionSection from "@/components/sections/VisionSection";
import ValuesSection from "@/components/sections/ValuesSection";
import FoundersSection from "@/components/sections/FoundersSection";
import MediaSection from "@/components/sections/MediaSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ResearchSection from "@/components/sections/ResearchSection";
import UpcomingSection from "@/components/sections/UpcomingSection";
import ManifestoSection from "@/components/sections/ManifestoSection";
import ContactSection from "@/components/sections/ContactSection";
import NewsletterPopup from "@/components/shared/NewsletterPopup";
import BackToTop from "@/components/shared/BackToTop";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <VisionSection />
      <ValuesSection />
      <FoundersSection />
      <MediaSection />
      <ProjectsSection />
      <ResearchSection />
      <UpcomingSection />
      <ManifestoSection />
      <ContactSection />
      <Footer />
      <NewsletterPopup />
      <BackToTop />
    </main>
  );
}