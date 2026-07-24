// app/dashboard/publikasi/paper/new/page.tsx
"use client";
import PublicationForm from "../../_components/PublicationForm";
export default function NewPaperPage() {
  return <PublicationForm type="PAPER" basePath="/dashboard/publikasi/paper" />;
}