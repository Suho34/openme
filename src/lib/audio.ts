/**
 * Web Audio API synthesizer for birthday celebration sounds and microphone blow detection.
 * This runs natively in the browser without requiring external audio asset downloads.
 */

// Sound synthesis helper functions
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

// 1. Synthesize a sparkling chime sound
export function playChime() {
  // Sound removed as requested
}

// 2. Synthesize a confetti popping sound (noise burst + pop)
export function playConfettiPop() {
  // Sound removed as requested
}

// 3. Synthesize a realistic candle blowout sound (whispery white noise)
export function playCandleBlow() {
  // Sound removed as requested
}

// 4. Play Synthesized "Happy Birthday" melody
export class HappyBirthdayPlayer {
  private activeOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isPlaying = false;
  private timerIds: any[] = [];

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.timerIds = [];

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Happy Birthday Melody
      // Format: [note/freq, duration in beats]
      const melody = [
        [261.63, 0.75], // C4
        [261.63, 0.25], // C4
        [293.66, 1.0],  // D4
        [261.63, 1.0],  // C4
        [349.23, 1.0],  // F4
        [329.63, 2.0],  // E4

        [261.63, 0.75], // C4
        [261.63, 0.25], // C4
        [293.66, 1.0],  // D4
        [261.63, 1.0],  // C4
        [392.00, 1.0],  // G4
        [349.23, 2.0],  // F4

        [261.63, 0.75], // C4
        [261.63, 0.25], // C4
        [523.25, 1.0],  // C5
        [440.00, 1.0],  // A4
        [349.23, 1.0],  // F4
        [329.63, 1.0],  // E4
        [293.66, 2.0],  // D4

        [466.16, 0.75], // A#4/Bb4
        [466.16, 0.25], // Bb4
        [440.00, 1.0],  // A4
        [349.23, 1.0],  // F4
        [392.00, 1.0],  // G4
        [349.23, 2.0],  // F4
      ];

      const tempo = 110; // BPM
      const beatDuration = 60 / tempo;
      let scheduledTime = now + 0.1;

      melody.forEach(([freq, beats], index) => {
        const dur = beats * beatDuration;

        const timerId = setTimeout(() => {
          if (!this.isPlaying) return;
          this.playNote(freq, dur - 0.05);
        }, (scheduledTime - now) * 1000);

        this.timerIds.push(timerId);
        scheduledTime += dur;
      });

      // Reset play status at end
      const finalTimerId = setTimeout(() => {
        this.isPlaying = false;
      }, (scheduledTime - now + 0.5) * 1000);
      this.timerIds.push(finalTimerId);

    } catch (err) {
      console.error("Melody player failed:", err);
      this.isPlaying = false;
    }
  }

  private playNote(freq: number, duration: number) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Melody Oscillator (Warm Triangle)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      // Simple synth volume envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Sub-harmonic oscillator for warmth (one octave down)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(freq / 2, now);
      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Routing
      osc.connect(gain);
      gain.connect(ctx.destination);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      // Track oscillators to stop them if needed
      const pair1 = { osc, gain };
      const pair2 = { osc: subOsc, gain: subGain };
      this.activeOscs.push(pair1, pair2);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + duration);
      subOsc.stop(now + duration);

      setTimeout(() => {
        this.activeOscs = this.activeOscs.filter(p => p.osc !== osc && p.osc !== subOsc);
      }, duration * 1000 + 100);

    } catch (err) {
      console.error("Play note failed:", err);
    }
  }

  stop() {
    this.isPlaying = false;
    this.timerIds.forEach(id => clearTimeout(id));
    this.timerIds = [];

    this.activeOscs.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (err) {
        // Ignore already stopped
      }
    });
    this.activeOscs = [];
  }
}

// 5. Microphone Blow Detector class
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

    // Low frequency energy represents blowing sound (breath/wind)
    // We look at indices 0-6 (frequencies below ~250Hz)
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
      // Return relative level from 0 to 100
      this.onVolumeUpdate(Math.min((avgVolume / 128) * 100, 100));
    }

    // Blow detection: high energy in low frequencies
    // Require sustained rumble (a few consecutive frames of high low-freq energy)
    // to prevent accidental triggers from speech or bumps.
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

export class AmbientPlayer {
  constructor(type: "fire" | "rain" | "ocean" | "none") {
  }

  play() {
    // Sound removed as requested
  }

  stop() {
    // Sound removed as requested
  }
}
