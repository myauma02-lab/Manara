import ServicePageWrapper from "@/components/shared/ServicePageWrapper";
import { MEDIA_SERVICE_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media | Layanan Manara",
  description: "Ekosistem media Manara — jurnal, paper, newsletter, video, dan podcast.",
};

export default function MediaLayananPage() {
  return <ServicePageWrapper defaultData={MEDIA_SERVICE_DATA} />;
}