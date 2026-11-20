"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import WishViewer, { ErrorView, LoadingView } from "@/components/birthday/WishViewer";
import type { WishData } from "@/lib/types";

function WishContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const preview = searchParams?.get("preview") === "1";

  const [wishData, setWishData] = useState<WishData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); return; }
    fetch(`/api/wishes/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success || !data.wish) { setError(true); return; }
        setWishData(data.wish);
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) return <ErrorView />;
  if (!wishData) return <LoadingView />;
  return <WishViewer wishData={wishData} preview={preview} />;
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
