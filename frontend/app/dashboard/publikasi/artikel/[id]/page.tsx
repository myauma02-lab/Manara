// app/dashboard/publikasi/artikel/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
import PublicationForm from "../../_components/PublicationForm";
export default function EditArtikelPage() {
  const { id } = useParams<{ id: string }>();
  return <PublicationForm type="ARTICLE" id={id} basePath="/dashboard/publikasi/artikel" />;
}