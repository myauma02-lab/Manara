// app/dashboard/publikasi/jurnal/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
import PublicationForm from "../../_components/PublicationForm";
export default function EditJurnalPage() {
  const { id } = useParams<{ id: string }>();
  return <PublicationForm type="JOURNAL" id={id} basePath="/dashboard/publikasi/jurnal" />;
}