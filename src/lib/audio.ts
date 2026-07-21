let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType, volume: number, delay = 0) {
  try {
    const ctx = getAudioContext();
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  } catch (_) { }
}

function playNoiseBurst(duration: number, volume: number, highpass = 0, lowpass = 22000) {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = (highpass + lowpass) / 2;
    filter.Q.value = 0.5;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (_) { }
}

export function playChime() {
  playTone(880, 0.4, "sine", 0.15);
  playTone(1108, 0.35, "sine", 0.1, 0.07);
  playTone(1320, 0.3, "sine", 0.07, 0.14);
}

export function playConfettiPop() {
  playNoiseBurst(0.15, 0.12, 2000, 8000);
  playTone(600, 0.08, "sine", 0.06);
}

export function playCandleBlow() {
  playTone(200, 0.1, "sine", 0.06);
}

export class HappyBirthdayPlayer {
  private activeOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isPlaying = false;
  private stopRequested = false;

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.stopRequested = false;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const melody = [
        [261.63, 0.75],
        [261.63, 0.25],
        [293.66, 1.0],
        [261.63, 1.0],
        [349.23, 1.0],
        [329.63, 2.0],
        [261.63, 0.75],
        [261.63, 0.25],
        [293.66, 1.0],
        [261.63, 1.0],
        [392.00, 1.0],
        [349.23, 2.0],
        [261.63, 0.75],
        [261.63, 0.25],
        [523.25, 1.0],
        [440.00, 1.0],
        [349.23, 1.0],
        [329.63, 1.0],
        [293.66, 2.0],
        [466.16, 0.75],
        [466.16, 0.25],
        [440.00, 1.0],
        [349.23, 1.0],
        [392.00, 1.0],
        [349.23, 2.0],
      ];

      const tempo = 80;
      const beatDuration = 60 / tempo;
      let t = now + 0.1;

      // Create master gain for the whole melody
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, now);
      masterGain.gain.linearRampToValueAtTime(0.35, t);
      masterGain.connect(ctx.destination);

      melody.forEach(([freq, beats]) => {
        const dur = beats * beatDuration;
        const noteEnd = t + dur;

        // Main sweet oscillator (sine wave - warmest tone)
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        // Gentle pitch vibrato for sweetness
        const vibrato = ctx.createOscillator();
        vibrato.type = "sine";
        vibrato.frequency.value = 5.5;
        const vibratoGain = ctx.createGain();
        vibratoGain.gain.value = 1.8;
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(t);
        vibrato.stop(noteEnd);

        const gain = ctx.createGain();
        // Smooth ADSR envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.28, t + 0.015);
        gain.gain.setValueAtTime(0.28, noteEnd - 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(noteEnd + 0.02);

        this.activeOscs.push({ osc, gain });

        t = noteEnd;
      });

      // Schedule cleanup after melody ends
      const totalDur = t - now;
      setTimeout(() => {
        this.isPlaying = false;
        try { masterGain.disconnect(); } catch (_) {}
      }, (totalDur + 0.5) * 1000);

    } catch (err) {
      console.error("Melody player failed:", err);
      this.isPlaying = false;
    }
  }

  stop() {
    this.stopRequested = true;
    this.isPlaying = false;
    this.activeOscs.forEach(({ osc, gain }) => {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        setTimeout(() => { try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch (_) {} }, 60);
      } catch (_) { }
    });
    this.activeOscs = [];
  }
}

export class MicBlowDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array = new Uint8Array(0);
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationId: number | null = null;
  private blowFrames: number = 0;

  constructor(
    private onBlow: () => void,
    private onVolumeUpdate?: (level: number) => void
  ) { }

  async start(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false
      });

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.detect();
      return true;
    } catch (err) {
      console.error("Microphone access denied or failed:", err);
      return false;
    }
  }

  private detect = () => {
    if (!this.analyser) return;

    this.analyser.getByteFrequencyData(this.dataArray as any);

    let lowFreqSum = 0;
    let totalSum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      totalSum += this.dataArray[i];
      if (i < 8) {
        lowFreqSum += this.dataArray[i];
      }
    }

    const avgVolume = totalSum / this.dataArray.length;
    const avgLowFreq = lowFreqSum / 8;

    if (this.onVolumeUpdate) {
      this.onVolumeUpdate(Math.min((avgVolume / 128) * 100, 100));
    }

    if (avgLowFreq > 120 && avgVolume > 20) {
      this.blowFrames++;
      if (this.blowFrames > 1) {
        this.onBlow();
        this.blowFrames = 0;
      }
    } else {
      this.blowFrames = Math.max(0, this.blowFrames - 1);
    }

    this.animationId = requestAnimationFrame(this.detect);
  };

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
  }
}

// Ambient sound generator using oscillators and noise
function createAmbientOscillator(ctx: AudioContext, freq: number, type: OscillatorType, gainValue: number, detune = 0) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const gain = ctx.createGain();
  gain.gain.value = gainValue;
  osc.connect(gain);
  return { osc, gain };
}

export class AmbientPlayer {
  private ctx: AudioContext | null = null;
  private sources: { stop: () => void }[] = [];
  private type: "fire" | "rain" | "ocean" | "none";

  constructor(type: "fire" | "rain" | "ocean" | "none") {
    this.type = type;
  }

  play() {
    if (this.type === "none") return;
    this.stop();
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = this.ctx;

      if (this.type === "fire") {
        const noiseDur = 2;
        const repeat = () => {
          if (!this.ctx) return;
          playNoiseBurst(noiseDur, 0.04, 100, 4000);
          const next = setTimeout(repeat, 300 + Math.random() * 800);
          this.sources.push({ stop: () => clearTimeout(next) });
        };
        repeat();
        const lowOsc = createAmbientOscillator(ctx, 80, "sawtooth", 0.015);
        lowOsc.osc.start();
        this.sources.push({ stop: () => { try { lowOsc.osc.stop(); lowOsc.osc.disconnect(); lowOsc.gain.disconnect(); } catch (_) { } } });
        lowOsc.gain.connect(ctx.destination);
      }

      if (this.type === "rain") {
        const noiseInterval = setInterval(() => {
          if (!this.ctx) { clearInterval(noiseInterval); return; }
          playNoiseBurst(0.5, 0.02, 3000, 12000);
        }, 100);
        this.sources.push({ stop: () => clearInterval(noiseInterval) });
        const humOsc = createAmbientOscillator(ctx, 120, "sine", 0.01);
        humOsc.osc.start();
        this.sources.push({ stop: () => { try { humOsc.osc.stop(); humOsc.osc.disconnect(); humOsc.gain.disconnect(); } catch (_) { } } });
        humOsc.gain.connect(ctx.destination);
      }

      if (this.type === "ocean") {
        const wave = () => {
          if (!this.ctx) return;
          playNoiseBurst(3, 0.03, 100, 3000);
          const next = setTimeout(wave, 4000 + Math.random() * 3000);
          this.sources.push({ stop: () => clearTimeout(next) });
        };
        wave();
        const droneOsc = createAmbientOscillator(ctx, 60, "sine", 0.015);
        droneOsc.osc.start();
        this.sources.push({ stop: () => { try { droneOsc.osc.stop(); droneOsc.osc.disconnect(); droneOsc.gain.disconnect(); } catch (_) { } } });
        droneOsc.gain.connect(ctx.destination);
      }
    } catch (_) { }
  }

  stop() {
    this.sources.forEach(s => s.stop());
    this.sources = [];
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => { });
    }
    this.ctx = null;
  }
}
