import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    console.log("=== GEMINI ROUTE ===");

    const body = await request.json();

    const SYSTEM_PROMPT = body.SYSTEM_PROMPT ?? "";
    const messages = body.messages ?? [];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
${SYSTEM_PROMPT}

Riwayat Percakapan:

${messages
  .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
  .join("\n")}
`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      content: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}