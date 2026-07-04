import PlaceholderPage from "@/components/shared/PlaceholderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy Brief | Layanan Manara",
};

export default function PolicyBriefPage() {
  return (
    <PlaceholderPage
      title="Policy Brief"
      subtitle="Layanan · Manara"
      description="Dokumen kebijakan singkat, tajam, dan actionable — dirancang untuk pengambil keputusan yang butuh landasan intelektual yang kuat."
      parentHref="/layanan"
      parentLabel="← Layanan"
      icon="◇"
    />
  );
}