"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Wish from "@/models/Wish";

export async function generateMessage(data: {
  name: string;
  sender: string;
  whatToSay: string;
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

  const prompt = `You are a gifted letter writer for a birthday surprise. Write 3 distinct, personal birthday letter drafts from "${data.sender}" to "${data.name}".

The sender wants to express this: ${data.whatToSay || "how much ${data.name} means to them"}.

Specific, real details to weave in naturally (mention these concretely, never vaguely): ${data.keywords || "none provided — invent believable, specific details instead"}.

Ground rules — IMPORTANT:
- Write like a real person who actually knows ${data.name}, not like a greeting card. Be specific and concrete; let details do the work.
- Avoid clichés and empty filler like "you're the best", "may all your dreams come true", "cheers to another year" or generic fortune-cookie platitudes.
- No over-the-top, saccharine birthday language. Prefer understated warmth, sharp observation, and true-to-life sentiment.
- Each draft should be 3-5 sentences.
- ${toneInstruction}
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

export async function captionPhoto(dataUrl: string, recipientName?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const base64 = dataUrl.split(",")[1];
  if (!base64) throw new Error("Invalid image data.");

  const nameHint = recipientName
    ? ` This memory is for "${recipientName}".`
    : "";

  const prompt = `You are a warm, playful birthday memory captioner. Look at the photo and write ONE short, warm, nostalgic caption (max 12 words) for a polaroid memory card.${nameHint} Mention a detail you can actually see in the photo. Do not use generic phrases. Return ONLY the caption text, no quotes, no explanation.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64,
      },
    },
  ]);

  const caption = result.response.text().trim().replace(/^"|"$/g, "");
  return { caption };
}

export async function generateScrollNotes(data: {
  recipientName: string;
  senderName: string;
  relationship: string;
  userNotes: string;
  count?: number;
}) {
  const count = data.count || 7;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are helping someone fill an antique jar with small rolled parchment scrolls for ${data.recipientName}'s birthday.
The sender is ${data.senderName}, and their relationship is: ${data.relationship}.
The sender shared these rough thoughts, memories, or inside jokes: "${data.userNotes || "they always support me, make me laugh, and are an irreplaceable person"}".

Write exactly ${count} short, distinct, poignant, or witty rolled parchment scroll notes.
Ground rules:
- Each scroll note should be 1 to 2 sentences (between 10 and 25 words).
- Tailor the tone to the relationship:
  * Friend: witty, celebratory, inside jokes, unwavering loyalty.
  * Sibling/Family: nostalgic, childhood memories, affectionate teasing, deep gratitude.
  * Partner: tender, observant of small quirks, deeply romantic.
  * Colleague: warm appreciation, team camaraderie, cheering on their greatness.
- Avoid generic greeting-card fluff. Make each note feel like a genuine, true-to-life observation.
- Return ONLY a JSON array of strings, e.g. ["note 1", "note 2", "note 3"]. No markdown, no code block markers.`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      if (text.startsWith("```json")) {
        text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      } else if (text.startsWith("```")) {
        text = text.replace(/```\n?/g, "").trim();
      }
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          scrolls: parsed.slice(0, count).map((t, idx) => ({
            id: `scroll-${Date.now()}-${idx}`,
            text: String(t),
          })),
        };
      }
    } catch (e) {
      console.warn("Gemini scroll generation fallback:", e);
    }
  }

  // Fallback tailored by relationship
  const rel = data.relationship?.toLowerCase() || "friend";
  let fallbackTexts: string[] = [];
  if (rel.includes("partner") || rel.includes("romance") || rel.includes("love")) {
    fallbackTexts = [
      "The quiet way your hand always finds mine when we're walking together.",
      "How you always laugh hardest at your own stories before you finish them.",
      "That unforgettable rainy night where we lost track of time and talked until dawn.",
      "Your kindness to everyone you meet, even when the world is heavy.",
      "The sound of your voice first thing in the morning when you're still half asleep.",
      "Every small triumph you achieved this year that made me burst with pride.",
      "Simply this: the universe gave me you, and that makes every day a gift.",
    ];
  } else if (rel.includes("sibling") || rel.includes("family")) {
    fallbackTexts = [
      "No matter how far apart life pulls us, you will always be home to me.",
      "The ridiculous childhood secrets and inside jokes that nobody else gets.",
      "How you always have my back without needing a single explanation.",
      "The way we can communicate an entire sentence with just one look across the room.",
      "Thank you for being the person who has known me longest and still loves me.",
      "Every late-night kitchen conversation that reminded me how lucky we are.",
      "Proud of the human you have become and the light you bring to all of us.",
    ];
  } else if (rel.includes("colleague") || rel.includes("work")) {
    fallbackTexts = [
      "Our team is undeniably better, sharper, and so much funnier with you on it.",
      "Your calm brilliance during chaotic deadline weeks that keeps everyone grounded.",
      "That legendary project we survived together against all odds.",
      "Thank you for always bringing your best energy and lifting up everyone around you.",
      "The coffee breaks that turned an exhausting workday into something to look forward to.",
      "Wishing you the most well-deserved year of wins, growth, and celebrated milestones.",
      "Happy Birthday to a genuinely phenomenal teammate and even better human.",
    ];
  } else {
    fallbackTexts = [
      "The fact that we can go weeks without talking and pick up right where we left off.",
      "That completely chaotic adventure that we swore we'd never tell anyone else about.",
      "How you are always the first person I want to text when something unbelievable happens.",
      "Your laugh is completely contagious and has saved more bad days than you know.",
      "Thank you for being the one person who never judges my questionable decisions.",
      "Surviving everything this past year threw at us and still standing side by side.",
      "Happy Birthday to my favorite human — may this year be your best chapter yet.",
    ];
  }

  return {
    scrolls: fallbackTexts.slice(0, count).map((t, idx) => ({
      id: `scroll-${Date.now()}-${idx}`,
      text: t,
    })),
  };
}

export async function saveWish(data: Record<string, unknown>) {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error("Failed to connect to the database.");
  }

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
