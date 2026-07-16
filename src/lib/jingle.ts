/**
 * Feature E — AI-Composed Birthday Jingle
 *
 * Procedurally composes a short personalized birthday melody using Web Audio API.
 * Themes map to musical modes and instrument timbres for emotional resonance.
 * No external ML model required — pure synthesis in the browser.
 */

type Theme = "romance" | "starry" | "neon" | "pastel" | "retro" | string;

interface JingleConfig {
  theme: Theme;
  name: string;
}

// Musical scales (semitone offsets from root C4 = 261.63 Hz)
const SCALES: Record<string, number[]> = {
  major:      [0, 2, 4, 5, 7, 9, 11, 12],  // warm, happy
  pentatonic: [0, 2, 4, 7, 9, 12, 14, 16], // open, uplifting
  jazz:       [0, 2, 3, 5, 7, 9, 10, 12],  // sophisticated, cool
  dorian:     [0, 2, 3, 5, 7, 9, 10, 12],  // nostalgic, bittersweet
  lydian:     [0, 2, 4, 6, 7, 9, 11, 12],  // ethereal, dreamy
};

// Theme → musical personality
const THEME_CONFIG: Record<string, {
  scale: keyof typeof SCALES;
  rootFreq: number;   // Hz — root note
  tempo: number;      // BPM
  waveform: OscillatorType;
  filterFreq: number; // Hz — lowpass cutoff for timbre
  reverbMix: number;  // 0–1
}> = {
  romance:  { scale: "major",      rootFreq: 293.66, tempo: 88,  waveform: "sine",     filterFreq: 1800, reverbMix: 0.5 },
  starry:   { scale: "lydian",     rootFreq: 261.63, tempo: 72,  waveform: "sine",     filterFreq: 2400, reverbMix: 0.7 },
  neon:     { scale: "pentatonic", rootFreq: 311.13, tempo: 120, waveform: "sawtooth", filterFreq: 1200, reverbMix: 0.3 },
  pastel:   { scale: "pentatonic", rootFreq: 329.63, tempo: 80,  waveform: "triangle", filterFreq: 2000, reverbMix: 0.6 },
  retro:    { scale: "jazz",       rootFreq: 246.94, tempo: 100, waveform: "triangle", filterFreq: 900,  reverbMix: 0.2 },
  default:  { scale: "major",      rootFreq: 261.63, tempo: 96,  waveform: "sine",     filterFreq: 1600, reverbMix: 0.45 },
};

// Convert semitone offset to frequency
function semitoneToHz(rootHz: number, semitone: number): number {
  return rootHz * Math.pow(2, semitone / 12);
}

// Seeded pseudo-random (deterministic per name, so same name = same jingle)
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  let state = Math.abs(hash) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return ((state >>> 0) / 0xFFFFFFFF);
  };
}

// Simple convolution reverb via noise impulse response
async function createReverb(ctx: AudioContext, duration: number, decay: number): Promise<ConvolverNode> {
  const sampleRate = ctx.sampleRate;
  const length = Math.round(sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = impulse;
  return conv;
}

export class JinglePlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private isPlaying = false;
  private timers: ReturnType<typeof setTimeout>[] = [];

  async play(config: JingleConfig): Promise<void> {
    if (this.isPlaying) this.stop();

    const { theme, name } = config;
    const cfg = THEME_CONFIG[theme] ?? THEME_CONFIG.default;
    const scale = SCALES[cfg.scale];
    const rng = seededRandom(name + theme);

    // Enforce the iconic "Happy Birthday to You" melody (semitones relative to C4 root)
    const melody = [
      0, 0, 2, 0, 5, 4,       // Happy birthday to you
      0, 0, 2, 0, 7, 5,       // Happy birthday to you
      0, 0, 12, 9, 5, 4, 2,   // Happy birthday dear Alexa
      10, 10, 9, 5, 7, 5      // Happy birthday to you
    ];

    // Rhythm patterns in beats (quarters, half notes, etc.)
    const rhythm = [
      0.75, 0.25, 1, 1, 1, 2,
      0.75, 0.25, 1, 1, 1, 2,
      0.75, 0.25, 1, 1, 1, 1, 2,
      0.75, 0.25, 1, 1, 1, 2
    ];

    // Setup audio graph
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = this.ctx;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.08);

    // Lowpass filter for timbre shaping
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cfg.filterFreq;
    filter.Q.value = 1.0;

    // Reverb
    const reverb = await createReverb(ctx, 1.8, 3);
    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();
    dryGain.gain.value = 1 - cfg.reverbMix;
    wetGain.gain.value = cfg.reverbMix;

    // Routing: osc → filter → dry → master
    //                      → reverb → wet → master
    filter.connect(dryGain);
    filter.connect(reverb);
    reverb.connect(wetGain);
    dryGain.connect(this.masterGain);
    wetGain.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);

    const beatDur = 60 / cfg.tempo;
    const eighthDur = beatDur / 2;
    let t = ctx.currentTime + 0.1;

    this.isPlaying = true;

    melody.forEach((semitone, i) => {
      const freq = semitoneToHz(cfg.rootFreq, semitone);
      const dur = rhythm[i] * eighthDur;

      // Main oscillator
      const osc = ctx.createOscillator();
      osc.type = cfg.waveform;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.setValueAtTime(freq, t + dur - 0.015);

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, t);
      noteGain.gain.linearRampToValueAtTime(0.7, t + 0.012);
      noteGain.gain.setValueAtTime(0.7, t + dur * 0.7);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.01);

      osc.connect(noteGain);
      noteGain.connect(filter);

      osc.start(t);
      osc.stop(t + dur);
      this.oscs.push(osc);

      // Subtle harmonic overtone at 5th (+7 semitones) for warmth
      if (rng() > 0.5) {
        const harmFreq = semitoneToHz(cfg.rootFreq, semitone + 7);
        const harmOsc = ctx.createOscillator();
        harmOsc.type = "sine";
        harmOsc.frequency.setValueAtTime(harmFreq, t);
        const harmGain = ctx.createGain();
        harmGain.gain.setValueAtTime(0, t);
        harmGain.gain.linearRampToValueAtTime(0.2, t + 0.015);
        harmGain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.8);
        harmOsc.connect(harmGain);
        harmGain.connect(filter);
        harmOsc.start(t);
        harmOsc.stop(t + dur);
        this.oscs.push(harmOsc);
      }

      t += dur;
    });

    // Fade out at the end
    const totalDur = t - (ctx.currentTime + 0.1);
    const fadeTimer = setTimeout(() => {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => { this.isPlaying = false; }, 600);
    }, totalDur * 1000);
    this.timers.push(fadeTimer);
  }

  stop(): void {
    this.isPlaying = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.oscs.forEach(o => { try { o.stop(); } catch (_) {} });
    this.oscs = [];
    if (this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(0, this.ctx?.currentTime ?? 0);
      } catch (_) {}
    }
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.masterGain = null;
  }

  get playing(): boolean { return this.isPlaying; }
}
