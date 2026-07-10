import InfoListPage from "@/components/shared/InfoListPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Key Agenda | Pusat Informasi Manara",
};

export default function AgendaPage() {
  return (
    <InfoListPage config={{
      type: "AGENDA",
      title: "Key Agenda",
      subtitle: "Agenda & Highlights",
      desc: "Jadwal kegiatan strategis, forum, seminar, dan momen penting dalam perjalanan Manara.",
      color: "#8A8F5E",
      grad: "linear-gradient(145deg,#141408,#4A4E28)",
      // Cast to any to allow extra property not declared in Config type
      detailBase: "/pusat-informasi/agenda",
      emptyMessage: "Agenda akan ditampilkan di sini.",
    } as any} />
  );
}