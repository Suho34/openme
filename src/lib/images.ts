/**
 * Client-side photo pipeline. Phone cameras produce 4–8 MB files with EXIF
 * rotation; wishes keep images inline as base64, so everything is resized and
 * re-encoded before it ever reaches the form state.
 */

const MAX_EDGE = 1400;
const MAX_CHARS = 350_000;
const QUALITIES = [0.82, 0.7, 0.6, 0.5, 0.4, 0.32];

async function loadBitmap(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      // `from-image` applies the EXIF orientation, so portraits stay upright.
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* fall through to the <img> path for older engines */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("That image could not be read."));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function encode(canvas: HTMLCanvasElement, quality: number): string {
  const webp = canvas.toDataURL("image/webp", quality);
  if (webp.startsWith("data:image/webp")) return webp;
  return canvas.toDataURL("image/jpeg", quality);
}

/** Resizes, rotates correctly and compresses a photo into a data URL. */
export async function compressImage(file: File): Promise<string> {
  const source = await loadBitmap(file);
  const width = "width" in source ? source.width : 0;
  const height = "height" in source ? source.height : 0;
  if (!width || !height) throw new Error("That image could not be read.");

  // Never upscale a small photo — it only adds bytes.
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot process images.");
  context.drawImage(source as CanvasImageSource, 0, 0, canvas.width, canvas.height);

  let dataUrl = encode(canvas, QUALITIES[0]);
  for (const quality of QUALITIES.slice(1)) {
    if (dataUrl.length <= MAX_CHARS) break;
    dataUrl = encode(canvas, quality);
  }

  if ("close" in source && typeof source.close === "function") source.close();
  return dataUrl;
}
