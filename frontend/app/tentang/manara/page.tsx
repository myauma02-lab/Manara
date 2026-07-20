import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { serverSettingsApi } from "@/lib/server-api";
import JsonLd from "@/components/shared/JsonLd";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TentangClient from "./TentangClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await serverSettingsApi.get();
  return buildMetadata({
    title: settings?.seo_title_tentang || "Tentang Manara",
    description: settings?.seo_desc_tentang ||
      "Manara adalah kolektif intelektual dan media kreatif yang percaya gagasan dapat mengubah ruang publik. Kenali siapa kami dan mengapa kami ada.",
    path: "/tentang/manara",
    keywords: ["tentang manara", "kolektif intelektual", "visi misi", "Surabaya"],
  });
}

export default async function TentangPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Beranda", url: "https://manara.my.id" },
        { name: "Tentang Manara", url: "https://manara.my.id/tentang/manara" },
      ])} />
      <main>
        <Navbar />
        <TentangClient />
        <Footer />
      </main>
    </>
  );
}