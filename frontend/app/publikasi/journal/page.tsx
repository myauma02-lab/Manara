import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { serverSettingsApi } from "@/lib/server-api";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manara Journal · Dalam Persiapan", description: "Manara Journal sedang disiapkan.", alternates: { canonical: "https://www.manarainstitute.id/publikasi/journal" } };

export default async function JournalPage() {
  const settings = await serverSettingsApi.get() || {};
  return <main><Navbar /><section style={{ minHeight: "75vh", padding: "clamp(110px,12vw,180px) clamp(20px,5vw,48px) 100px", maxWidth: 1100, margin: "auto", color: "#173642" }}>
    <Link href="/publikasi" style={{ color: "#266c87" }}>← Publikasi</Link>
    <p style={{ marginTop: 56, color: "#266c87", letterSpacing: ".15em", textTransform: "uppercase" }}>Manara Journal</p>
    <h1 style={{ fontFamily: "var(--font-display),Georgia,serif", fontSize: "clamp(40px,6vw,72px)", margin: "12px 0" }}>{settings.journal_title || "Manara Journal"}</h1>
    <p style={{ maxWidth: 680, fontSize: "clamp(18px,2vw,24px)", lineHeight: 1.6 }}>{settings.journal_description || "Kami menyiapkan kebijakan editorial dan proses reviu sebelum membuka Manara Journal."}</p>
    <p style={{ display: "inline-block", marginTop: 25, padding: "8px 14px", color: "#266c87", border: "1px solid #9ab9c7" }}>{settings.journal_status || "Dalam Persiapan"}</p>
    {settings.journal_visual && <img src={settings.journal_visual} alt="" style={{ display: "block", marginTop: 28, maxWidth: 360, maxHeight: 420, objectFit: "contain" }} />}
  </section><Footer /></main>;
}
