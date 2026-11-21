/**
 * Tactile Web Vibration Haptic Feedback
 * Safe for all platforms: gracefully falls back if navigator.vibrate is unsupported.
 */

export type HapticType =
  | "light"      // Subtle tap (UI buttons, step changes)
  | "medium"     // Noticeable tap (toggling items, selecting options)
  | "candle"     // Extinguishing a candle flame
  | "wax"        // Breaking the crimson wax seal
  | "celebrate"; // Grand finale fireworks

export function triggerHaptic(type: HapticType = "light") {
  if (typeof window === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  try {
    switch (type) {
      case "light":
        navigator.vibrate(15);
        break;
      case "medium":
        navigator.vibrate(25);
        break;
      case "candle":
        navigator.vibrate([18, 30, 22]);
        break;
      case "wax":
        navigator.vibrate([35, 25, 45]);
        break;
      case "celebrate":
        navigator.vibrate([40, 30, 50, 40, 80]);
        break;
    }
  } catch {
    // Gracefully handle browser permission constraints
  }
}
