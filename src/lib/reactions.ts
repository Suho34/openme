import type { ReactionKind } from "@/lib/types";

export interface Reaction {
  kind: ReactionKind;
  emoji: string;
  label: string;
  /** The line shown on the reply keepsake itself. */
  line: string;
}

export const REACTIONS: Reaction[] = [
  { kind: "cried", emoji: "🥹", label: "I cried", line: "This one made me cry." },
  { kind: "loved", emoji: "❤️", label: "Loved it", line: "I loved every second of this." },
  { kind: "laughed", emoji: "😂", label: "Laughed", line: "I laughed out loud at this." },
  { kind: "grateful", emoji: "🙏", label: "Thank you", line: "Thank you — I really needed this." },
  { kind: "hug", emoji: "🫂", label: "Sending a hug", line: "Consider yourself hugged from here." },
];

export function getReaction(kind?: string): Reaction | undefined {
  return REACTIONS.find((reaction) => reaction.kind === kind);
}
