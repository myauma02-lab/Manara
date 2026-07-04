import PlaceholderPage from "@/components/shared/PlaceholderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event | Layanan Manara",
};

export default function EventPage() {
  return (
    <PlaceholderPage
      title="Event"
      subtitle="Layanan · Manara"
      description="Forum diskusi publik, seminar, dan program kolaborasi komunitas yang membawa gagasan Manara ke ruang nyata."
      parentHref="/layanan"
      parentLabel="← Layanan"
      icon="□"
    />
  );
}