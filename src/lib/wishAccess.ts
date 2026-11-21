import type { WishData } from "@/lib/types";

type Lockable = { deliveryLock?: unknown };

export function getUnlockTime(wish: Lockable): number | null {
  if (!wish.deliveryLock) return null;
  const ts = new Date(wish.deliveryLock as string | number | Date).getTime();
  return Number.isFinite(ts) ? ts : null;
}

export function isWishLocked(wish: Lockable, now = Date.now()): boolean {
  const unlockAt = getUnlockTime(wish);
  return unlockAt !== null && now < unlockAt;
}

/** Public fields only. `senderKey` and other model internals must never leave the server. */
const PUBLIC_FIELDS = [
  "name",
  "age",
  "sender",
  "message",
  "theme",
  "replyTo",
  "reaction",
  "memories",
  "deliveryLock",
  "timeline",
  "ambience",
  "cakeStyle",
  "letterFont",
  "voiceNoteUrl",
  "tuneUrl",
  "tuneDurationSeconds",
  "scrollNotes",
  "scrollJarTitle",
  "timeCapsules",
] as const;

/**
 * Server-side gate for a scheduled wish: until the countdown reaches zero the
 * browser only receives what the lock screen needs (names, theme, unlock time).
 * Nothing that can be read in devtools — letter, photos, voice note, scrolls —
 * is sent early.
 */
export function toViewableWish(wish: Record<string, unknown>): WishData {
  // Round-trips BSON dates into ISO strings and strips Mongoose documents.
  const source = JSON.parse(JSON.stringify(wish)) as Record<string, unknown>;
  const expiresAt = source.deleteAt as string | undefined;

  if (isWishLocked(wish)) {
    return {
      name: String(source.name ?? ""),
      sender: String(source.sender ?? ""),
      theme: String(source.theme ?? "romance"),
      deliveryLock: source.deliveryLock as string,
      message: "",
      locked: true,
      expiresAt,
    };
  }

  const viewable: Record<string, unknown> = {};
  for (const field of PUBLIC_FIELDS) {
    if (source[field] !== undefined) viewable[field] = source[field];
  }
  // Old rows may predate the default; the viewer always expects a string.
  viewable.message = typeof viewable.message === "string" ? viewable.message : "";
  viewable.expiresAt = expiresAt;
  return viewable as unknown as WishData;
}
