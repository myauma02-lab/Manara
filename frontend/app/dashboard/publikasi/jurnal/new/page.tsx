// app/dashboard/publikasi/jurnal/new/page.tsx
"use client";
import PublicationForm from "../../_components/PublicationForm";
export default function NewJurnalPage() {
  return <PublicationForm type="JOURNAL" basePath="/dashboard/publikasi/jurnal" />;
}