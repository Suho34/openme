# WishMaker 2.0 — "Candlelight & Linen" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform WishMaker into an emotionally immersive, phone-first romantic keepsake app (web + Android APK via Capacitor) using the "Candlelight & Linen" design system, photorealistic handwritten letter, physically-based 3D birthday cake with dual extinguish mechanics (blow & tap), and long-distance intimacy features.

**Architecture:** Next.js 16 (App Router) + React 19 + Three.js PBR + Tailwind CSS v4 + Web Audio API + Capacitor Android. Surprise payloads remain zero-friction encrypted URL parameters, with optional MongoDB persistence and Capacitor wrapping the creator studio into an installable Android APK.

**Tech Stack:** Next.js 16.2.10, React 19, Three.js 0.185, Framer Motion 12, Tailwind CSS 4, `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/share`, `@capacitor/haptics`.

**Spec:** [WishMaker_2.0_Mobile_Design_Doc.md](file:///C:/Users/suhai/.gemini/antigravity/brain/f2d5fb17-5cb8-4663-b98f-8f0f3614d6ad/WishMaker_2.0_Mobile_Design_Doc.md) & [Candlelight_and_Linen_Design_System.md](file:///C:/Users/suhai/.gemini/antigravity/brain/f2d5fb17-5cb8-4663-b98f-8f0f3614d6ad/Candlelight_and_Linen_Design_System.md)

## Global Constraints

- **Phone-First Viewport**: All recipient views must fit within `100dvh` on portrait screens (360px–430px wide) without horizontal scroll or clipping.
- **Fixed Color Tokens**:
  - Warm Linen Cream: `#FAF6F0`
  - Parchment Paper: `#F4EFE6`
  - Crimson Wax Accent: `#8B2635`
  - Antique Brass Gold: `#C5A059`
  - Aged Walnut Wood: `#3B271E`
  - Sepia Calligraphy Ink: `#2A231F`
- **Zero-Friction Recipient Model**: The recipient must NEVER be asked to log in, install an app, or accept cookies to see their wish.
- **Dual Extinguish Mechanics**: 3D cake must support BOTH microphone air-blowing and direct touch/point at the candle flames.

## Review Focus

1. **Microphone permission denial**: If the recipient denies mic access, the UI must gracefully pulse the flames to indicate "Tap any flame to make a wish" with zero error popups.
2. **Narrow mobile screen wrapping**: On 360px wide screens, the letter text and 3D cake must not overflow horizontally or clip.
3. **Audio autoplay restrictions**: Mobile browsers block unprompted audio; background music must start smoothly upon the first user interaction (cracking the wax seal).
4. **Heavy letter text lengths**: If a sender writes a 500-word letter, the parchment must scroll smoothly inside the envelope view without breaking the layout.
5. **Capacitor native vs web fallback**: All native Capacitor calls (`Share`, `Haptics`) must safely check `Capacitor.isNativePlatform()` and fallback to Web APIs without throwing.

---

### Task 1: "Candlelight & Linen" Design Tokens & Calligraphy Typography

**Files:**
- Modify: `src/app/globals.css:1-120`
- Modify: `src/app/layout.tsx:1-40`

**Interfaces:**
- Produces: CSS variables `--color-linen-base`, `--color-parchment`, `--color-crimson-wax`, `--color-brass-gold`, `--color-walnut-wood`, `--color-sepia-ink`.
- Produces: Calligraphy font class `font-handwriting` utilizing Google Font `Homemade Apple` / `Alex Brush`.

- [ ] **Step 1: Update font imports in `layout.tsx`**
  Add Google font `Alex_Brush` (or `Homemade_Apple`) with variable `--font-handwriting`.
- [ ] **Step 2: Add color tokens and paper texture utility in `globals.css`**
  Register the fixed hex codes, add `.paper-deckle` styling with fractal noise background, and add ink bleed text-shadow utility.
- [ ] **Step 3: Verify build and token availability**
  Run: `npm run build`
  Expected: Compiled successfully with zero type or CSS errors.

---

### Task 2: Emotional Pacing — Replace Progress Bar with Poetic Chapters

**Files:**
- Modify: `src/components/birthday/WishViewer.tsx:31-135`
- Create: `src/components/birthday/ChapterHeader.tsx`
- Remove / Deprecate: `src/components/ui/StepProgressBar.tsx` for recipient flow

**Interfaces:**
- Produces: `<ChapterHeader title="Chapter I: The Unspoken Words" subtitle="Open the wax seal" />`
- Consumes: `stage: Stage` from `WishViewer`

- [ ] **Step 1: Create `ChapterHeader.tsx`**
  Renders a quiet, delicate fading header with antique brass line accents and Cormorant Garamond typography.
- [ ] **Step 2: Refactor stage sequence in `WishViewer.tsx`**
  Reorder stages for emotional intimacy: `Envelope (Seal & Letter) -> 3D Cake & Candle Wish -> Whispered Voice Note -> Memory Scrapbook -> Finale`. Make Trivia and Balloons strictly opt-in extras rather than forced stages.
- [ ] **Step 3: Verify chapter transitions on mobile**
  Run dev server and test URL in browser to confirm smooth fade between chapters.

---

### Task 3: The Photorealistic Deckle-Edge Handwritten Letter

**Files:**
- Modify: `src/components/birthday/GiftBoxSurprise.tsx`
- Create: `src/components/birthday/HandwrittenLetter.tsx`
- Add: `public/lavender_sprig.png` (or high-res SVG botanical asset)

**Interfaces:**
- Consumes: `sender: string`, `name: string`, `message: string`, `distanceMiles?: number`
- Produces: Interactive tactile letter with authentic wax cracking sound and realistic paper unfolding physics.

- [ ] **Step 1: Create `HandwrittenLetter.tsx`**
  Features textured cotton paper (`#F4EFE6`), deckle-edge ragged border mask, realistic paper fold shadow gradients, and cursive fountain pen script in sepia ink (`#2A231F`).
- [ ] **Step 2: Add Long-Distance Connection Badge**
  At the top of the letter, render an elegant vintage stamp / postmark: *"Sent across the miles • Sealed with love"*.
- [ ] **Step 3: Update `GiftBoxSurprise.tsx` to host the realistic wax seal**
  Render an embossed crimson wax seal with heart stamp, add haptic vibration on click (`navigator.vibrate?.([30, 20, 50])`), and animate paper unfolding.
- [ ] **Step 4: Verify letter readability on mobile**
  Test with both short (2 sentences) and long (300 words) letters to verify smooth internal scrolling.

---

### Task 4: Photorealistic 3D Bakery Cake & Dual Extinguish Mechanics

**Files:**
- Modify: `src/components/birthday/cake/materials.ts`
- Modify: `src/components/birthday/cake/setup.ts`
- Modify: `src/components/birthday/cake/builders.ts`
- Modify: `src/components/birthday/cake/interaction.ts`
- Modify: `src/components/birthday/cake/animation.ts`
- Modify: `src/components/birthday/Cake3D.tsx`
- Modify: `src/components/birthday/BirthdayCake.tsx`

**Interfaces:**
- Consumes: `onCandleExtinguish: (index: number) => void`, `allExtinguished: () => void`
- Produces: 3D bakery cake matching the "Candlelight & Linen" mockup (scalloped porcelain plate, walnut wood table, ruffled buttercream, point-light flames, smoke physics).

- [ ] **Step 1: Upgrade materials to PBR `MeshPhysicalMaterial` in `materials.ts`**
  - Frosting: `MeshPhysicalMaterial({ color: "#FFF8F0", roughness: 0.55, sheen: 0.85, sheenColor: "#FFECD1" })`.
  - Berries: `MeshPhysicalMaterial({ color: "#2B193D", roughness: 0.2, clearcoat: 0.6 })`.
  - Plate: Scalloped vintage porcelain with antique brass rim (`#C5A059`, metalness 0.8).
  - Table: Warm dark walnut wood (`#3B271E`).
- [ ] **Step 2: Add dynamic point lighting and responsive mobile camera in `setup.ts`**
  - Calculate `camera.fov = window.innerWidth < 640 ? 54 : 40;` to ensure full cake visibility on mobile.
  - Position 5 warm PointLights (`#FFB040`) at candle wicks with `castShadow = true`.
- [ ] **Step 3: Implement Dual Extinguish Mechanics in `interaction.ts` & `Cake3D.tsx`**
  - Raycaster clicks/taps directly on flame meshes extinguish that flame.
  - Low-frequency mic blowing extinguishes flames sequentially.
  - Each extinguished candle spawns a rising curl-noise smoke ribbon.
- [ ] **Step 4: Verify cake rendering and flame taps**
  Verify on desktop and simulated mobile touch screen: tapping a flame immediately puts it out with smoke and haptics.

---

### Task 5: Long-Distance Emotional Touch — Whispered Voice Memo

**Files:**
- Create: `src/components/birthday/VoiceMemoPlayer.tsx`
- Modify: `src/components/create/VoiceRecorder.tsx`
- Modify: `src/types/index.ts` & `src/lib/types.ts`

**Interfaces:**
- Consumes: `voiceNoteUrl?: string`
- Produces: Vintage linen-textured audio player pill with play/pause wave animation and timestamp.

- [ ] **Step 1: Create `VoiceMemoPlayer.tsx`**
  A tactile, linen-wrapped audio widget: *"A personal voice message for you"*, displaying an organic sound wave visualization and playback scrubber.
- [ ] **Step 2: Hook audio into `WishViewer.tsx`**
  When present, showcase the voice note immediately after the cake candles are blown out, creating an intimate, tear-inducing moment of hearing their loved one's voice.
- [ ] **Step 3: Verify audio playback on iOS/Android Safari & Chrome**
  Ensure audio plays cleanly upon tap with zero latency.

---

### Task 6: Tactile Linen & Brass Photo Scrapbook

**Files:**
- Modify: `src/components/birthday/MemoryLane.tsx`
- Create: `src/components/birthday/ScrapbookAlbum.tsx`
- Deprecate: Scratch canvas in `DevelopingPolaroid.tsx`

**Interfaces:**
- Consumes: `memories: Memory[]`
- Produces: Turnable/swipeable photo album on linen background with brass photo corners and handwritten captions.

- [ ] **Step 1: Build `ScrapbookAlbum.tsx`**
  Display polaroids mounted with aged brass corners (`#C5A059`), deckle-edge paper, washi tape, and cursive sepia captions.
- [ ] **Step 2: Mobile Swipe & Tap Navigation**
  Enable smooth touch swipes (or tap to turn next memory), with realistic page-curl animation.
- [ ] **Step 3: Verify memory transitions on mobile viewports**
  Confirm photos scale cleanly and captions are legible without scrolling.

---

### Task 7: Capacitor Android Packaging & Viral Download CTA

**Files:**
- Create: `capacitor.config.ts`
- Create: `src/lib/capacitor.ts`
- Modify: `src/components/birthday/RecapCard.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: Capacitor configuration for Android app ID `com.wishmaker.app`.
- Produces: Native Android Share Sheet wrapper for WhatsApp sharing.
- Produces: *"Download WishMaker App (APK)"* button on the finale card.

- [ ] **Step 1: Install and configure Capacitor**
  Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/share`, `@capacitor/haptics`.
  Create `capacitor.config.ts`.
- [ ] **Step 2: Add safe native wrappers in `src/lib/capacitor.ts`**
  Implement `shareWishLink(url: string, title: string)` with fallback to `navigator.share` / clipboard.
- [ ] **Step 3: Update `RecapCard.tsx` with the Viral APK Download Button**
  Add a prominent button:  
  `[ Download WishMaker for Android (.apk) ]` linking to `/wishmaker.apk`.
- [ ] **Step 4: Verify web build succeeds with Capacitor installed**
  Run: `npm run build`
  Expected: Clean build with zero missing module errors.
