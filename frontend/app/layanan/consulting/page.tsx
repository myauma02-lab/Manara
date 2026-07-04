import PlaceholderPage from "@/components/shared/PlaceholderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulting | Layanan Manara",
};

export default function ConsultingPage() {
  return (
    <PlaceholderPage
      title="Consulting"
      subtitle="Layanan · Manara"
      description="Konsultasi kebijakan, strategi komunikasi, dan pendampingan riset untuk lembaga, NGO, dan organisasi yang ingin bergerak lebih efektif."
      parentHref="/layanan"
      parentLabel="← Layanan"
      icon="✦"
    />
  );
}