export interface BirthdayTune {
  id: string;
  label: string;
  mood: string;
  src: string;
}

export const BIRTHDAY_TUNES: BirthdayTune[] = [
  {
    id: "classic-piano",
    label: "Classic Piano",
    mood: "Warm & intimate",
    src: "/nastelbom-happy-birthday-471481.mp3",
  },
  {
    id: "upbeat-pop",
    label: "Upbeat Pop",
    mood: "Bright & fun",
    src: "/soulprodmusic-happy-birthday-220024.mp3",
  },
  {
    id: "soft-acoustic",
    label: "Soft Acoustic",
    mood: "Gentle & cozy",
    src: "/sub_clair-happy-birthday-579516.mp3",
  },
  {
    id: "dreamy-strings",
    label: "Dreamy",
    mood: "Romantic & ethereal",
    src: "/the_mountain-happy-birthday-508020.mp3",
  },
];

// Theme → default tune id (only used when the creator didn't pick/upload one)
const DEFAULT_TUNE_BY_THEME: Record<string, string> = {
  romance: "classic-piano",
  starry: "dreamy-strings",
  neon: "upbeat-pop",
  pastel: "soft-acoustic",
  retro: "classic-piano",
};

export const DEFAULT_TUNE_CLIP_SECONDS = 15;

export function defaultTuneFor(theme: string): BirthdayTune {
  const id = DEFAULT_TUNE_BY_THEME[theme] ?? "classic-piano";
  return BIRTHDAY_TUNES.find((t) => t.id === id) ?? BIRTHDAY_TUNES[0];
}

// Pick from a stored tuneUrl — if it matches a built-in file use its metadata,
// otherwise treat it as an arbitrary (creator-uploaded) audio URL.
export function resolveTune(tuneUrl?: string): string {
  if (!tuneUrl) return "";
  return tuneUrl;
}