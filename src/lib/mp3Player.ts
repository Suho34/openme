import { DEFAULT_TUNE_CLIP_SECONDS, BIRTHDAY_TUNES } from "./tunes";

export function clipSecondsFor(src: string): number | null {
  if (BIRTHDAY_TUNES.some((t) => t.src === src)) {
    return DEFAULT_TUNE_CLIP_SECONDS;
  }
  // Custom / uploaded tunes play in full unless the caller overrides.
  return null;
}

// Plays a single MP3 (via HTMLAudioElement) with an optional auto-stop clip.
export class Mp3Player {
  private audio: HTMLAudioElement | null = null;
  private stopTimer: number | null = null;
  private _src = "";
  private _playing = false;

  get src() {
    return this._src;
  }

  get playing() {
    return this._playing;
  }

  get currentTime() {
    return this.audio?.currentTime ?? 0;
  }

  async play(
    src: string,
    clipSeconds: number | null = clipSecondsFor(src),
  ) {
    this.stop();
    if (!src) return;
    this._src = src;
    const audio = new Audio(src);
    audio.loop = false;
    audio.volume = 0.8;
    this.audio = audio;
    this._playing = true;
    try {
      await audio.play();
    } catch {
      // Autoplay may be blocked until a user gesture; caller can retry.
      this.stop();
      return;
    }
    if (clipSeconds && clipSeconds > 0) {
      this.stopTimer = window.setTimeout(() => this.stop(), clipSeconds * 1000);
    }
  }

  stop() {
    if (this.stopTimer !== null) {
      window.clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch {
        // ignore
      }
      this.audio = null;
    }
    this._playing = false;
    this._src = "";
  }
}