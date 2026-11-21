import type { FC, Dispatch, ReactNode, SetStateAction } from "react";

export interface Memory {
  url: string;
  caption: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface ScrollNote {
  id: string;
  text: string;
  tag?: string;
}

export interface TimeCapsule {
  id: string;
  prompt: string;
  message: string;
  voiceNoteUrl?: string;
  photoUrl?: string;
  voucher?: string;
  unlockedAt?: string | null;
}

export type ThemeId = "starry" | "neon" | "romance" | "pastel" | "retro";
export type AmbienceType = "fire" | "rain" | "ocean" | "none";
export type CakeStyle = "classic" | "berry" | "matcha" | "chocolate";
export type LetterFont = "brush" | "caveat" | "homemade";

/** One-tap replies. The value is what gets stored on the reply document. */
export type ReactionKind = "cried" | "loved" | "laughed" | "grateful" | "hug";

export interface WishData {
  name: string;
  age?: number;
  sender: string;
  message: string;
  theme: string;
  replyTo?: string;
  /** Set when this keepsake is itself an answer to someone else's. */
  reaction?: string;
  memories?: Memory[];
  deliveryLock?: number | Date | string;
  /** True when the server withheld the content because the delivery lock is still closed. */
  locked?: boolean;
  timeline?: TimelineEvent[];
  ambience?: AmbienceType;
  cakeStyle?: CakeStyle;
  letterFont?: LetterFont;
  voiceNoteUrl?: string;
  tuneUrl?: string;
  tuneDurationSeconds?: number | null;
  scrollNotes?: ScrollNote[];
  scrollJarTitle?: string;
  timeCapsules?: TimeCapsule[];
  /** When this link (and its row) disappears. */
  expiresAt?: string | number | Date;
  demo?: boolean;
}

export type AccordionFolder =
  | "basics"
  | "ai-writer"
  | "theme"
  | "schedule"
  | "timeline"
  | "memories";

export interface WishTemplate {
  id: string;
  label: string;
  icon: ReactNode;
  description: string;
  defaults: {
    theme: ThemeId;
    convey: string;
    tone: number;
    keywords: string;
    prompt: string;
    messagePlaceholder: string;
  };
}

export interface Balloon {
  id: number;
  x: number;
  speed: number;
  color: string;
  glow: string;
  popped: boolean;
  wish: string;
}

export interface BirthdayCakeProps {
  name: string;
  age?: number;
  tuneUrl?: string;
  cakeStyle?: CakeStyle;
  onStat?: (stats: { candlesTries: number; usedMicrophone: boolean }) => void;
  onCelebrationStart: () => void;
}

export interface Cake3DProps {
  numCandles: number;
  candlesLit: boolean[];
  onCandleClick: (index: number) => void;
  cakeStyle?: CakeStyle;
}

export interface DevelopingPolaroidProps {
  url: string;
  caption: string;
  tilt: number;
  onClick: () => void;
}

export interface FireworksProps {
  name?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  color: string;
  length: number;
}

export interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  palette: string[];
  exploded: boolean;
  targetY: number;
  trail: { x: number; y: number; alpha: number }[];
  isText: boolean;
  textIndex?: number;
}

export interface GiftBoxSurpriseProps {
  sender: string;
  message: string;
  name: string;
  theme: string;
  letterFont?: LetterFont;
  onOpenComplete: () => void;
}

export interface MemoryLaneProps {
  memories: Memory[];
}

export interface TimelineProps {
  events?: TimelineEvent[];
}

export interface MemoryLaneFormProps {
  memories: Memory[];
  setMemories?: (m: Memory[]) => void;
  onChange?: (m: Memory[]) => void;
  recipientName?: string;
  activeFolder?: AccordionFolder;
  setActiveFolder?: Dispatch<SetStateAction<AccordionFolder>>;
  SectionHeader?: FC<{ icon: ReactNode; children: ReactNode }>;
}

export interface TunePickerProps {
  value: string;
  onSelect: (tuneUrl: string) => void;
}

export interface VoiceRecorderProps {
  onRecordingComplete: (base64Audio: string) => void;
  onClear?: () => void;
  /** Recording length in seconds. Defaults to 60. */
  maxDuration?: number;
  /** Hide the card wrapper and label for use inside a compact composer. */
  compact?: boolean;
}

export interface StepProgressBarProps {
  current: number;
  total: number;
  labels: string[];
}

export interface WishViewerProps {
  wishData: WishData;
  wishId?: string;
  onUnlockRequest?: () => void;
}

export interface StageOption {
  id: string;
  label: string;
}
