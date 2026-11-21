"use client";

import React, { useState } from "react";
import { Smartphone, Download, Check, Sparkles, HelpCircle } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import IOSInstallModal from "./IOSInstallModal";

interface PWAInstallButtonProps {
  variant?: "nav" | "hero" | "card" | "banner";
  className?: string;
  alwaysShow?: boolean;
}

export default function PWAInstallButton({
  variant = "nav",
  className = "",
  alwaysShow = false,
}: PWAInstallButtonProps) {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    showIOSPrompt,
    promptInstall,
    closeIOSPrompt,
  } = usePWAInstall();

  const [fallbackNotice, setFallbackNotice] = useState(false);

  // If already installed, don't show prompt
  if (isInstalled) {
    if (variant === "card" || variant === "banner") {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#7D8B75]/15 border border-[#7D8B75]/30 text-xs font-serif text-[#3B271E]">
          <Check className="w-3.5 h-3.5 text-[#7D8B75]" />
          <span>Installed on this device</span>
        </div>
      );
    }
    return null;
  }

  // If not installable yet and not forced to show, return null
  if (!isInstallable && !alwaysShow) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      promptInstall();
    } else {
      setFallbackNotice(true);
      setTimeout(() => setFallbackNotice(false), 5000);
    }
  };

  return (
    <>
      {variant === "nav" && (
        <button
          onClick={handleClick}
          type="button"
          aria-label="Install WishMaker App"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-medium border border-[#C5A059]/70 text-[#3B271E] bg-[#FAF6F0] hover:bg-[#F4EFE6] hover:border-[#8B2635]/50 transition-all shadow-xs cursor-pointer active:scale-95 ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#8B2635]" />
          <span>Install App</span>
        </button>
      )}

      {variant === "hero" && (
        <button
          onClick={handleClick}
          type="button"
          className={`btn-gold px-6 py-3.5 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
        >
          <Download className="w-4 h-4 text-[#3B271E]" />
          <span>Install App to Home Screen</span>
        </button>
      )}

      {variant === "banner" && (
        <button
          onClick={handleClick}
          type="button"
          className={`btn-gold px-6 py-3 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
        >
          <Smartphone className="w-4 h-4 text-[#3B271E]" />
          <span>Install App (1-Tap)</span>
        </button>
      )}

      {variant === "card" && (
        <button
          onClick={handleClick}
          type="button"
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#C5A059] bg-[#FAF6F0] text-xs font-serif font-semibold text-[#3B271E] hover:bg-[#F4EFE6] transition-all cursor-pointer shadow-xs active:scale-[0.99] ${className}`}
        >
          <Smartphone className="w-4 h-4 text-[#8B2635]" />
          <span>Install WishMaker App</span>
        </button>
      )}

      {fallbackNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#2A231F] text-[#FAF6F0] text-xs font-serif shadow-lg border border-[#C5A059]/40 max-w-sm text-center animate-fade-in">
          To install, open your browser menu (⋮ or Share) and select{" "}
          <strong>&ldquo;Install App&rdquo;</strong> or{" "}
          <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
        </div>
      )}

      {/* iOS Safari Instruction Modal */}
      <IOSInstallModal isOpen={showIOSPrompt} onClose={closeIOSPrompt} />
    </>
  );
}
