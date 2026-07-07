import ServicePageWrapper from "@/components/shared/ServicePageWrapper";
import { EVENT_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event | Layanan Manara",
  description: "Forum, seminar, dan diskusi publik yang bermakna - dikelola oleh Manara.",
};

export default function EventPage() {
  return <ServicePageWrapper defaultData={EVENT_DATA} />;
}