import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import toast from "react-hot-toast";

export const isNativeApp = () => Capacitor.isNativePlatform();

/**
 * Share a generated surprise link using native Android share drawer or Web Share API
 */
export async function shareSurpriseLink(options: {
  title: string;
  text: string;
  url: string;
}): Promise<boolean> {
  const { title, text, url } = options;

  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: "Send Birthday Surprise via...",
      });
      return true;
    } catch {
      return false;
    }
  }

  // Web fallback: navigator.share
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      // User cancelled or error
    }
  }

  // Final fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Surprise link copied to clipboard!");
    return true;
  } catch {
    toast.error("Could not copy link.");
    return false;
  }
}

/**
 * Trigger subtle mechanical haptic feedback (wax cracking, candle blow, button taps)
 */
export async function triggerHaptic(
  type: "light" | "medium" | "heavy" = "light",
) {
  if (Capacitor.isNativePlatform()) {
    try {
      const style =
        type === "heavy"
          ? ImpactStyle.Heavy
          : type === "medium"
            ? ImpactStyle.Medium
            : ImpactStyle.Light;
      await Haptics.impact({ style });
      return;
    } catch {}
  }

  // Web Vibration API fallback
  if (typeof window !== "undefined" && navigator.vibrate) {
    const ms = type === "heavy" ? 50 : type === "medium" ? 30 : 15;
    navigator.vibrate(ms);
  }
}
