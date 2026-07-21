"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { createScene, addLighting, handleResize } from "./cake/setup";
import { createMaterials } from "./cake/materials";
import { buildTable, buildPlate, buildBottomTier, buildTopTier, buildCandles, buildSprinkles, buildParticles } from "./cake/builders";
import { setupInteraction } from "./cake/interaction";
import { runAnimationLoop } from "./cake/animation";

interface Cake3DProps {
  numCandles: number;
  candlesLit: boolean[];
  onCandleClick: (index: number) => void;
}

export default function Cake3D({ numCandles, candlesLit, onCandleClick }: Cake3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flamesRef = useRef<THREE.Group[]>([]);
  const lightsRef = useRef<THREE.PointLight[]>([]);
  const materialsRef = useRef<ReturnType<typeof createMaterials> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scene, camera, renderer, rootGroup } = createScene(container);
    addLighting(rootGroup);
    const materials = createMaterials();
    materialsRef.current = materials;

    buildTable(rootGroup, materials.wood);
    buildPlate(rootGroup, materials.plate);
    buildBottomTier(rootGroup, materials);
    const topTierGroup = buildTopTier(rootGroup, materials);

    const { candlesGroup, candleData, flames, lights } = buildCandles(rootGroup, topTierGroup, numCandles, materials);
    flamesRef.current = flames;
    lightsRef.current = lights;

    flames.forEach((f, i) => f.visible = candlesLit[i] ?? true);
    lights.forEach((l, i) => l.visible = candlesLit[i] ?? true);

    buildSprinkles(rootGroup);
    const particleData = buildParticles(rootGroup);

    const interaction = setupInteraction(renderer, camera, rootGroup, candlesGroup, onCandleClick);
    const cleanupAnimation = runAnimationLoop(scene, camera, renderer, rootGroup, candleData, particleData, flamesRef, materials, interaction);

    const onResize = () => {
      if (!container) return;
      handleResize(container, camera, renderer);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      interaction.cleanup();
      cleanupAnimation();
      renderer.dispose();
      if (container && renderer.domElement) {
        try { container.removeChild(renderer.domElement); } catch (_) {}
      }
    };
  }, [numCandles]);

  useEffect(() => {
    candlesLit.forEach((lit, index) => {
      if (flamesRef.current[index]) flamesRef.current[index].visible = lit;
      if (lightsRef.current[index]) lightsRef.current[index].visible = lit;
    });
  }, [candlesLit]);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 sm:h-96 relative cursor-grab active:cursor-grabbing z-10"
      style={{ overflow: "hidden" }}
    />
  );
}
