const MEDIA = [
  { type: 'Long-Form Publication', title: 'Manara Journal' },
  { type: 'Short Video Series', title: 'Suara Manara' },
  { type: 'Podcast Series', title: 'Manara Podcast' },
  { type: 'Newsletter', title: 'Surat Manara' },
  { type: 'Live Forum Series', title: 'Dialog' },
  { type: 'Research Publication', title: 'Manara Papers' },
];
export default function MediaSection() {
  return (
    <section id="media" style={{ padding: '120px 40px', background: '#F4F7F7' }}>
      <div style={{position: 'relative', zIndex: 2, width: '100%', margin: '0 auto', padding: '0 16px',}}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#0F2830', marginBottom: '48px', textAlign: 'center' }}>Ekosistem Media</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {MEDIA.map(m => (
            <div key={m.title} style={{ border: '1px solid rgba(38,108,135,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#F8FAFA' }}>
              <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #0F2830, #266c87)' }} />
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#266c87', marginBottom: '8px' }}>{m.type}</p>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '21px', color: '#0F2830' }}>{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}