'use client';

import { useState } from 'react';

export default function SkunkworksLab() {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch('/api/skunkworks', {
        method: 'POST',
        // Catatan: Jangan set Content-Type secara manual saat menggunakan FormData
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada server');
      }

      setResponse(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">🔬 Skunkworks Lab</h1>
        <p className="text-gray-500 mt-2">Mesin Inteligensi Internal Manara Institute (Classified)</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg border">
        <div className="flex flex-col gap-4">
          
          {/* Input Dokumen Pendukung */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Dokumen Referensi (Opsional - PDF/Doc):
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
              disabled={isLoading}
            />
          </div>

          {/* Input Prompt Utama */}
          <div>
            <label htmlFor="prompt" className="block font-semibold text-gray-700 mb-2">
              Instruksi Analisis:
            </label>
            <textarea
              id="prompt"
              rows={5}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Contoh: Baca dokumen kebijakan ini. Identifikasi 3 pasal yang merugikan pekerja kreatif muda..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors self-end"
          >
            {isLoading ? 'Memproses Data...' : 'Eksekusi Analisis'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-8 border border-red-200">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Hasil Sintesis:</h2>
          <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}