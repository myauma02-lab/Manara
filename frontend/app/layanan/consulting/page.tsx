import ServicePageWrapper from "@/components/shared/ServicePageWrapper";
import { CONSULTING_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulting | Layanan Manara",
  description: "Konsultasi kebijakan dan strategi berbasis bukti dari Manara.",
};

export default function ConsultingPage() {
  return <ServicePageWrapper defaultData={CONSULTING_DATA} />;
}