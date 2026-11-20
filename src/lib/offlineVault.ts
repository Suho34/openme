import type { WishData } from "@/lib/types";

const VAULT_PREFIX = "wishmaker_vault_";
const VAULT_INDEX = "wishmaker_vault_list";

/**
 * Caches a keepsake on the device's local storage permanently.
 */
export function cacheWishLocally(id: string, wishData: WishData): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${VAULT_PREFIX}${id}`;
    localStorage.setItem(key, JSON.stringify(wishData));

    // Update list of saved vaults
    const listRaw = localStorage.getItem(VAULT_INDEX);
    const list: string[] = listRaw ? JSON.parse(listRaw) : [];
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(VAULT_INDEX, JSON.stringify(list));
    }
  } catch (err) {
    console.warn("Could not cache wish locally:", err);
  }
}

/**
 * Retrieves a locally cached keepsake.
 */
export function getCachedWish(id: string): WishData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${VAULT_PREFIX}${id}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn("Could not retrieve cached wish:", err);
  }
  return null;
}

/**
 * Generates and downloads a self-contained, standalone offline interactive HTML file.
 * The recipient can keep this forever on their phone or computer, completely independent
 * of any server or database.
 */
export function downloadKeepsakeVault(wishData: WishData): void {
  if (typeof window === "undefined") return;

  const title = `Keepsake for ${wishData.name} — From ${wishData.sender}`;
  const safeName = wishData.name.replace(/[^a-zA-Z0-9_-]/g, "_");

  // Format memories
  const memoriesHtml = (wishData.memories || [])
    .map(
      (m, idx) => `
      <div class="polaroid-card">
        <div class="polaroid-inner">
          <img src="${m.url}" alt="Memory ${idx + 1}" />
          <div class="brass-corner tl"></div>
          <div class="brass-corner tr"></div>
          <div class="brass-corner bl"></div>
          <div class="brass-corner br"></div>
        </div>
        <p class="polaroid-caption">${m.caption || ""}</p>
      </div>
    `,
    )
    .join("");

  // Format scroll notes
  const scrollsHtml = (wishData.scrollNotes || [])
    .map(
      (s, idx) => `
      <div class="scroll-item">
        <span class="scroll-num">#${idx + 1}</span>
        <p class="scroll-text">“${s.text}”</p>
      </div>
    `,
    )
    .join("");

  // Format time capsules
  const capsulesHtml = (wishData.timeCapsules || [])
    .map(
      (c, idx) => `
      <div class="capsule-card" onclick="this.classList.toggle('revealed')">
        <div class="capsule-front">
          <span class="wax-dot">♥</span>
          <h4>${c.prompt}</h4>
          <span class="tap-hint">Tap to unlock capsule</span>
        </div>
        <div class="capsule-content">
          <p class="capsule-message">${c.message}</p>
          ${c.voucher ? `<div class="capsule-voucher"><strong>Promise:</strong> ${c.voucher}</div>` : ""}
          ${c.photoUrl ? `<img src="${c.photoUrl}" class="capsule-photo" alt="Locked photo" />` : ""}
          ${c.voiceNoteUrl ? `<audio controls src="${c.voiceNoteUrl}" class="capsule-audio"></audio>` : ""}
        </div>
      </div>
    `,
    )
    .join("");

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Alex+Brush&family=Inter:wght@300;400;500;600&display=swap');
    
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

    .container {
      max-width: 680px;
      margin: 0 auto;
    }

    .vault-banner {
      text-align: center;
      margin-bottom: 32px;
      padding: 16px;
      border-bottom: 1px solid #E3D4B8;
    }
    .vault-banner h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      color: var(--crimson);
      margin-bottom: 4px;
    }
    .vault-banner p {
      font-size: 0.85rem;
      color: #7A6F62;
    }

    /* Deckle Letter */
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
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #A23545, #4E101C);
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      position: absolute;
      top: -24px;
      left: 32px;
      box-shadow: 0 4px 12px rgba(78, 16, 28, 0.4);
    }
    .letter-title {
      font-family: 'Alex Brush', cursive;
      font-size: 2.2rem;
      color: var(--crimson);
      margin-top: 8px;
      margin-bottom: 16px;
    }
    .letter-body {
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem;
      line-height: 1.8;
      color: #382F2A;
      white-space: pre-wrap;
    }
    .letter-sig {
      font-family: 'Alex Brush', cursive;
      font-size: 1.8rem;
      color: var(--crimson);
      margin-top: 24px;
      text-align: right;
    }

    /* Section Headings */
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.35rem;
      color: var(--walnut);
      margin: 40px 0 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #E3D4B8;
    }

    /* Scrapbook */
    .polaroid-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .polaroid-card {
      background: #FFF;
      padding: 12px 12px 18px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      border: 1px solid #ECE3DA;
      border-radius: 4px;
      transform: rotate(-1deg);
      transition: transform 0.2s;
    }
    .polaroid-card:nth-child(even) { transform: rotate(1deg); }
    .polaroid-card:hover { transform: rotate(0) scale(1.02); }
    .polaroid-inner {
      position: relative;
      width: 100%;
      height: 200px;
      background: #F4EFE6;
      overflow: hidden;
    }
    .polaroid-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .brass-corner {
      position: absolute;
      width: 12px;
      height: 12px;
      border: 2px solid var(--gold);
    }
    .brass-corner.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; }
    .brass-corner.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; }
    .brass-corner.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; }
    .brass-corner.br { bottom: 0; right: 0; border-left: 0; border-top: 0; }
    .polaroid-caption {
      font-family: 'Alex Brush', cursive;
      font-size: 1.35rem;
      color: #4A3E37;
      text-align: center;
      margin-top: 10px;
    }

    /* Scrolls */
    .scroll-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }
    .scroll-item {
      background: #FFF;
      border-left: 4px solid var(--gold);
      border-radius: 4px;
      padding: 14px 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .scroll-num {
      font-weight: 700;
      color: var(--crimson);
      font-size: 0.85rem;
    }
    .scroll-text {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      color: #3B271E;
      font-size: 1.05rem;
    }

    /* Capsules */
    .capsule-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 30px;
    }
    .capsule-card {
      background: #FFF;
      border: 1px solid #E3D4B8;
      border-radius: 8px;
      padding: 18px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      transition: all 0.3s;
    }
    .capsule-card:hover { border-color: var(--crimson); }
    .capsule-front {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .wax-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--crimson);
      color: #FFF;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
    }
    .capsule-front h4 {
      flex: 1;
      font-family: 'Playfair Display', serif;
      font-size: 1.05rem;
      color: var(--walnut);
    }
    .tap-hint {
      font-size: 0.75rem;
      color: var(--gold);
      font-weight: 600;
    }
    .capsule-content {
      display: none;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px dashed #E3D4B8;
    }
    .capsule-card.revealed .capsule-content { display: block; }
    .capsule-card.revealed .tap-hint { display: none; }
    .capsule-message {
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      color: #382F2A;
      margin-bottom: 10px;
    }
    .capsule-voucher {
      background: #FAF6F0;
      border: 1px dashed var(--gold);
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
      color: var(--walnut);
      margin-top: 8px;
    }
    .capsule-photo {
      max-width: 100%;
      border-radius: 6px;
      margin-top: 10px;
    }
    .capsule-audio {
      width: 100%;
      margin-top: 10px;
    }

    footer {
      text-align: center;
      font-size: 0.8rem;
      color: #A09383;
      margin-top: 40px;
      border-top: 1px solid #E3D4B8;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="vault-banner">
      <h1>Permanent Keepsake Vault</h1>
      <p>Created by ${wishData.sender} for ${wishData.name} • Saved offline on your device</p>
    </div>

    <!-- Letter -->
    <div class="letter-card">
      <div class="wax-seal">♥</div>
      <div class="letter-title">Dearest ${wishData.name},</div>
      <div class="letter-body">${wishData.message}</div>
      <div class="letter-sig">Always, ${wishData.sender}</div>
    </div>

    ${
      memoriesHtml
        ? `
      <h3 class="section-title">Treasured Moments</h3>
      <div class="polaroid-grid">${memoriesHtml}</div>
    `
        : ""
    }

    ${
      scrollsHtml
        ? `
      <h3 class="section-title">${wishData.scrollJarTitle || "Jar of Little Scrolls"}</h3>
      <div class="scroll-list">${scrollsHtml}</div>
    `
        : ""
    }

    ${
      capsulesHtml
        ? `
      <h3 class="section-title">Open When... Time Capsules</h3>
      <div class="capsule-grid">${capsulesHtml}</div>
    `
        : ""
    }

    ${
      wishData.voiceNoteUrl
        ? `
      <h3 class="section-title">Whispered Voice Note</h3>
      <div style="background: #FFF; padding: 16px; border-radius: 8px; border: 1px solid #E3D4B8;">
        <audio controls src="${wishData.voiceNoteUrl}" style="width: 100%;"></audio>
      </div>
    `
        : ""
    }

    <footer>
      WishMaker Keepsake Vault • This file is self-contained and will open anytime, offline, on any phone or computer.
    </footer>
  </div>
</body>
</html>`;

  // Trigger file download
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `WishMaker-Vault-${safeName}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
