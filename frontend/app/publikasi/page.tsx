import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PublicationExplorer from "./PublicationExplorer";
import { adaptPublication, type PublicationCardData } from "@/lib/publication-explorer";
import { serverPublicationsApi } from "@/lib/server-api";
import type { Metadata } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.manarainstitute.id").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Publikasi",
  description: "Jelajahi artikel dan dokumen kebijakan Manara Institute.",
  alternates: { canonical: `${SITE_URL}/publikasi` },
};

async function getPublications(): Promise<PublicationCardData[]> {
  const types = ["ARTICLE", "PAPER", "JOURNAL"];
  const results = await Promise.all(types.map(type =>
    serverPublicationsApi.list({ type, limit: "50" }).catch(() => [])
  ));

  return results.flatMap(items => (items || [])
    .map(adaptPublication)
    .filter((item): item is PublicationCardData => item !== null));
}

export default async function PublikasiPage() {
  const publications = await getPublications();

  return (
    <main>
      <Navbar />
      <Suspense fallback={<div aria-busy="true" aria-label="Memuat publikasi" />}>
        <PublicationExplorer publications={publications} />
      </Suspense>
      <Footer />
    </main>
  );
}
