// app/dashboard/publikasi/paper/page.tsx
"use client";
import PublicationList from "../_components/PublicationList";
export default function PaperPage() {
  return <PublicationList type="PAPER" title="Manara Paper" accent="#3F6F6A" basePath="/dashboard/publikasi/paper" publicPathPrefix="/publikasi/paper" />;
}