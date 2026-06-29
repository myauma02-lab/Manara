export default function ValuesSection() {
  const values = [
    { title: 'Depth', body: 'Kami menolak superfisialitas dalam segala bentuknya.' },
    { title: 'Integrity', body: 'Kejujuran di atas kenyamanan.' },
    { title: 'Collective', body: 'Gagasan tumbuh lebih kuat saat dibagikan.' },
    { title: 'Courage', body: 'Kami mengajukan pertanyaan sulit.' },
  ];
  return (
    <section id="values" style={{ padding: '120px 40px', background: '#F4F7F7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#0F2830', marginBottom: '48px' }}>Prinsip yang menuntun kami.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {values.map(v => (
            <div key={v.title} style={{ padding: '40px 28px', border: '1px solid rgba(38,108,135,0.1)', borderRadius: '4px', background: '#F8FAFA' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 400, color: '#0F2830', marginBottom: '14px' }}>{v.title}</h3>
              <p style={{ fontSize: '14px', fontWeight: 300, color: '#7A9AA5', lineHeight: 1.8 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}