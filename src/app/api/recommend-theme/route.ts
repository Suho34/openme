import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, keywords, relationship } = await req.json() as {
      message: string;
      keywords?: string;
      relationship?: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = [
      message ? `Message draft: "${message}"` : "",
      keywords ? `Keywords about recipient: ${keywords}` : "",
      relationship ? `Relationship: ${relationship}` : "",
    ].filter(Boolean).join(". ");

    const prompt = `You are a birthday experience designer. Based on the following context, recommend the single best theme from this list: starry, neon, romance, pastel, retro.

Context: ${context}

Theme descriptions:
- starry: deep space vibes, blue & gold, ethereal, for dreamers and philosophers
- neon: electric dark, cyan & purple pulses, bold, for tech-savvy or creative types
- romance: warm glow, rose tones, intimate, for partners or close loved ones
- pastel: soft lavender & mint, gentle, dreamy, for cheerful or artistic personalities
- retro: vintage amber & warm brown, nostalgic, classic, for those who love memories

Return ONLY a JSON object with two keys:
1. "theme": the recommended theme id (one of: starry, neon, romance, pastel, retro)
2. "reason": a one-sentence explanation why (max 15 words)

Example: {"theme":"starry","reason":"The poetic tone and cosmic keywords match the ethereal starry experience."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);

    if (!parsed.theme || !["starry", "neon", "romance", "pastel", "retro"].includes(parsed.theme)) {
      throw new Error("Invalid theme recommendation from Gemini");
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Theme recommendation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
