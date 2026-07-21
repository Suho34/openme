"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WishViewer, { ErrorView, LoadingView } from "@/components/birthday/WishViewer";
import type { WishData } from "@/lib/types";

function parseLegacyWishData(raw: Record<string, unknown>): WishData {
  return {
    name: raw.n as string || "",
    age: raw.a as number | undefined,
    sender: raw.s as string || "",
    message: raw.m as string || "",
    theme: raw.t as string || "starry",
    memories: raw.mm as WishData["memories"],
    deliveryLock: raw.dl as number | undefined,
    timeline: raw.tl as WishData["timeline"],
    doodleType: raw.dt as WishData["doodleType"],
    ambience: raw.am as WishData["ambience"],
    demo: true,
  };
}

function WishContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams?.get("d");

  const [wishData, setWishData] = useState<WishData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!dataParam) { setError(true); return; }
    try {
      const decoded = decodeURIComponent(
        atob(dataParam).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
      );
      const parsed = JSON.parse(decoded);
      if (!parsed.n || !parsed.s || !parsed.m) { setError(true); return; }
      setWishData(parseLegacyWishData(parsed));
    } catch { setError(true); }
  }, [dataParam]);

  if (error) return <ErrorView />;
  if (!wishData) return <LoadingView />;
  return <WishViewer wishData={wishData} />;
}

export default function WishPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <Suspense fallback={null}>
        <WishContent />
      </Suspense>
    </Suspense>
  );
}
