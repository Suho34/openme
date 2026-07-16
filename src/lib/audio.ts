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
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play a sequence of sweet pentatonic chime frequencies
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.6);
    });
  } catch (err) {
    console.error("Audio synthesis failed:", err);
  }
}

// 2. Synthesize a confetti popping sound (noise burst + pop)
export function playConfettiPop() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create white noise buffer
    const bufferSize = ctx.sampleRate * 0.15; // 0.15s duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    // Play noise
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.12);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noiseSource.start(now);
    noiseSource.stop(now + 0.15);
    
    // Add a low bass pop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (err) {
    console.error("Audio synthesis failed:", err);
  }
}

// 3. Synthesize a realistic candle blowout sound (whispery white noise)
export function playCandleBlow() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const bufferSize = ctx.sampleRate * 0.3; // 0.3s duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.25);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(now);
    source.stop(now + 0.3);
  } catch (err) {
    console.error("Audio synthesis failed:", err);
  }
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
  
  constructor(
    private onBlow: () => void,
    private onVolumeUpdate?: (level: number) => void
  ) {}

  async start(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
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
    // Threshold is set around 130 (out of 255 max value)
    if (avgLowFreq > 135) {
      this.onBlow();
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
