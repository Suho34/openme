import { NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import Wish from "@/models/Wish";
import { ipFromHeaders, rateLimit } from "@/lib/rateLimit";
import { isWishLocked } from "@/lib/wishAccess";

const replySchema = z
  .object({
    sourceId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid keepsake id."),
    message: z.string().trim().max(2000).optional().default(""),
    reaction: z
      .enum(["cried", "loved", "laughed", "grateful", "hug"])
      .optional(),
    voiceNoteUrl: z.string().max(8_000_000).optional(),
  })
  .refine(
    (value) =>
      value.message.trim().length > 0 || value.reaction || value.voiceNoteUrl,
    { message: "Send a reaction, a note, or a voice message." },
  );

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("host");
    if (!host || new URL(origin).host !== host) {
      return NextResponse.json({ success: false, error: "Cross-origin request blocked." }, { status: 403 });
    }
  }

  const limit = rateLimit(`replies:${ipFromHeaders(request.headers)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, error: "Too many replies — please wait a minute." },
      { status: 429 },
    );
  }

  const parsed = replySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    const source = await Wish.findById(parsed.data.sourceId).lean();
    if (!source) {
      return NextResponse.json({ success: false, error: "Wish not found" }, { status: 404 });
    }
    if (isWishLocked(source)) {
      return NextResponse.json(
        { success: false, error: "This keepsake has not been opened yet." },
        { status: 403 },
      );
    }

    const reply = await Wish.create({
      name: String(source.sender),
      sender: String(source.name),
      message: parsed.data.message,
      reaction: parsed.data.reaction,
      voiceNoteUrl: parsed.data.voiceNoteUrl,
      theme: String(source.theme),
      letterFont: source.letterFont,
      replyTo: String(source._id),
      deleteAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json({ success: true, id: reply._id.toString() });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { success: false, error: "Could not send that reply. Please try again." },
      { status: 500 },
    );
  }
}
