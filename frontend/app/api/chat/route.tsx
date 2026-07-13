import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  const body = await request.json();
  const SYSTEM_PROMPT = body.SYSTEM_PROMPT ?? "";
  const validMessages = body.validMessages ?? [];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
${SYSTEM_PROMPT}

Riwayat percakapan:

${validMessages
  .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
  .join("\n")}
`,
          },
        ],
      },
    ],
  });

  const text = response.text;
  return NextResponse.json({
    content: text,
  });
}