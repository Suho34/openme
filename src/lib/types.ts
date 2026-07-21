export interface Memory {
  url: string;
  caption: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export type ThemeId = "starry" | "neon" | "romance" | "pastel" | "retro";

export type DoodleType = "heart" | "rose" | "hearts" | "coffee";

export type AmbienceType = "fire" | "rain" | "ocean" | "none";

export interface WishData {
  name: string;
  age?: number;
  sender: string;
  message: string;
  theme: string;
  memories?: Memory[];
  deliveryLock?: number | Date | string;
  timeline?: TimelineEvent[];
  trivia?: TriviaQuestion[];
  doodleType?: DoodleType;
  ambience?: AmbienceType;
  voiceNoteUrl?: string;
  demo?: boolean;
}

export type Stage = "gift" | "cake" | "final-wish" | "doodle" | "timeline" | "memories" | "trivia" | "balloons" | "letter" | "finale";
