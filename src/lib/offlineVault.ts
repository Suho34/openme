import type { WishData } from "@/lib/types";
import { getReaction } from "@/lib/reactions";

const DB_NAME = "wishmaker";
const DB_VERSION = 1;
const STORE = "vault";

function openDb(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

/**
 * Caches a keepsake on the device. Uses IndexedDB rather than localStorage:
 * wishes can carry base64 photos and voice notes that blow past the ~5 MB
 * localStorage quota, and the quota error used to be swallowed silently.
 */
export async function cacheWishLocally(id: string, wishData: WishData): Promise<void> {
  const db = await openDb();
  if (!db) return;

  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(wishData, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("Could not cache wish locally:", err);
  } finally {
    db.close();
  }
}

/** Everything in this file is inserted into HTML, so it is escaped first. */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Only real data URLs or http(s) URLs are allowed into src attributes. */
function safeUrl(value: unknown): string {
  const url = String(value ?? "").trim();
  if (/^data:audio\/[a-z0-9.+-]+;base64,/i.test(url)) return url;
  if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(url)) return url;
  if (/^https?:\/\//i.test(url)) return esc(url);
  return "";
}

const FONT_FAMILIES: Record<string, string> = {
  brush: "'Alex Brush', cursive",
  caveat: "'Caveat', cursive",
  homemade: "'Homemade Apple', cursive",
};

/**
 * Generates and downloads a self-contained, standalone offline HTML file.
 * The link itself expires after a week, so this file is how the recipient
 * keeps the keepsake for good — no server, no database, no network needed.
 */
export function downloadKeepsakeVault(wishData: WishData): void {
  if (typeof window === "undefined") return;

  const name = esc(wishData.name);
  const sender = esc(wishData.sender);
  const title = `Keepsake for ${name} — From ${sender}`;
  const safeName = String(wishData.name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const letterFont = FONT_FAMILIES[wishData.letterFont ?? "brush"] ?? FONT_FAMILIES.brush;
  const reaction = getReaction(wishData.reaction);

  const memoriesHtml = (wishData.memories || [])
    .filter((m) => safeUrl(m.url))
    .map(
      (m, idx) => `
      <div class="polaroid-card">
        <div class="polaroid-inner">
          <img src="${safeUrl(m.url)}" alt="Memory ${idx + 1}" />
          <div class="brass-corner tl"></div>
          <div class="brass-corner tr"></div>
          <div class="brass-corner bl"></div>
          <div class="brass-corner br"></div>
        </div>
        <p class="polaroid-caption">${esc(m.caption)}</p>
      </div>
    `,
    )
    .join("");

  const scrollsHtml = (wishData.scrollNotes || [])
    .map(
      (s, idx) => `
      <div class="scroll-item">
        <span class="scroll-num">#${idx + 1}</span>
        <p class="scroll-text">&ldquo;${esc(s.text)}&rdquo;</p>
      </div>
    `,
    )
    .join("");

  const capsulesHtml = (wishData.timeCapsules || [])
    .map((c) => {
      const photo = safeUrl(c.photoUrl);
      const audio = safeUrl(c.voiceNoteUrl);
      return `
      <div class="capsule-card" onclick="this.classList.toggle('revealed')">
        <div class="capsule-front">
          <span class="wax-dot">♥</span>
          <h4>${esc(c.prompt)}</h4>
          <span class="tap-hint">Tap to unlock capsule</span>
        </div>
        <div class="capsule-content">
          <p class="capsule-message">${esc(c.message)}</p>
          ${c.voucher ? `<div class="capsule-voucher"><strong>Promise:</strong> ${esc(c.voucher)}</div>` : ""}
          ${photo ? `<img src="${photo}" class="capsule-photo" alt="Secret photo" />` : ""}
          ${audio ? `<audio controls src="${audio}" class="capsule-audio"></audio>` : ""}
        </div>
      </div>
    `;
    })
    .join("");

  const timelineHtml = (wishData.timeline || [])
    .map(
      (event) => `
      <div class="timeline-item">
        <span class="timeline-date">${esc(event.date)}</span>
        <p class="timeline-title">${esc(event.title)}</p>
        <p class="timeline-desc">${esc(event.description)}</p>
      </div>
    `,
    )
    .join("");

  const voiceNote = safeUrl(wishData.voiceNoteUrl);
  const message = esc(wishData.message);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Alex+Brush&family=Caveat:wght@400..700&family=Homemade+Apple&family=Inter:wght@300;400;500;600&display=swap');

    :root {
      --bg: #FAF6F0;
      --paper: #F4EFE6;
      --crimson: #8B2635;
      --gold: #C5A059;
      --walnut: #3B271E;
      --ink: #2A231F;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--ink);
      font-family: 'Inter', -apple-system, sans-serif;
      padding: 24px 16px 60px;
      line-height: 1.6;
    }

    .container { max-width: 680px; margin: 0 auto; }

    .vault-banner { text-align: center; margin-bottom: 32px; padding: 16px; border-bottom: 1px solid #E3D4B8; }
    .vault-banner h1 { font-family: 'Playfair Display', serif; font-size: 1.75rem; color: var(--crimson); margin-bottom: 4px; }
    .vault-banner p { font-size: 0.85rem; color: #7A6F62; }

    .reaction-banner {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      background: #FFF; border: 1px solid #E3D4B8; border-radius: 12px;
      padding: 14px; margin-bottom: 28px; color: var(--walnut);
      font-family: 'Playfair Display', serif; font-style: italic;
    }
    .reaction-banner .emoji { font-size: 1.6rem; font-style: normal; }

    .letter-card {
      background: var(--paper);
      border: 1px solid #E3D4B8;
      box-shadow: 0 10px 30px rgba(59, 39, 30, 0.08);
      border-radius: 6px;
      padding: 36px 28px;
      position: relative;
      margin-bottom: 36px;
    }
    .wax-seal {
      width: 48px; height: 48px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #A23545, #4E101C);
      color: #FFF; display: flex; align-items: center; justify-content: center;
      font-size: 18px; position: absolute; top: -24px; left: 32px;
      box-shadow: 0 4px 12px rgba(78, 16, 28, 0.4);
    }
    .letter-title { font-family: ${letterFont}; font-size: 2.2rem; color: var(--crimson); margin-top: 8px; margin-bottom: 16px; }
    .letter-body { font-family: ${letterFont}; font-size: 1.5rem; line-height: 1.8; color: #382F2A; white-space: pre-wrap; }
    .letter-sig { font-family: ${letterFont}; font-size: 1.8rem; color: var(--crimson); margin-top: 24px; text-align: right; }

    .section-title {
      font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--walnut);
      margin: 40px 0 16px; display: flex; align-items: center; gap: 10px;
    }
    .section-title::after { content: ""; flex: 1; height: 1px; background: #E3D4B8; }

    .polaroid-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .polaroid-card {
      background: #FFF; padding: 12px 12px 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      border: 1px solid #ECE3DA; border-radius: 4px; transform: rotate(-1deg); transition: transform 0.2s;
    }
    .polaroid-card:nth-child(even) { transform: rotate(1deg); }
    .polaroid-card:hover { transform: rotate(0) scale(1.02); }
    .polaroid-inner { position: relative; width: 100%; height: 200px; background: #F4EFE6; overflow: hidden; }
    .polaroid-inner img { width: 100%; height: 100%; object-fit: cover; }
    .brass-corner { position: absolute; width: 12px; height: 12px; border: 2px solid var(--gold); }
    .brass-corner.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; }
    .brass-corner.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; }
    .brass-corner.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; }
    .brass-corner.br { bottom: 0; right: 0; border-left: 0; border-top: 0; }
    .polaroid-caption { font-family: 'Caveat', cursive; font-size: 1.35rem; color: #4A3E37; text-align: center; margin-top: 10px; }

    .scroll-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; }
    .scroll-item {
      background: #FFF; border-left: 4px solid var(--gold); border-radius: 4px;
      padding: 14px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      display: flex; align-items: baseline; gap: 12px;
    }
    .scroll-num { font-weight: 700; color: var(--crimson); font-size: 0.85rem; }
    .scroll-text { font-family: 'Playfair Display', serif; font-style: italic; color: #3B271E; font-size: 1.05rem; }

    .timeline-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
    .timeline-item { background: #FFF; border: 1px solid #ECE3DA; border-radius: 8px; padding: 14px 16px; }
    .timeline-date { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); font-weight: 600; }
    .timeline-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--walnut); }
    .timeline-desc { font-size: 0.9rem; color: #6F655E; }

    .capsule-grid { display: flex; flex-direction: column; gap: 14px; margin-bottom: 30px; }
    .capsule-card {
      background: #FFF; border: 1px solid #E3D4B8; border-radius: 8px; padding: 18px;
      cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: all 0.3s;
    }
    .capsule-card:hover { border-color: var(--crimson); }
    .capsule-front { display: flex; align-items: center; gap: 12px; }
    .wax-dot {
      width: 24px; height: 24px; border-radius: 50%; background: var(--crimson); color: #FFF;
      display: inline-flex; align-items: center; justify-content: center; font-size: 11px;
    }
    .capsule-front h4 { flex: 1; font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--walnut); }
    .tap-hint { font-size: 0.75rem; color: var(--gold); font-weight: 600; }
    .capsule-content { display: none; margin-top: 14px; padding-top: 14px; border-top: 1px dashed #E3D4B8; }
    .capsule-card.revealed .capsule-content { display: block; }
    .capsule-card.revealed .tap-hint { display: none; }
    .capsule-message { font-family: 'Playfair Display', serif; font-size: 1rem; color: #382F2A; margin-bottom: 10px; white-space: pre-wrap; }
    .capsule-voucher {
      background: #FAF6F0; border: 1px dashed var(--gold); padding: 8px 12px;
      border-radius: 4px; font-size: 0.85rem; color: var(--walnut); margin-top: 8px;
    }
    .capsule-photo { max-width: 100%; border-radius: 6px; margin-top: 10px; }
    .capsule-audio { width: 100%; margin-top: 10px; }

    footer { text-align: center; font-size: 0.8rem; color: #A09383; margin-top: 40px; border-top: 1px solid #E3D4B8; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="vault-banner">
      <h1>Your keepsake</h1>
      <p>From ${sender} to ${name} &bull; saved offline, yours to keep</p>
    </div>

    ${
      reaction
        ? `<div class="reaction-banner"><span class="emoji">${reaction.emoji}</span><span>${esc(reaction.line)}</span></div>`
        : ""
    }

    <div class="letter-card">
      <div class="wax-seal">♥</div>
      <div class="letter-title">Dearest ${name},</div>
      <div class="letter-body">${message}</div>
      <div class="letter-sig">Always, ${sender}</div>
    </div>

    ${
      memoriesHtml
        ? `<h3 class="section-title">Treasured Moments</h3><div class="polaroid-grid">${memoriesHtml}</div>`
        : ""
    }

    ${
      scrollsHtml
        ? `<h3 class="section-title">${esc(wishData.scrollJarTitle || "Jar of Little Scrolls")}</h3><div class="scroll-list">${scrollsHtml}</div>`
        : ""
    }

    ${
      timelineHtml
        ? `<h3 class="section-title">Our Story</h3><div class="timeline-list">${timelineHtml}</div>`
        : ""
    }

    ${
      capsulesHtml
        ? `<h3 class="section-title">Open When... Time Capsules</h3><div class="capsule-grid">${capsulesHtml}</div>`
        : ""
    }

    ${
      voiceNote
        ? `<h3 class="section-title">Whispered Voice Note</h3>
      <div style="background: #FFF; padding: 16px; border-radius: 8px; border: 1px solid #E3D4B8;">
        <audio controls src="${voiceNote}" style="width: 100%;"></audio>
      </div>`
        : ""
    }

    <footer>
      WishMaker keepsake &bull; This file is self-contained: it opens anytime, offline, on any phone or computer.
    </footer>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `WishMaker-Keepsake-${safeName}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
