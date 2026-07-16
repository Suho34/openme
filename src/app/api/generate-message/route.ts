import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, sender, relationship, keywords, toneDescription } = body as {
      name: string;
      sender: string;
      relationship: string;
      keywords: string;
      toneDescription?: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const toneInstruction = toneDescription
      ? `Overall tone of all 3 drafts should be ${toneDescription}. Still vary them slightly, but keep the general energy consistent with that tone.`
      : "Vary the tone across drafts: Draft 1 = warm & affectionate, Draft 2 = funny & nostalgic, Draft 3 = poetic & inspiring.";

    const prompt = `You are a heartfelt letter writer. Write 3 distinct birthday letter drafts for a person named "${name}" from "${sender}" who is their ${relationship}.

Additional context about this person: ${keywords || "none provided"}.

Requirements:
- Each draft should be 3-5 sentences long
- ${toneInstruction}
- Do NOT use generic phrases like "may all your dreams come true" — be specific and personal based on the relationship and keywords
- Return ONLY a JSON array with 3 string elements, no markdown, no explanation

Example format: ["Draft 1 text here.", "Draft 2 text here.", "Draft 3 text here."]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse the JSON array from response
    const drafts = JSON.parse(text);
    if (!Array.isArray(drafts) || drafts.length !== 3) {
      throw new Error("Unexpected response format from Gemini");
    }

    return NextResponse.json({ drafts });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate message drafts." },
      { status: 500 }
    );
  }
}
