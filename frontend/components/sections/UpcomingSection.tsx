import Link from 'next/link';
export default function UpcomingSection() {
  return (
    <section id="upcoming" style={{ padding: '120px 40px', background: '#F4F7F7' }}>
      <div style={{position: 'relative', zIndex: 2, width: '100%', margin: '0 auto', padding: '0 16px',}}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#0F2830', marginBottom: '24px' }}>
          <em style={{ color: '#266c87' }}>Manapeople</em> — Bergabunglah bersama kami.
        </h2>
        <p style={{ fontSize: '16px', fontWeight: 300, color: '#7A9AA5', maxWidth: '500px', lineHeight: 1.85, marginBottom: '32px' }}>
          Program rekrutmen dan onboarding terbuka pertama Manara. sebuah undangan untuk menjadi bagian dari kolektif ini.
        </p>
        <Link href="/manapeople" style={{ background: '#266c87', color: '#fff', padding: '15px 36px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
          Daftarkan Minatmu →
        </Link>
      </div>
    </section>
  );
}