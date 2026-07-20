"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { publicationsApi } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifesto | Tentang Manara",
  description: "Tujuh prinsip yang menuntun Manara. Tentang mengapa kami ada, apa yang kami percaya, dan bagaimana kami bekerja.",
};

const PRINCIPLES = [
  { num: "I", title: "Kami percaya bahwa kedalaman adalah bentuk keberanian.", body: "Dalam dunia yang menghargai kecepatan dan permukaan, memilih untuk berpikir dengan mendalam adalah tindakan perlawanan. Manara berdiri di atas pilihan itu." },
  { num: "II", title: "Kami percaya bahwa pemuda bukan sekadar masa depan.", body: "Kami adalah kekuatan analisis, kreativitas, dan ketidakpuasan yang berlangsung sekarang." },
  { num: "III", title: "Kami percaya bahwa gagasan membutuhkan ruang untuk bernapas.", body: "Argumen yang terburu-buru adalah argumen yang lemah. Kami membangun ruang di mana gagasan bisa diuji, dipertanyakan, dan diperkuat sebelum disuarakan." },
  { num: "IV", title: "Kami percaya bahwa intelektualitas tanpa empati adalah kesia-siaan.", body: "Riset yang tidak menyentuh realitas manusia bukanlah riset yang berguna. Kami menulis tentang manusia, untuk manusia, dengan tetap menjaga ketelitian metodologi." },
  { num: "V", title: "Kami percaya bahwa independensi adalah syarat kejujuran.", body: "Manara tidak berada di bawah kepentingan politik, korporasi, atau ideologi tunggal manapun. Kemerdekaan editorial adalah harga mati." },
  { num: "VI", title: "Kami percaya pada kekuatan kolektif tanpa kehilangan suara individual.", body: "Kami adalah kolektif, bukan paduan suara. Setiap suara yang ada di Manara membawa perspektif sendiri, dan ketegangan di antara perspektif itulah yang menghasilkan wawasan." },
  { num: "VII", title: "Kami percaya bahwa ruang publik yang sehat membutuhkan penjaga yang sadar.", body: "Kami tidak hadir untuk mengisi kebisingan. Kami hadir untuk mempertanyakan, memperlambat, dan menawarkan alternatif dari kesimpulan yang terburu-buru." },
];

const COMMITMENTS = [
  { title: "Terhadap Pembaca", body: "Kami tidak akan menulis sesuatu yang kami sendiri tidak yakini. Setiap klaim akan disertai argumen. Setiap opini akan dibedakan dengan jelas dari fakta." },
  { title: "Terhadap Subjek Liputan", body: "Kami akan adil, bukan sekadar berimbang. Keadilan berarti memberikan konteks yang cukup, bukan hanya dua sisi yang bisa saja tidak setara." },
  { title: "Terhadap Komunitas", body: "Manara bukan panggung monolog. Kami membangun dialog dan dialog membutuhkan kesediaan untuk dikoreksi, diperdebat, dan diubah." },
  { title: "Terhadap Diri Sendiri", body: "Kami akan terus mempertanyakan cara kerja kami sendiri. Sebuah institusi yang tidak bisa mengkritisi dirinya sendiri tidak layak mengkritisi orang lain." },
];

export default function ManifestoPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{ minHeight: "65vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "72px", paddingTop: "120px", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(38,108,135,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: "200px", width: "1px", height: "100%", background: "linear-gradient(to bottom, transparent, rgba(38,108,135,0.15) 40%, rgba(38,108,135,0.04) 100%)" }} />

        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 clamp(20px,5vw,40px)", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "rgba(134,175,170,0.35)", marginBottom: "32px", flexWrap: "wrap" }}>
            <Link href="/tentang/manara" style={{ color: "rgba(134,175,170,0.35)", textDecoration: "none" }}>Tentang Kami</Link>
            <span>→</span>
            <span style={{ color: "rgba(134,175,170,0.6)" }}>Manifesto</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "36px" }}>
            <div style={{ width: "40px", height: "1px", background: "rgba(134,175,170,0.3)" }} />
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.5)", margin: 0 }}>
              Manifesto Manara
            </p>
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(40px,7vw,88px)", fontWeight: 300, color: "#EEF4F6", lineHeight: 1.0, marginBottom: "36px", letterSpacing: "-0.01em" }}>
            Kami tidak<br />mengangkat suara<br />untuk didengar.
          </h1>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 300, fontStyle: "italic", color: "rgba(134,175,170,0.5)", lineHeight: 1.5, maxWidth: "580px" }}>
            Kami mendalamkannya agar orang-orang yang tepat, pada waktu yang tepat, mendengarkan hal yang tepat.
          </p>
        </div>
      </section>

      {/* Opening */}
      <section style={{ padding: "100px clamp(20px,5vw,40px)", background: "#F8FAFA" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 300, color: "#0F2830", lineHeight: 1.65, marginBottom: "32px" }}>
            Manara lahir bukan dari ambisi untuk besar, melainkan dari frustrasi yang produktif: bahwa ruang untuk berpikir dengan serius, berbicara dengan jujur, dan berkarya dengan bermakna terlalu sedikit tersedia untuk anak muda Indonesia.
          </p>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9, marginBottom: "24px" }}>
            Kami tidak mendirikan Manara karena berpikir kami tahu semua jawaban. Kami mendirikannya karena kami percaya bahwa pertanyaan yang tepat, yang diajukan dengan tekun dan kejujuran, sudah merupakan kontribusi yang nyata.
          </p>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "#3A5560", lineHeight: 1.9 }}>
            Inilah manifesto kami merupakan cermin yang kami pegang di depan diri kami sendiri.
          </p>
        </div>
      </section>

      {/* Principles */}
      return <div>
      <section style={{ padding: "100px clamp(20px,5vw,40px)", background: "#0F2830", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 70% at 50% 100%, rgba(38,108,135,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(134,175,170,0.4)", marginBottom: "14px" }}>Yang Kami Percayai</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#EEF4F6" }}>Tujuh prinsip dasar.</h2>
          </div>
          {PRINCIPLES.map((p, i) => (
            <div key={p.num} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: "28px", padding: "44px 0", borderBottom: "1px solid rgba(38,108,135,0.1)", alignItems: "start" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "32px", fontWeight: 300, color: "rgba(38,108,135,0.3)", lineHeight: 1, margin: 0 }}>{p.num}</p>
              <div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(17px,2.5vw,22px)", fontWeight: 400, color: "#EEF4F6", lineHeight: 1.35, marginBottom: "14px" }}>{p.title}</h3>
                <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(134,175,170,0.45)", lineHeight: 1.85 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>;

      {/* Commitments */}
      <section style={{ padding: "100px clamp(20px,5vw,40px)", background: "#F4F7F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#266c87", marginBottom: "14px" }}>Komitmen Kami</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: "#0F2830" }}>Apa yang kami janjikan.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px" }}>
            {COMMITMENTS.map(c => (
              <div key={c.title} style={{ padding: "32px 28px", background: "#fff", border: "1px solid rgba(38,108,135,0.1)", borderRadius: "4px" }}>
                <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#266c87", marginBottom: "10px" }}>{c.title}</p>
                <p style={{ fontSize: "15px", fontWeight: 300, color: "#3A5560", lineHeight: 1.85 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section style={{ padding: "120px clamp(20px,5vw,40px)", background: "#0F2830", textAlign: "center" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,4vw,48px)", fontWeight: 300, fontStyle: "italic", color: "#EEF4F6", lineHeight: 1.3, marginBottom: "28px" }}>
            "Sebuah generasi yang berpikir dengan kedalaman adalah generasi yang tidak mudah dimanipulasi."
          </p>
          <p style={{ fontSize: "13px", fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(134,175,170,0.25)", marginBottom: "56px" }}>
            — Manara Collective, 2026
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/tentang/manara" style={{ background: "#266c87", color: "#fff", padding: "13px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
              Tentang Manara
            </Link>
            <Link href="/manapeople" style={{ border: "1px solid rgba(38,108,135,0.3)", color: "rgba(134,175,170,0.6)", padding: "13px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "2px", textDecoration: "none" }}>
              Bergabung
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}