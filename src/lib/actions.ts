"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Wish from "@/models/Wish";

export async function generateMessage(data: {
  name: string;
  sender: string;
  relationship: string;
  keywords: string;
  toneDescription?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const toneInstruction = data.toneDescription
    ? `Overall tone of all 3 drafts should be ${data.toneDescription}. Still vary them slightly, but keep the general energy consistent with that tone.`
    : "Vary the tone across drafts: Draft 1 = warm & affectionate, Draft 2 = funny & nostalgic, Draft 3 = poetic & inspiring.";

  const prompt = `You are a heartfelt letter writer. Write 3 distinct birthday letter drafts for a person named "${data.name}" from "${data.sender}" who is their ${data.relationship}.

Additional context about this person: ${data.keywords || "none provided"}.

Requirements:
- Each draft should be 3-5 sentences long
- ${toneInstruction}
- Do NOT use generic phrases like "may all your dreams come true" — be specific and personal based on the relationship and keywords
- Return ONLY a JSON array with 3 string elements, no markdown, no explanation

Example format: ["Draft 1 text here.", "Draft 2 text here.", "Draft 3 text here."]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const drafts = JSON.parse(text);

  if (!Array.isArray(drafts) || drafts.length !== 3) {
    throw new Error("Unexpected response format from Gemini");
  }

  return { drafts };
}

export async function recommendTheme(data: {
  message: string;
  keywords?: string;
  relationship?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const context = [
    data.message ? `Message draft: "${data.message}"` : "",
    data.keywords ? `Keywords about recipient: ${data.keywords}` : "",
    data.relationship ? `Relationship: ${data.relationship}` : "",
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

  return { theme: parsed.theme as string, reason: parsed.reason as string };
}

export async function saveWish(data: Record<string, unknown>) {
  await connectToDatabase();

  let deleteAt = new Date();
  if (data.deliveryLock) {
    deleteAt = new Date(new Date(data.deliveryLock as number).getTime() + 7 * 24 * 60 * 60 * 1000);
  } else {
    deleteAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const newWish = new Wish({ ...data, deleteAt });
  const savedWish = await newWish.save();
  return { id: savedWish._id.toString() };
}
