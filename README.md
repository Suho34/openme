# WishMaker. 🕯️✨

An intimate, cozy digital keepsake builder for creating bespoke birthday surprises. Build a beautiful, personalized, multi-stage storytelling page for someone special — packed entirely inside a sharing link with zero database logs.

---

## 📖 The Birthday Surprise Chapters

WishMaker transforms digital birthday cards into a chronological storytelling wizard:

1. **Chapter I: The Wax Seal Envelope**  
   The recipient receives a premium dark linen envelope locked with a crimson wax seal. If scheduled, a ticking countdown keeps it locked until their birthday. Tapping the seal cracks it open.
2. **Chapter II: The Heartfelt Letterpress Card**  
   Slides out a parchment letter rendered in classical serif typography containing your personalized message.
3. **Chapter III: Procedural Audio Melody**  
   The iconic *Happy Birthday to You* song synthesizes procedurally in their browser. Musical timbres (from romantic sine waves to vintage square waves) morph to match the visual theme.
4. **Chapter IV: The 3D Cake & Mic Blow**  
   A gourmet multi-tiered cake on a gold pedestal stand. The recipient blows into their microphone to blow out the candles, accompanied by physics-based smoke particles.
5. **Chapter V: The Constellation Sky**  
   The recipient types a birthday wish which ascends into the cosmos. Hovering over coordinate star nodes reveals secret micro-memories.
6. **Chapter VI: Our Timeline Milestones**  
   A chronological vertical tracker detailing key dates, titles, and stories of your friendship.
7. **Chapter VII: Shared Photos Scrapbook**  
   A polaroid scrapbook masonry grid displaying uploaded pictures.
8. **Chapter VIII: Grand Fireworks Finale**  
   A continuous night sky fireworks show overlayed with glowing birthday wishes and custom share links.

---

## 🛠️ Tech Stack & Key Features

* **Framework**: [Next.js 16](https://nextjs.org/) (built using Turbopack compiler)
* **Styling**: Tailwind CSS & Glassmorphism design tokens
* **AI Assistance**: Gemini API integration powering:
  * **AI Letter Writer**: Composes Poetic, Sincere, or Funny drafts.
  * **Tone Slider**: Smoothly adjust tone from Playful to Formal.
  * **Smart Theme Recommendation**: Automatically reads letter content to recommend a matching color palette.
* **Pure Client-Side Photo Uploads**: Resizes selected pictures to a maximum of 220px on a HTML5 canvas and compresses them as lightweight `image/jpeg` data URLs.
* **Serverless URL Shortener**: Integrated `/api/shorten` API route calling TinyURL to compress extremely long base64 link hashes for easy copy-pasting.

---

## 🚀 Getting Started

### 1. Prerequisites
Create a `.env.local` file in the root directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the refined cozy romantic landing page.

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Zero Database Privacy
WishMaker collects **zero cookies** and requires **no database storage**. The entire surprise configuration is serialized, gzip-compressed, and encrypted inside the Base64 URL parameter. Private keepsakes remain yours.
