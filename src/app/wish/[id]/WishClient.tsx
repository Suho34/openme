"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WishViewer, { ErrorView, LoadingView } from "@/components/birthday/WishViewer";
import type { WishData } from "@/lib/types";

interface WishClientProps {
  id: string;
  initialWish?: WishData | null;
}

export default function WishClient({ id, initialWish }: WishClientProps) {
  const searchParams = useSearchParams();
  const preview = searchParams?.get("preview") === "1";

  const [wishData, setWishData] = useState<WishData | null>(initialWish || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialWish) return;
    if (!id) {
      setError(true);
      return;
    }
    fetch(`/api/wishes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.wish) {
          setError(true);
          return;
        }
        setWishData(data.wish);
      })
      .catch(() => setError(true));
  }, [id, initialWish]);

  if (error) return <ErrorView />;
  if (!wishData) return <LoadingView />;
  return <WishViewer wishData={wishData} preview={preview} />;
}
