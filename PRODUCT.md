# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two distinct audiences, split by surface:

- **The gift-maker** (landing + `/create`): someone making a personalized birthday surprise for a friend, partner, or family member. Their job is to gather photos, write a message (optionally AI-assisted), pick a theme, and produce a shareable link — with no account and minimal effort.
- **The recipient** (the `/wish` experience): the person whose birthday it is. Their job is to be moved and delighted — opening the gift, blowing out candles, reading the letter, and reliving shared memories. The experience must feel personal, immersive, and surprising, and it must work on the phone where they first tap the link.

## Product Purpose

WishMaker turns a birthday wish into an immersive, multi-chapter keepsake — a wax-sealed envelope, a procedural birthday melody, a 3D cake with microphone candle-blowing, shared-photo memories, and a grand fireworks finale — all packed into a single URL. Success is the recipient feeling that this birthday was more than a message, and the gift-maker feeling their effort was effortless to create.

## Positioning

Every birthday deserves more than a message. Where a typical e-card is a static greeting, WishMaker ships an interactive, chronological storytelling experience — procedural audio, a mic-interactive 3D cake, secret memory layers, and themed rituals — inside one link, with zero accounts and zero data stored. The "single magical link with nothing to install and nothing stored" claim is the mechanism competitors cannot truthfully copy.

## Operating Context

- Links are shared via WhatsApp, text, or email — so the recipient experience is phone-first and must not require signup or app install.
- Delivery is often not immediate: a scheduled surprise shows a countdown lock until the birthday (`deliveryLock`).
- Gift-makers complete a multi-step wizard (photos, letter, theme, timeline, trivia, delivery) and may use the live demo link from the landing page to preview the recipient experience.
- Themes (`starry`, `neon`, `romance`, `pastel`, `retro`) and ambience (`fire`, `rain`, `ocean`) change the recipient surface's palette and audio character; Gemini recommends a theme from letter content.

## Capabilities and Constraints

- **Recipient experience**: wax-seal envelope open, countdown lock, 3D cake + mic candle-blow, procedural Happy Birthday jingle, memory-lane polaroids, timeline, trivia game, balloon game, hand-sketched doodles, constellation wish ritual, fireworks finale, optional voice note.
- **Creator experience**: multi-step `/create` wizard; AI letter drafts (Poetic / Sincere / Funny) with a Playful→Formal tone slider via Gemini; smart theme recommendation from letter content; client-side photo upload, resize (≤220px) and JPEG compression to data URLs.
- **Privacy model**: zero cookies, zero database logs for the surprise itself; configuration is serialized, gzip-compressed, encrypted, and embedded in the Base64 URL parameter. A separate `/api/wishes` + MongoDB path persists wishes (currently the embedded-URL flow is the primary consumer).
- **Tech stack**: Next.js 16 (Turbopack), React 19, Tailwind CSS v4, shadcn/Base UI, Framer Motion, Three.js, canvas-confetti, lucide-react, Gemini API, TinyURL shortener (`/api/shorten`), Mongoose/MongoDB.
- **Undecided**: none recorded during init; product facts above come from code and README and were confirmed in interview.

## Brand Commitments

- Name: **WishMaker.** (with the dot in the wordmark).
- Voice: warm, intimate, romantic but not saccharine; copy promises "Made with love" and "Every birthday deserves more than a message."
- Assets on hand: `public/hero_main.png` (friends celebrating, golden-hour); inline demo link parameters in `src/app/page.tsx`.

## Evidence on Hand

- Full landing, create, and wish implementations under `src/` (see Capabilities) with a working demo link on the landing page.
- `README.md` documenting the eight "chapters" of the birthday surprise.
- No testimonials, real customer names, pricing, or deployment claims exist and must not be fabricated.

## Product Principles

1. **Personal is the product.** Every feature exists to make one specific person feel seen; nothing generic, no mass-greeting vibes.
2. **Zero-friction magic.** The gift-maker creates without an account and the recipient opens without installing anything — the link is the whole product.
3. **Surprise is sequenced.** The recipient's journey is a choreographed reveal (open → blow → wish → memories → finale), never a wall of content.
4. **Privacy as a feature, not a footnote.** Client-side encryption and zero storage are core promises, not afterthoughts.
5. **Craft over volume.** Fewer, exquisitely finished moments beat many half-finished ones.
