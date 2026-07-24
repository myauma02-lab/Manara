// app/dashboard/publikasi/artikel/new/page.tsx
"use client";
import PublicationForm from "../../_components/PublicationForm";
export default function NewArtikelPage() {
  return <PublicationForm type="ARTICLE" basePath="/dashboard/publikasi/artikel" />;
}