import InfoListPage from "@/components/shared/InfoListPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Awards | Pusat Informasi Manara",
};

export default function AwardsPage() {
  return (
    <InfoListPage
      config={{
        type: "AWARD",
        title: "Awards",
        subtitle: "Penghargaan & Pencapaian",
        desc: "Rekam jejak pengakuan yang diterima Manara atas kontribusi intelektual dan sosialnya.",
        color: "#C6AD8A",
        grad: "linear-gradient(145deg,#1a1208,#8A6E3E)",
        detailBase: "/pusat-informasi/awards",
        emptyMessage: "Penghargaan akan ditampilkan di sini.",
      }}
    />
  );
}