import ServicePage from "@/components/shared/ServicePage";
import { RESEARCH_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research | Layanan Manara",
  description: "Layanan riset kebijakan berbasis bukti dari Manara.",
};

export default function ResearchServicePage() {
  return <ServicePage data={RESEARCH_DATA} />;
}