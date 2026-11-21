"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WishViewer, { ErrorView, LoadingView } from "@/components/birthday/WishViewer";
import type { WishData } from "@/lib/types";

interface WishClientProps {
  id: string;
  initialWish?: WishData | null;
  /** Present only for the sender's own preview link. */
  previewKey?: string;
}

export default function WishClient({ id, initialWish, previewKey }: WishClientProps) {
  const [wishData, setWishData] = useState<WishData | null>(initialWish || null);
  const [error, setError] = useState(false);
  const openReported = useRef(false);

  const loadWish = useCallback(async () => {
    if (!id) {
      setError(true);
      return;
    }

    try {
      const res = await fetch(`/api/wishes/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!data.success || !data.wish) {
        setError(true);
        return;
      }
      setWishData(data.wish);
    } catch {
      setError(true);
    }
  }, [id]);

  useEffect(() => {
    if (initialWish || !id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/wishes/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (!data.success || !data.wish) {
          setError(true);
          return;
        }
        setWishData(data.wish);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, initialWish]);

  // Tell the sender their keepsake was opened — once per page view, never while
  // locked, and never for the sender's own preview.
  useEffect(() => {
    if (!wishData || wishData.locked || !id || openReported.current) return;
    openReported.current = true;
    const query = previewKey ? `?k=${encodeURIComponent(previewKey)}` : "";
    void fetch(`/api/wishes/${id}/open${query}`, { method: "POST" }).catch(() => {});
  }, [id, wishData, previewKey]);

  if (error || !id) return <ErrorView />;
  if (!wishData) return <LoadingView />;

  return <WishViewer wishData={wishData} wishId={id} onUnlockRequest={loadWish} />;
}
