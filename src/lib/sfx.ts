/**
 * Tiny synthesized sound design. No audio files: every cue is filtered noise
 * shaped into a short gesture, which keeps the bundle small and the palette
 * consistent. All calls are safe no-ops on the server, before a user gesture,
 * or when the recipient has muted sound.
 */

const MUTE_KEY = "wishmaker:sound";

let ctx: AudioContext | null = null;
let cachedMuted: boolean | null = null;
const listeners = new Set<() => void>();

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true;
  if (cachedMuted !== null) return cachedMuted;
  try {
    cachedMuted = window.localStorage.getItem(MUTE_KEY) === "off";
  } catch {
    cachedMuted = false;
  }
  return cachedMuted;
}

/** Store hooks so React can read the preference without an effect. */
export function subscribeSoundMuted(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSoundMutedSnapshot(): boolean {
  return isSoundMuted();
}

export function getSoundMutedServerSnapshot(): boolean {
  return true;
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  cachedMuted = muted;
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "off" : "on");
  } catch {
    /* private mode: the preference just won't persist */
  }
  listeners.forEach((listener) => listener());
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (cachedMuted === null) cachedMuted = isSoundMuted();
  if (cachedMuted) return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

function noise(ac: AudioContext, seconds: number): AudioBuffer {
  const length = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

interface NoiseCue {
  duration: number;
  gain: number;
  type: BiquadFilterType;
  frequency: number;
  toFrequency?: number;
  delay?: number;
}

function playNoise(cue: NoiseCue): void {
  const ac = audio();
  if (!ac) return;

  const now = ac.currentTime + (cue.delay ?? 0);
  const source = ac.createBufferSource();
  source.buffer = noise(ac, cue.duration);

  const filter = ac.createBiquadFilter();
  filter.type = cue.type;
  filter.frequency.setValueAtTime(cue.frequency, now);
  if (cue.toFrequency) {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(40, cue.toFrequency),
      now + cue.duration,
    );
  }
  filter.Q.value = 0.7;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(cue.gain, now + cue.duration * 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + cue.duration);

  source.connect(filter).connect(gain).connect(ac.destination);
  source.start(now);
  source.stop(now + cue.duration + 0.02);
}

function playThump(frequency: number, gain: number, delay = 0): void {
  const ac = audio();
  if (!ac) return;
  const now = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, now);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.6, now + 0.18);
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(env).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

/** Dry paper being lifted — used when the envelope is opened. */
export function playPaper(): void {
  playNoise({ duration: 0.34, gain: 0.05, type: "bandpass", frequency: 2400, toFrequency: 5200 });
  playNoise({ duration: 0.22, gain: 0.03, type: "highpass", frequency: 3200, delay: 0.12 });
}

/** The wax seal giving way: a crisp crack over a low thump. */
export function playSealCrack(): void {
  playNoise({ duration: 0.09, gain: 0.11, type: "highpass", frequency: 2600 });
  playThump(120, 0.12, 0.01);
  playNoise({ duration: 0.26, gain: 0.035, type: "bandpass", frequency: 1500, toFrequency: 700, delay: 0.07 });
}

/** A match being struck for the candles. */
export function playMatch(): void {
  playNoise({ duration: 0.18, gain: 0.05, type: "highpass", frequency: 1800, toFrequency: 6200 });
  playNoise({ duration: 0.3, gain: 0.022, type: "bandpass", frequency: 1200, toFrequency: 2400, delay: 0.1 });
}

/** A page turning between chapters. */
export function playPageTurn(): void {
  playNoise({ duration: 0.3, gain: 0.04, type: "bandpass", frequency: 900, toFrequency: 2100 });
}
