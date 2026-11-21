"use server";

import { randomBytes } from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rateLimit";
import Wish from "@/models/Wish";

const MODEL = "gemini-2.5-flash";

/** Models sometimes wrap JSON in a ```json fence despite the instructions. */
function extractJsonArray(raw: string): string[] | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const text = (fenced ? fenced[1] : raw).trim();
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  } catch {
    return null;
  }
}

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return apiKey;
}

const interviewAnswerSchema = z.object({
  question: z.string().trim().max(300),
  answer: z.string().trim().max(600),
});

const letterInputSchema = z.object({
  name: z.string().trim().min(1, "Recipient name is required.").max(80),
  sender: z.string().trim().min(1, "Your name is required.").max(80),
  whatToSay: z.string().max(1200).optional().default(""),
  keywords: z.string().max(1200).optional().default(""),
  toneDescription: z.string().max(200).optional(),
  interview: z.array(interviewAnswerSchema).max(6).optional(),
});

export async function generateMessage(data: {
  name: string;
  sender: string;
  whatToSay: string;
  keywords: string;
  toneDescription?: string;
  interview?: { question: string; answer: string }[];
}) {
  const apiKey = getApiKey();

  const input = letterInputSchema.safeParse(data);
  if (!input.success) {
    throw new Error(input.error.issues[0]?.message ?? "Please check the names you entered.");
  }
  const { name, sender, whatToSay, keywords, toneDescription } = input.data;
  const answers = (input.data.interview ?? []).filter((a) => a.answer.trim().length > 0);

  await enforceRateLimit("ai:letter", 8, 60_000);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json", temperature: 0.9 },
  });

  const toneInstruction = toneDescription
    ? `Overall tone of all 3 drafts should be ${toneDescription}. Still vary them slightly, but keep the general energy consistent with that tone.`
    : "Vary the tone across drafts: Draft 1 = warm & affectionate, Draft 2 = funny & nostalgic, Draft 3 = poetic & inspiring.";

  const interviewBlock = answers.length
    ? `The sender sat down and answered these questions about ${name}. These answers are your ONLY source of specific facts — quote, compress or paraphrase them, and do not invent any memory, habit or detail that is not here:
${answers.map((a, i) => `${i + 1}. ${a.question}\n   ${a.answer}`).join("\n")}

Every draft must be built out of at least two of these real answers.`
    : "";

  const lengthRule = answers.length
    ? "- Each draft should be 90–140 words (roughly 5–7 sentences). Considerate and readable, never padded."
    : "- Each draft should be 3-5 sentences.";

  const prompt = `You are a gifted letter writer for a birthday surprise. Write 3 distinct, personal birthday letter drafts from "${sender}" to "${name}".

The sender wants to express this: ${whatToSay || `how much ${name} means to them`}.

${interviewBlock}

Specific, real details to weave in naturally (mention these concretely, never vaguely): ${keywords || "none provided — keep it observational rather than inventing events"}.

Ground rules — IMPORTANT:
- Write like a real person who actually knows ${name}, not like a greeting card. Be specific and concrete; let details do the work.
- Avoid clichés and empty filler like "you're the best", "may all your dreams come true", "cheers to another year" or generic fortune-cookie platitudes.
- No over-the-top, saccharine birthday language. Prefer understated warmth, sharp observation, and true-to-life sentiment.
${lengthRule}
- ${toneInstruction}
- Return ONLY a JSON array with 3 string elements, no markdown, no explanation

Example format: ["Draft 1 text here.", "Draft 2 text here.", "Draft 3 text here."]`;

  const result = await model.generateContent(prompt);
  const drafts = extractJsonArray(result.response.text());

  if (!drafts || drafts.length !== 3) {
    throw new Error("The letter writer returned an unexpected response. Please try again.");
  }

  return { drafts };
}

/**
 * Turns a recorded spoken answer into text. The client re-encodes the recording
 * to 16 kHz mono WAV because Gemini documents WAV but not webm/opus.
 */
export async function transcribeAnswer(dataUrl: string) {
  const apiKey = getApiKey();

  const input = z
    .object({ dataUrl: z.string().max(6_000_000) })
    .safeParse({ dataUrl });
  if (!input.success) throw new Error("That recording was too long. Try a shorter answer.");

  const match =
    /^data:(audio\/(?:wav|mpeg|mp3|ogg|aac|flac));base64,([A-Za-z0-9+/=\s]+)$/.exec(
      input.data.dataUrl,
    );
  if (!match) throw new Error("That recording could not be read. Please type your answer.");
  const mimeType = match[1];
  const base64 = match[2].replace(/\s/g, "");

  await enforceRateLimit("ai:transcribe", 10, 60_000);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL });

  const result = await model.generateContent([
    "Transcribe this spoken message verbatim, exactly as the speaker said it. Keep their wording, filler words and first person voice. Do not summarise, correct grammar, add punctuation-heavy formatting, or add any commentary. Return only the transcript text.",
    { inlineData: { mimeType, data: base64 } },
  ]);

  const text = result.response.text().trim();
  if (!text) throw new Error("We couldn't hear any words in that recording.");
  return { text };
}

export async function captionPhoto(dataUrl: string, recipientName?: string) {
  const apiKey = getApiKey();

  const input = z
    .object({
      dataUrl: z.string().max(12_000_000),
      recipientName: z.string().trim().max(80).optional(),
    })
    .safeParse({ dataUrl, recipientName });
  if (!input.success) throw new Error("That image could not be read. Try a smaller photo.");

  await enforceRateLimit("ai:caption", 20, 60_000);

  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(
    input.data.dataUrl,
  );
  if (!match) throw new Error("Invalid image data.");
  const mimeType = match[1];
  const base64 = match[2].replace(/\s/g, "");

  const nameHint = input.data.recipientName
    ? ` This memory is for "${input.data.recipientName}".`
    : "";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `You are a warm, playful birthday memory captioner. Look at the photo and write ONE short, warm, nostalgic caption (max 12 words) for a polaroid memory card.${nameHint} Mention a detail you can actually see in the photo. Do not use generic phrases. Return ONLY the caption text, no quotes, no explanation.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType,
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
  const input = z
    .object({
      recipientName: z.string().trim().min(1, "Recipient name is required.").max(80),
      senderName: z.string().trim().min(1, "Your name is required.").max(80),
      relationship: z.string().max(60).optional().default("friend"),
      userNotes: z.string().max(2000).optional().default(""),
      count: z.number().int().min(1).max(12).optional(),
    })
    .safeParse(data);
  if (!input.success) {
    throw new Error(input.error.issues[0]?.message ?? "Please check the scroll details.");
  }
  const { recipientName, senderName, relationship, userNotes } = input.data;
  const count = input.data.count ?? 7;
  const apiKey = process.env.GEMINI_API_KEY;

  await enforceRateLimit("ai:scrolls", 8, 60_000);

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: { responseMimeType: "application/json", temperature: 0.95 },
      });
      const prompt = `You are helping someone fill an antique jar with small rolled parchment scrolls for ${recipientName}'s birthday.
The sender is ${senderName}, and their relationship is: ${relationship}.
The sender shared these rough thoughts, memories, or inside jokes: "${userNotes || "they always support me, make me laugh, and are an irreplaceable person"}".

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
      const notes = extractJsonArray(result.response.text());
      if (notes && notes.length > 0) {
        return {
          scrolls: notes.slice(0, count).map((text, idx) => ({
            id: `scroll-${Date.now()}-${idx}`,
            text,
          })),
        };
      }
    } catch (e) {
      console.warn("Gemini scroll generation fallback:", e);
    }
  }

  // Fallback tailored by relationship
  const rel = relationship.toLowerCase();
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

const wishPayloadSchema = z.object({
  name: z.string().trim().min(1, "Recipient name is required.").max(80),
  age: z.number().int().min(0).max(150).nullish(),
  sender: z.string().trim().min(1, "Your name is required.").max(80),
  message: z.string().trim().min(1, "Please write a birthday letter.").max(5000),
  theme: z.enum(["starry", "neon", "romance", "pastel", "retro"]),
  memories: z
    .array(
      z.object({
        url: z.string().max(900_000),
        caption: z.string().max(300).default(""),
      }),
    )
    .max(12)
    .default([]),
  deliveryLock: z.number().finite().optional(),
  timeline: z
    .array(
      z.object({
        date: z.string().max(40).default(""),
        title: z.string().max(120),
        description: z.string().max(500).default(""),
      }),
    )
    .max(12)
    .default([]),
  ambience: z.enum(["fire", "rain", "ocean", "none"]).optional(),
  cakeStyle: z.enum(["classic", "berry", "matcha", "chocolate"]).optional(),
  letterFont: z.enum(["brush", "caveat", "homemade"]).optional(),
  voiceNoteUrl: z.string().max(8_000_000).optional(),
  tuneUrl: z.string().max(2000).optional(),
  scrollNotes: z
    .array(
      z.object({
        id: z.string().max(80).optional(),
        text: z.string().max(400),
        tag: z.string().max(40).optional(),
      }),
    )
    .max(24)
    .default([]),
  scrollJarTitle: z.string().max(80).optional(),
  timeCapsules: z
    .array(
      z.object({
        id: z.string().max(80).optional(),
        prompt: z.string().max(80),
        message: z.string().max(2000),
        voiceNoteUrl: z.string().max(8_000_000).optional(),
        photoUrl: z.string().max(900_000).optional(),
        voucher: z.string().max(200).optional(),
        unlockedAt: z.string().max(40).nullish(),
      }),
    )
    .max(12)
    .default([]),
});

export async function saveWish(data: Record<string, unknown>) {
  await enforceRateLimit("wishes:create", 10, 60_000);

  // Only whitelisted fields are accepted: a caller can never inject _id,
  // replyTo, createdAt or other model internals through this action.
  const parsed = wishPayloadSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Some details of this keepsake are invalid.");
  }
  const wish = parsed.data;

  try {
    await connectToDatabase();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error("Failed to connect to the database.");
  }

  const deleteAt = new Date(
    (wish.deliveryLock ?? Date.now()) + 7 * 24 * 60 * 60 * 1000,
  );

  // The key is the only thing that lets the sender read the receipt: it is
  // generated server-side and never included in the public wish payload.
  const senderKey = randomBytes(12).toString("hex");

  const newWish = new Wish({
    ...wish,
    age: wish.age ?? undefined,
    deliveryLock: wish.deliveryLock ? new Date(wish.deliveryLock) : undefined,
    scrollNotes: wish.scrollNotes.map((note, idx) => ({
      ...note,
      id: note.id || `scroll-${Date.now()}-${idx}`,
    })),
    timeCapsules: wish.timeCapsules.map((capsule, idx) => ({
      ...capsule,
      id: capsule.id || `capsule-${Date.now()}-${idx}`,
    })),
    senderKey,
    deleteAt,
  });
  const savedWish = await newWish.save();
  return {
    id: savedWish._id.toString(),
    manageUrl: `/sent/${savedWish._id.toString()}?k=${senderKey}`,
  };
}
