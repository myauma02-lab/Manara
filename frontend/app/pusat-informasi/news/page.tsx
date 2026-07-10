import InfoListPage from "@/components/shared/InfoListPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News | Pusat Informasi Manara",
};

export default function NewsPage() {
  return (
    <InfoListPage config={{
      type: "NEWS",
      title: "News",
      subtitle: "Berita & Artikel Terbaru",
      desc: "Perkembangan terkini, liputan kegiatan, dan berita seputar Manara dan isu yang kami pedulikan.",
      color: "#266c87",
      grad: "linear-gradient(145deg,#0F2830,#266c87)",
      detailHref: (slug) => `/pusat-informasi/news/${slug}`,
      emptyMessage: "Belum ada berita yang dipublikasikan.",
    } as any} />
  );
}