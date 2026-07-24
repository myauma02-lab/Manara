// app/dashboard/publikasi/jurnal/page.tsx
"use client";
import PublicationList from "../_components/PublicationList";
export default function JurnalPage() {
  return <PublicationList type="JOURNAL" title="Manara Journal" accent="#5F8F8A" basePath="/dashboard/publikasi/jurnal" publicPathPrefix="/publikasi/journal" />;
}