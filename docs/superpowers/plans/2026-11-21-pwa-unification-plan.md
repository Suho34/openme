# WishMaker PWA Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the mobile and web experience into a single Progressive Web App (PWA) with zero discrepancy, 1-tap mobile installation, offline caching, and elimination of the divergent APK code.

**Architecture:** Next.js 16 App Router application configured as an installable standalone Progressive Web App. A custom `usePWAInstall` hook captures the native `beforeinstallprompt` event and provides a 1-tap install experience on Android and guided prompt on iOS. A lightweight service worker handles caching of fonts, icons, tunes, and stationery styling. Capacitor static duplication (`out/`) is removed.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Web App Manifest, Service Worker API, Web Vibration API, Canvas Confetti, Three.js.

---

## Global Constraints
- Single codebase only: No separate HTML files or secondary mockups.
- What works on the desktop web must work identically when installed on mobile.
- Zero "unknown sources" security warnings: Install must use browser-native PWA installation.
- Preserves the Candlelight & Linen palette (`#FAF6F0`, `#F4EFE6`, `#8B2635`, `#C5A059`, `#3B271E`).
- Uses existing 3D crimson wax seal icons (`/icon-192.png`, `/icon-512.png`, `/wm-logo.svg`).

## Review Focus
1. **PWA Install Prompt Timing**: The install button must not appear if the app is already installed in standalone mode (`display-mode: standalone`).
2. **iOS Safari Compatibility**: iOS does not support `beforeinstallprompt`; an elegant instructional sheet ("Tap Share &rarr; Add to Home Screen") must be shown for iOS users.
3. **Offline / Network Resilience**: If mobile connectivity drops, the app shell and previously cached/saved keepsakes must remain accessible.
4. **Safe Area Insets**: Notch and home indicator safe areas (`viewport-fit=cover`) must prevent header clipping in standalone mode.
5. **No Broken Links**: All legacy `/wishmaker.apk` links and download CTAs must be replaced with the native install trigger.

---

## Task Structure

### Task 1: Clean Up Capacitor Divergence & Remove Stale APK Assets
**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/birthday/RecapCard.tsx`
- Modify: `next.config.ts`
- Delete: `out/` (the divergent separate HTML build)
- Delete: `public/wishmaker.apk`

**Steps:**
- [ ] In `src/app/page.tsx`, replace the `<a href="/wishmaker.apk">` button with the new PWA install action.
- [ ] In `src/components/birthday/RecapCard.tsx`, replace the `Download WishMaker App (Android APK)` CTA with `Install WishMaker on Your Phone`.
- [ ] In `next.config.ts`, remove the `.apk` download custom headers.
- [ ] Remove `public/wishmaker.apk` and the `out/` directory to prevent codebase divergence.
- [ ] Verify `npm run build` succeeds without errors.

### Task 2: Service Worker & Offline Caching Layer
**Files:**
- Create: `public/sw.js`
- Create: `src/components/pwa/ServiceWorkerRegister.tsx`
- Modify: `src/app/layout.tsx`

**Steps:**
- [ ] Create `public/sw.js` with Stale-While-Revalidate caching for static assets (fonts, audio, icons, CSS).
- [ ] Implement cache versioning (`wishmaker-v1`) with automatic cleanup of old caches on activate.
- [ ] Create `src/components/pwa/ServiceWorkerRegister.tsx` client component that registers `/sw.js` in production or on supported browsers.
- [ ] Mount `<ServiceWorkerRegister />` in `src/app/layout.tsx`.
- [ ] Verify service worker registers successfully in browser devtools.

### Task 3: PWA Install Hook & Platform Detection
**Files:**
- Create: `src/hooks/usePWAInstall.ts`

**Steps:**
- [ ] Implement `usePWAInstall` hook:
  - Listens for `beforeinstallprompt` event and stashes it.
  - Detects if already running in standalone mode (`window.matchMedia('(display-mode: standalone)').matches`).
  - Detects iOS / iPadOS Safari users.
  - Exposes `isInstallable`, `isInstalled`, `isIOS`, and `promptInstall()`.
- [ ] Verify hook behavior on both desktop and mobile user agents.

### Task 4: UI Install Prompts (Nav Pill, Hero CTA, and iOS Sheet)
**Files:**
- Create: `src/components/pwa/PWAInstallButton.tsx`
- Create: `src/components/pwa/IOSInstallModal.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/birthday/RecapCard.tsx`

**Steps:**
- [ ] Create `PWAInstallButton.tsx`:
  - When clicked on Android/Desktop: triggers native browser install sheet with wax seal icon.
  - When clicked on iOS: opens `IOSInstallModal.tsx` showing the 2-step visual instructions.
  - Automatically hidden if already installed.
- [ ] Add `PWAInstallButton` to the sticky navigation header on landing page and finale card.
- [ ] Add an elegant "Install App on Phone" card on the landing page hero.

### Task 5: Mobile Viewport, Theme Color, and Web Vibration Haptics
**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/capacitor.ts` &rarr; adapt to fallback to Web Vibration API (`navigator.vibrate`)
- Modify: `src/app/globals.css`

**Steps:**
- [ ] In `src/app/layout.tsx`, ensure viewport has `viewport-fit=cover` and themeColor `#8B2635`.
- [ ] Add apple-mobile-web-app metadata (`capable: true`, `statusBarStyle: 'default'`, `title: 'WishMaker'`).
- [ ] In `src/app/globals.css`, add safe-area inset padding support for standalone PWA headers.
- [ ] Update `src/lib/capacitor.ts` or create `src/lib/haptics.ts` using `navigator.vibrate([20])` so candle blowing and wax breaking provide real tactile feedback on Android phones without Capacitor.

### Task 6: Verification & Final Build
**Files:**
- Test all pages: `/`, `/create`, `/wish`, `/wish?demo=true`
- Test PWA manifest validity: `http://localhost:3000/manifest.webmanifest`
- Test service worker status

**Steps:**
- [ ] Run `npx tsc --noEmit` to verify type safety.
- [ ] Run `npm run build` to confirm production build cleanliness.
- [ ] Test the PWA installation flow in browser and mobile view.
- [ ] Confirm that what appears in browser is 100% identical to the installed PWA.
