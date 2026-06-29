export default function AboutSection() {
  return (
    <section id="about" style={{ padding: '120px 40px', background: '#F8FAFA' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#266c87', marginBottom: '24px' }}>
          Tentang Manara
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: '#0F2830', lineHeight: 1.2, marginBottom: '32px' }}>
          Lebih dari sebuah organisasi —<br /><em style={{ color: '#266c87' }}>sebuah gerakan pemikiran.</em>
        </h2>
        <p style={{ fontSize: '16px', fontWeight: 300, color: '#3A5560', lineHeight: 1.85, maxWidth: '640px', marginBottom: '20px' }}>
          Manara adalah kolektif intelektual dan inisiatif media kreatif yang lahir dari keyakinan bahwa diskursus yang bermakna dimulai dari mereka yang berani berpikir secara mendalam, berbicara dengan jujur, dan berkarya dengan berani.
        </p>
        <p style={{ fontSize: '16px', fontWeight: 300, color: '#3A5560', lineHeight: 1.85, maxWidth: '640px' }}>
          Kami hadir di persimpangan gagasan, media, dan komunitas: sebagian think tank, sebagian studio kreatif, sebagian platform wacana anak muda.
        </p>
      </div>
    </section>
  );
}