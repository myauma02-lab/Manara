import ServicePage from "@/components/shared/ServicePage";
import { MEDIA_SERVICE_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media | Layanan Manara",
  description: "Ekosistem media Manara — jurnal, paper, newsletter, video, dan podcast.",
};

export default function MediaLayananPage() {
  return <ServicePage data={MEDIA_SERVICE_DATA} />;
}