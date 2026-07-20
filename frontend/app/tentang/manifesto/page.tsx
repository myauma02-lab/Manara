import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ManifestoClient from "./ManifestoClient";

export const metadata: Metadata = buildMetadata({
  title: "Manifesto Manara",
  description: "Tujuh prinsip yang menuntun kerja Manara sebagai kolektif intelektual yang percaya pada kekuatan gagasan untuk mengubah ruang publik.",
  path: "/tentang/manifesto",
  keywords: ["manifesto", "nilai manara", "prinsip intelektual"],
});

export default function ManifestoPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Beranda", url: "https://manara.my.id" },
        { name: "Tentang Kami", url: "https://manara.my.id/tentang/manara" },
        { name: "Manifesto", url: "https://manara.my.id/tentang/manifesto" },
      ])} />
      <main>
        <Navbar />
        <ManifestoClient />
        <Footer />
      </main>
    </>
  );
}