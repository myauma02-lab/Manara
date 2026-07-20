import type { Metadata } from "next";
import { buildMetadata, organizationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { serverSettingsApi } from "@/lib/server-api";
import JsonLd from "@/components/shared/JsonLd";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeClient from "./HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await serverSettingsApi.get();
  return buildMetadata({
    title: settings?.seo_title_homepage || "Manara — Kolektif Intelektual & Media Kreatif",
    description: settings?.seo_desc_homepage ||
      "Manara adalah ruang intelektual dan media kreatif berbasis Jawa Timur. Publikasi, riset kebijakan, dan gagasan yang tidak mengorbankan kedalaman.",
    path: "/",
    keywords: ["think tank", "riset kebijakan", "media kreatif", "Surabaya", "Jawa Timur"],
  });
}

export default async function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <main>
        <Navbar />
        <HomeClient />
        <Footer />
      </main>
    </>
  );
}