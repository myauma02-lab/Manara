import Link from 'next/link';
import { useSettings } from "@/hooks/useSettings";

export default function HeroSection() {

const { settings } = useSettings();
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', paddingBottom: '80px',
      background: 'linear-gradient(155deg, #0F2830 0%, #071820 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 15% 85%, rgba(38,108,135,0.22) 0%, transparent 55%)',
      }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 40px', width: '100%' }}>
        <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(58,138,170,0.8)', marginBottom: '8px' }}>
          {settings.hero_tagline || "Shaping Ideas for the Public Sphere"}
        </p>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(134,175,170,0.7)', marginBottom: '32px' }}>
          {settings.hero_subheading || "Est. 2024 · Manara Collective"}
        </p>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontWeight: 300,
          fontSize: 'clamp(52px, 7.5vw, 96px)', lineHeight: 1,
          color: '#EEF4F6', marginBottom: '40px', letterSpacing: '-0.02em',
        }}>
          {settings.hero_title || (
    <>
      Di mana gagasan<br />
      menemukan <em style={{ color: "#86AFAA" }}>cahayanya.</em>
    </>
  )}
        </h1>
        <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(134,175,170,0.5)', maxWidth: '460px', lineHeight: 1.8, marginBottom: '56px' }}>
           {settings.hero_subtitle ||
    "Ruang intelektual, kreatif, dan berpengetahuan — dibangun oleh dan untuk generasi yang berpikir dengan kedalaman."}
        </p>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="#about" style={{
            background: '#266c87', color: '#fff', padding: '15px 36px',
            fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em',
            textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none',
          }}>
            {settings.cta_about || "Kenali Manara"}
          </Link>
          <Link href="#media" style={{ fontSize: '13px', color: 'rgba(134,175,170,0.55)', textDecoration: 'none' }}>
            {settings.cta_media || "Jelajahi karya kami →"}
          </Link>
        </div>
      </div>
    </section>
  );
}