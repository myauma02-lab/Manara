import ServicePage from "@/components/shared/ServicePage";
import { CONSULTING_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulting | Layanan Manara",
  description: "Konsultasi kebijakan dan strategi berbasis bukti dari Manara.",
};

export default function ConsultingPage() {
  return <ServicePage data={CONSULTING_DATA} />;
}