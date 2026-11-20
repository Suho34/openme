"use client";

import React from "react";
import ScrapbookAlbum from "./ScrapbookAlbum";
import type { MemoryLaneProps } from "@/lib/types";

export default function MemoryLane({
  memories,
}: MemoryLaneProps) {
  if (!memories || memories.length === 0) return null;

  return <ScrapbookAlbum memories={memories} />;
}
