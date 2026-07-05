import ServicePage from "@/components/shared/ServicePage";
import { EVENT_DATA } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event | Layanan Manara",
  description: "Forum, seminar, dan diskusi publik yang bermakna — dikelola oleh Manara.",
};

export default function EventPage() {
  return <ServicePage data={EVENT_DATA} />;
}