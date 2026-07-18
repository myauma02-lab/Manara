export default function SearchModal({ isActive, onClose }: { isActive: boolean; onClose: () => void }) {
  if (!isActive) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '96px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#F4F7F7', border: '1px solid rgba(38,108,135,0.15)', borderRadius: '4px', width: '100%', maxWidth: '600px', padding: '20px' }}>
        <input autoFocus placeholder="Cari artikel, riset..." style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', background: 'transparent', color: '#1C3038' }} />
      </div>
    </div>
  );
}