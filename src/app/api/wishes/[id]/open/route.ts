import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Wish from "@/models/Wish";
import { ipFromHeaders, rateLimit } from "@/lib/rateLimit";
import { isWishLocked } from "@/lib/wishAccess";

const OBJECT_ID = /^[a-f0-9]{24}$/i;

/**
 * A tiny beacon the recipient's browser fires once per device. It exists so the
 * sender can see that their keepsake was actually opened — nothing else is
 * recorded, and a locked keepsake reports nothing. A beacon carrying the
 * sender's own key (their preview link) is acknowledged but not counted.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("host");
    if (!host || new URL(origin).host !== host) {
      return NextResponse.json({ success: false }, { status: 403 });
    }
  }

  const limit = rateLimit(`open:${ipFromHeaders(request.headers)}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  if (!OBJECT_ID.test(id)) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const wish = await Wish.findById(id).select("deliveryLock senderKey").lean();
    if (!wish || isWishLocked(wish)) {
      return NextResponse.json({ success: true });
    }

    const senderKey = new URL(request.url).searchParams.get("k");
    if (senderKey && wish.senderKey === senderKey) {
      return NextResponse.json({ success: true });
    }

    const now = new Date();
    await Wish.updateOne(
      { _id: id },
      {
        $min: { firstOpenedAt: now },
        $max: { lastOpenedAt: now },
        $inc: { openCount: 1 },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording open:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
