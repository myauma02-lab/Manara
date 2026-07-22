'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from "@/lib/api";

const login = async (email: string, password: string) => {
  const { data } = await authApi.login(email, password);

  localStorage.setItem("manara_token", data.token);

  return data;
};

export default function AdminLoginPage() {
  const router = useRouter();
  useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/admin');
    } catch {
      setError('Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100vh', background: '#0F2830', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'rgba(38,108,135,0.05)', border: '1px solid rgba(38,108,135,0.15)', borderRadius: '4px', padding: '48px', width: '100%', maxWidth: '400px' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#EEF4F6', marginBottom: '32px' }}>Masuk ke Dashboard</p>
        {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@manara.id" required
            style={{ background: 'rgba(38,108,135,0.08)', border: '1px solid rgba(38,108,135,0.2)', borderRadius: '2px', padding: '14px 16px', color: '#EEF4F6', fontSize: '14px', outline: 'none' }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required
            style={{ background: 'rgba(38,108,135,0.08)', border: '1px solid rgba(38,108,135,0.2)', borderRadius: '2px', padding: '14px 16px', color: '#EEF4F6', fontSize: '14px', outline: 'none' }} />
          <button type="submit" disabled={isLoading}
            style={{ background: '#266c87', color: '#fff', padding: '14px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '2px', cursor: 'pointer', marginTop: '8px' }}>
            {isLoading ? 'Memproses...' : 'Masuk →'}
          </button>
        </div>
      </form>
    </div>
  );
}