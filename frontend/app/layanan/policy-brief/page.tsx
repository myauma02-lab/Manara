import ServicePageWrapper from "@/components/shared/ServicePageWrapper";
import { POLICY_BRIEF_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy Brief | Layanan Manara",
  description: "Policy brief Manara — singkat, tajam, dan dapat ditindaklanjuti oleh pengambil keputusan.",
};

export default function PolicyBriefPage() {
  return <ServicePageWrapper defaultData={POLICY_BRIEF_DATA} />;
}