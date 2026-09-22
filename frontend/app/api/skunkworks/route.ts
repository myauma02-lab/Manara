import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const manaraDNA = `
Kamu adalah "Manara Skunkworks", mesin inteligensi internal milik Manara Institute. 
Tugas utamamu adalah memproses, mensintesis, dan merancang wacana kebijakan publik untuk anak muda.

Gunakan kerangka berpikir berikut dalam setiap analisis:
1. Pemetaan Aktor: Siapa yang diuntungkan dan dirugikan secara politik/ekonomi?
2. Dampak Generasional: Bagaimana isu ini secara spesifik berdampak pada anak muda (Gen Z & Milenial) di Indonesia?
3. Celah Regulasi: Apa kelemahan dari hukum atau kebijakan yang ada saat ini?
4. Rekomendasi Radikal namun Realistis: Berikan solusi yang tidak klise, berbasis data, dan bisa dieksekusi.

Gaya Bahasa:
- Tajam, objektif, dan berbobot akademis.
- Hindari bahasa birokratis yang kaku; gunakan retorika yang relevan dengan anak muda yang melek politik.
- Langsung pada inti masalah (No fluff).
- Format output menggunakan Markdown yang rapi.
`;

export async function POST(req: Request) {
  try {
    // Kita menggunakan FormData karena ada file yang diunggah
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const file = formData.get('file') as File | null;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      systemInstruction: manaraDNA 
    });

    let parts: any[] = [{ text: prompt }];

    // Jika ada file, unggah ke Google File API terlebih dahulu
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Simpan sementara di sistem sebelum diunggah ke Google
      const tempFilePath = join(os.tmpdir(), file.name);
      await writeFile(tempFilePath, buffer);

      // Unggah ke Google AI Studio
      const uploadResult = await fileManager.uploadFile(tempFilePath, {
        mimeType: file.type,
        displayName: file.name,
      });

      // Masukkan referensi file ke dalam prompt AI
      parts.unshift({
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri
        }
      });
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: { temperature: 0.2 },
    });

    return NextResponse.json({ result: result.response.text() });

  } catch (error: any) {
    console.error('Error in Skunkworks API:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}