/**
 * MediaRecorder gives us webm/opus, which the Gemini API does not document as
 * an inline audio format. Decode it in the browser and re-encode a plain
 * 16 kHz mono PCM WAV, which it does.
 */

function writeString(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function downmixToMono(buffer: AudioBuffer): Float32Array {
  const { numberOfChannels, length } = buffer;
  if (numberOfChannels === 1) return buffer.getChannelData(0).slice();

  const mono = new Float32Array(length);
  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      mono[i] += data[i] / numberOfChannels;
    }
  }
  return mono;
}

function resample(mono: Float32Array, from: number, to: number): Float32Array {
  if (Math.abs(from - to) < 1) return mono;
  const ratio = from / to;
  const length = Math.max(1, Math.floor(mono.length / ratio));
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const position = i * ratio;
    const low = Math.floor(position);
    const high = Math.min(low + 1, mono.length - 1);
    const weight = position - low;
    out[i] = mono[low] * (1 - weight) + mono[high] * weight;
  }
  return out;
}

function encodeWav(samples: Float32Array, sampleRate: number): Uint8Array {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

/** Converts a recorded blob into a `data:audio/wav;base64,…` URL at 16 kHz mono. */
export async function blobToWavDataUrl(
  blob: Blob,
  sampleRate = 16000,
): Promise<string> {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) throw new Error("This browser cannot process the recording.");

  const ac = new Ctor();
  try {
    const decoded = await ac.decodeAudioData(await blob.arrayBuffer());
    const mono = downmixToMono(decoded);
    const resampled = resample(mono, decoded.sampleRate, sampleRate);
    return `data:audio/wav;base64,${toBase64(encodeWav(resampled, sampleRate))}`;
  } finally {
    void ac.close().catch(() => {});
  }
}
