import ServicePageWrapper from "@/components/shared/ServicePageWrapper";
import { TRAINING_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training | Layanan Manara",
  description: "Program pelatihan Manara untuk riset, penulisan, dan analisis kebijakan.",
};

export default function TrainingPage() {
  return <ServicePageWrapper defaultData={TRAINING_DATA} />;
}