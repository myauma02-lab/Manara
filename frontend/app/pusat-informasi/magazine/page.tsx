import InfoListPage from "@/components/shared/InfoListPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazine | Pusat Informasi Manara",
};

export default function MagazinePage() {
  return (
    <InfoListPage config={{
      type: "MAGAZINE",
      title: "Magazine",
      subtitle: "Majalah & Edisi Digital",
      desc: "Publikasi berkala Manara dalam format majalah — kumpulan gagasan, wawancara, dan analisis mendalam.",
      color: "#5F8F8A",
      grad: "linear-gradient(145deg,#0A1F1E,#2A5E59)",
      detailHref: (slug) => `/pusat-informasi/magazine/${slug}`,
      emptyMessage: "Edisi majalah pertama segera hadir.",
    }} />
  );
}