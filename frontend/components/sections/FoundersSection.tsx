import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serverFoundersApi } from "@/lib/server-api";
import styles from "./FoundersSection.module.css";

const FALLBACK_FOUNDERS = [
  { id: "1", name: "Mutamimul Yhauma", role: "Co-Founder", photo: null, slug: null },
  { id: "2", name: "Oca Aulia Putri Nofianti", role: "Co-Founder", photo: null, slug: null },
  { id: "3", name: "Shalsa Bila Agustina", role: "Co-Founder", photo: null, slug: null },
  { id: "4", name: "Firstamarya Diffa Oktavinanti", role: "Co-Founder", photo: null, slug: null },
  { id: "5", name: "Sultan Isjad Ubaidillah", role: "Co-Founder", photo: null, slug: null },
];

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(145deg, #266C87, #0F2830)",
  "linear-gradient(145deg, #3F6F6A, #266C87)",
  "linear-gradient(145deg, #5F8F8A, #3F6F6A)",
  "linear-gradient(145deg, #1A4F63, #266C87)",
  "linear-gradient(145deg, #6E7448, #8A8F5E)",
];

export default async function FoundersSection() {
  const founders = await serverFoundersApi.list() || FALLBACK_FOUNDERS;

  return (
    <section id="founders" className={styles.section} aria-labelledby="founders-heading">
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <p className="site-eyebrow">Orang-orang di balik Manara</p>
            <h2 id="founders-heading" className="site-display">Pikiran yang tumbuh<br />dalam kerja bersama.</h2>
          </div>
          <p>Kenali para penggagas dan kontributor yang membangun ruang intelektual Manara.</p>
        </header>

        <div className={styles.grid}>
          {founders.map((founder, index) => (
            <Link
              key={founder.id}
              href={founder.slug ? "/tentang/founder/" + founder.slug : "/tentang/founder"}
              className={styles.card}
            >
              <div className={styles.portrait} style={{ background: founder.photo ? undefined : PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length] }}>
                {founder.photo ? (
                  <img src={founder.photo} alt={founder.name} loading="lazy" />
                ) : (
                  <span aria-hidden="true">{founder.name?.charAt(0)}</span>
                )}
              </div>
              <div className={styles.personInfo}>
                <span>{founder.role || "Fellow Manara"}</span>
                <h3>{founder.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/tentang/founder" className={styles.allLink}>Kenali tim Manara <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
