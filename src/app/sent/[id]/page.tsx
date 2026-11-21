import Link from "next/link";
import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Wish from "@/models/Wish";
import { getReaction } from "@/lib/reactions";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ k?: string }>;
}

export const metadata: Metadata = {
  title: "Your keepsake — WishMaker",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const OBJECT_ID = /^[a-f0-9]{24}$/i;

function formatDate(value?: Date | string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A231F] px-4 py-10">
      <main className="max-w-lg mx-auto">{children}</main>
    </div>
  );
}

export default async function SentPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { k } = await searchParams;

  if (!OBJECT_ID.test(id) || !k) {
    return (
      <Frame>
        <div className="paper-deckle p-8 rounded-lg text-center">
          <h1 className="font-serif text-2xl">This receipt link isn&apos;t valid</h1>
          <p className="text-sm text-[#6F655E] mt-2">
            The tracker link needs its private key. Use the link shown when you sealed the keepsake.
          </p>
        </div>
      </Frame>
    );
  }

  let wish: Record<string, unknown> | null = null;
  let replies: Record<string, unknown>[] = [];

  try {
    await connectToDatabase();
    wish = (await Wish.findOne({ _id: id, senderKey: k }).lean()) as
      | Record<string, unknown>
      | null;

    if (wish) {
      replies = (await Wish.find({ replyTo: id })
        .select("message reaction voiceNoteUrl createdAt sender")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()) as unknown as Record<string, unknown>[];
    }
  } catch (error) {
    console.warn("[SentPage] lookup failed:", error);
  }

  if (!wish) {
    return (
      <Frame>
        <div className="paper-deckle p-8 rounded-lg text-center">
          <h1 className="font-serif text-2xl">This receipt link isn&apos;t valid</h1>
          <p className="text-sm text-[#6F655E] mt-2">
            It may belong to a different keepsake, or the private key doesn&apos;t match.
          </p>
        </div>
      </Frame>
    );
  }

  const name = String(wish.name ?? "");
  const sender = String(wish.sender ?? "");
  const opened = Boolean(wish.firstOpenedAt);
  const openCount = Number(wish.openCount ?? 0);
  const expiresAt = wish.deleteAt ? new Date(String(wish.deleteAt)) : null;

  return (
    <Frame>
      <div className="paper-deckle p-7 sm:p-9 rounded-lg">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B2635]">
          Your keepsake
        </span>
        <h1 className="font-serif text-3xl mt-1">
          For {name}{' '}
          <span className="text-[#7A6F62] text-2xl">from {sender}</span>
        </h1>

        <div
          className={`mt-5 rounded-xl border p-4 ${
            opened ? "border-[#7D8B75]/40 bg-[#7D8B75]/8" : "border-[#E3D4B8] bg-white"
          }`}
        >
          <p className="font-serif text-lg">
            {opened ? "They opened it 💛" : "Still sealed"}
          </p>
          <p className="text-xs text-[#6F655E] mt-1">
            {opened
              ? `First opened ${formatDate(wish.firstOpenedAt as string)}`
              : "It hasn't been opened yet. The link is live and waiting."}
          </p>
        </div>

        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#7A6F62]">Times opened</dt>
            <dd className="font-semibold">{opened ? openCount : 0}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#7A6F62]">Last opened</dt>
            <dd className="font-semibold">{formatDate(wish.lastOpenedAt as string)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#7A6F62]">Voice note</dt>
            <dd className="font-semibold">
              {wish.voiceNoteUrl ? "Included" : "None"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#7A6F62]">Link expires</dt>
            <dd className="font-semibold">{formatDate(expiresAt)}</dd>
          </div>
        </dl>

        <div className="mt-6 pt-5 border-t border-[#E3D4B8]">
          <h2 className="font-serif text-lg mb-2">Sent back to you</h2>
          {replies.length === 0 ? (
            <p className="text-xs text-[#7A6F62] italic">
              No replies yet. When they answer — a tap, a note or a voice message — it shows up
              here.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {replies.map((reply) => {
                const reaction = getReaction(String(reply.reaction ?? ""));
                const message = String(reply.message ?? "").trim();
                const hasVoice = Boolean(reply.voiceNoteUrl);
                const label = reaction
                  ? `${reaction.emoji} ${reaction.label}`
                  : message
                    ? "A note"
                    : hasVoice
                      ? "🎙 Voice message"
                      : "A reply";
                return (
                  <li
                    key={String(reply._id)}
                    className="rounded-lg border border-[#E3D4B8] bg-white p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">
                        {label}
                        {hasVoice && message ? " · voice message" : ""}
                      </span>
                      <Link
                        href={`/wish/${String(reply._id)}`}
                        className="text-xs text-[#8B2635] font-semibold hover:underline"
                      >
                        Open
                      </Link>
                    </div>
                    {message && (
                      <p className="text-xs text-[#554A44] mt-1.5 leading-relaxed">{message}</p>
                    )}
                    {hasVoice && (
                      <p className="text-[11px] text-[#7A6F62] mt-1.5">Includes a voice message.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-[#7A6F62] mt-5">
        Keep this tracker link private — it opens your read receipt only.
      </p>
    </Frame>
  );
}
