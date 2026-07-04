import PlaceholderPage from "@/components/shared/PlaceholderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training | Layanan Manara",
};

export default function TrainingPage() {
  return (
    <PlaceholderPage
      title="Training"
      subtitle="Layanan · Manara"
      description="Program pelatihan riset, penulisan akademik, dan analisis kebijakan untuk individu dan organisasi yang ingin bergerak berbasis data."
      parentHref="/layanan"
      parentLabel="← Layanan"
      icon="△"
    />
  );
}