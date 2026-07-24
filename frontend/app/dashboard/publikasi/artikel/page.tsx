// app/dashboard/publikasi/artikel/page.tsx
"use client";
import PublicationList from "../_components/PublicationList";
export default function ArtikelPage() {
  return <PublicationList type="ARTICLE" title="Artikel" accent="#266c87" basePath="/dashboard/publikasi/artikel" publicPathPrefix="/publikasi/artikel" />;
}