// app/dashboard/publikasi/paper/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
import PublicationForm from "../../_components/PublicationForm";
export default function EditPaperPage() {
  const { id } = useParams<{ id: string }>();
  return <PublicationForm type="PAPER" id={id} basePath="/dashboard/publikasi/paper" />;
}