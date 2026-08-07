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

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export type ThemeId = "starry" | "neon" | "romance" | "pastel" | "retro";
export type RelationType =
  | "best friend"
  | "partner"
  | "sibling"
  | "family"
  | "colleague"
  | "mentor";
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
  tuneUrl?: string;
  tuneDurationSeconds?: number | null;
  demo?: boolean;
}

export type AccordionFolder =
  | "basics"
  | "ai-writer"
  | "theme"
  | "schedule"
  | "doodle"
  | "timeline"
  | "trivia"
  | "memories";

export interface WishTemplate {
  id: string;
  label: string;
  icon: ReactNode;
  description: string;
  defaults: {
    theme: ThemeId;
    relationship: RelationType;
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
  onCelebrationStart: () => void;
}

export interface Cake3DProps {
  numCandles: number;
  candlesLit: boolean[];
  onCandleClick: (index: number) => void;
}

export interface DevelopingPolaroidProps {
  url: string;
  caption: string;
  tilt: number;
  onClick: () => void;
}

export interface DoodleAnimationProps {
  name: string;
  type?: DoodleType;
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
  onOpenComplete: () => void;
}

export interface MemoryLaneProps {
  memories: Memory[];
}

export interface TimelineProps {
  events?: TimelineEvent[];
}

export interface TriviaGameProps {
  trivia: TriviaQuestion[];
  onComplete: () => void;
}

export interface TriviaFormProps {
  activeFolder: AccordionFolder;
  setActiveFolder: Dispatch<SetStateAction<AccordionFolder>>;
  triviaQuestions: TriviaQuestion[];
  setTriviaQuestions: (t: TriviaQuestion[]) => void;
  SectionHeader: FC<{ icon: ReactNode; children: ReactNode }>;
}

export interface MemoryLaneFormProps {
  activeFolder: AccordionFolder;
  setActiveFolder: Dispatch<SetStateAction<AccordionFolder>>;
  memories: Memory[];
  setMemories: (m: Memory[]) => void;
  SectionHeader: FC<{ icon: ReactNode; children: ReactNode }>;
}

export interface TunePickerProps {
  value: string;
  onSelect: (tuneUrl: string) => void;
}

export interface VoiceRecorderProps {
  onRecordingComplete: (base64Audio: string) => void;
  onClear: () => void;
}

export interface StepProgressBarProps {
  current: number;
  total: number;
  labels: string[];
}

export interface WishViewerProps {
  wishData: WishData;
}

export interface StageOption {
  id: string;
  label: string;
}
