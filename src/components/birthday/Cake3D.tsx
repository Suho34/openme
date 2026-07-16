"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface Cake3DProps {
  numCandles: number;
  candlesLit: boolean[];
  onCandleClick: (index: number) => void;
}

export default function Cake3D({ numCandles, candlesLit, onCandleClick }: Cake3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keep refs of flames and lights to update them dynamically when props change
  const flamesRef = useRef<THREE.Group[]>([]);
  const lightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup — slightly closer and lower for cinematic angle
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 17);
    camera.lookAt(0, 2.2, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting — realistic studio three-point light setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambientLight);

    // Warm Key Light (mimics warm candle ambient)
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.4);
    keyLight.position.set(6, 12, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    // Cool Fill Light (dark indigo from left back)
    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.45);
    fillLight.position.set(-6, 5, -6);
    scene.add(fillLight);

    // Rim Light (platinum highlight from back)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, 8, -10);
    scene.add(rimLight);

    // 5. Build Gourmet Pedestal Stand & Cake
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Luxury Materials using MeshPhysicalMaterial for gloss, coating and metalness
    const goldPlatterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xD4AF37, // Burnished Gold
      roughness: 0.12,
      metalness: 0.95,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    const pedestalGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 1.2,
    });

    const darkGlazeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x180D07, // Gourmet Dark Chocolate
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const caramelGlazeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xBA7A42, // Warm Caramel
      roughness: 0.15,
      metalness: 0.02,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
    });

    const ivoryCreamMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFDFBF7, // Ivory buttercream
      roughness: 0.28,
      metalness: 0.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
    });

    const candleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xE5C158, // Gold Spiral
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 0.5,
    });

    // 5.1 Pedestal Stand
    // Base disk
    const standBaseGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.15, 32);
    const standBase = new THREE.Mesh(standBaseGeo, goldPlatterMaterial);
    standBase.position.y = -0.7;
    standBase.receiveShadow = true;
    cakeGroup.add(standBase);

    // Stem column
    const standStemGeo = new THREE.CylinderGeometry(0.35, 0.6, 1.2, 24);
    const standStem = new THREE.Mesh(standStemGeo, pedestalGlassMaterial);
    standStem.position.y = -0.1;
    cakeGroup.add(standStem);

    // Platter top
    const standTopGeo = new THREE.CylinderGeometry(4.8, 4.8, 0.2, 32);
    const standTop = new THREE.Mesh(standTopGeo, goldPlatterMaterial);
    standTop.position.y = 0.5;
    standTop.castShadow = true;
    standTop.receiveShadow = true;
    cakeGroup.add(standTop);

    // 5.2 Cake Tier 1 (Bottom — Dark Chocolate)
    const tier1Geo = new THREE.CylinderGeometry(4.0, 4.15, 1.6, 40);
    const tier1 = new THREE.Mesh(tier1Geo, darkGlazeMaterial);
    tier1.position.y = 1.4;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // 5.3 Cake Tier 2 (Middle — Caramel)
    const tier2Geo = new THREE.CylinderGeometry(3.0, 3.12, 1.3, 32);
    const tier2 = new THREE.Mesh(tier2Geo, caramelGlazeMaterial);
    tier2.position.y = 2.85;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // 5.4 Cake Tier 3 (Top — Ivory Cream)
    const tier3Geo = new THREE.CylinderGeometry(2.0, 2.1, 1.1, 32);
    const tier3 = new THREE.Mesh(tier3Geo, ivoryCreamMaterial);
    tier3.position.y = 4.05;
    tier3.castShadow = true;
    tier3.receiveShadow = true;
    cakeGroup.add(tier3);

    // 5.5 Piped Cream Swirls (Base border decorations — looks like real piping)
    const addSwirlRing = (count: number, radius: number, height: number, size: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Realistic piping shape (squashed sphere with point)
        const swirlGeo = new THREE.SphereGeometry(size, 8, 8);
        swirlGeo.scale(1.0, 1.3, 1.0);
        const swirl = new THREE.Mesh(swirlGeo, ivoryCreamMaterial);
        swirl.position.set(x, height, z);
        swirl.rotation.y = -angle;
        swirl.rotation.x = 0.2; // tilt outwards slightly
        swirl.castShadow = true;
        cakeGroup.add(swirl);
      }
    };

    // Piping on base of Tier 1, 2, and 3
    addSwirlRing(24, 4.05, 0.7, 0.13);
    addSwirlRing(18, 3.05, 2.25, 0.11);
    addSwirlRing(12, 2.05, 3.55, 0.09);

    // Gold Flakes on the top surface
    const flakeGeo = new THREE.DodecahedronGeometry(0.04);
    for (let i = 0; i < 20; i++) {
      const dist = Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const flake = new THREE.Mesh(flakeGeo, goldPlatterMaterial);
      flake.position.set(Math.cos(angle) * dist, 4.62, Math.sin(angle) * dist);
      flake.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      cakeGroup.add(flake);
    }

    // 5.6 Candles & Flames Setup
    const candleGroup = new THREE.Group();
    cakeGroup.add(candleGroup);

    const flames: THREE.Group[] = [];
    const lights: THREE.PointLight[] = [];
    const cRadius = 1.15; // radius of candle circle on top tier

    // Share geometries across all candles for performance and clean scoping
    const candleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.9, 12);
    const wickGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 6);
    const innerFlameGeo = new THREE.ConeGeometry(0.038, 0.18, 8);
    innerFlameGeo.translate(0, 0.09, 0);
    const outerFlameGeo = new THREE.ConeGeometry(0.065, 0.28, 8);
    outerFlameGeo.translate(0, 0.14, 0);

    const wickMaterial = new THREE.MeshBasicMaterial({ color: 0x1b1b1f });
    const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < numCandles; i++) {
      const angle = (i / numCandles) * Math.PI * 2;
      const x = Math.cos(angle) * cRadius;
      const z = Math.sin(angle) * cRadius;

      // Candle container
      const candleContainer = new THREE.Group();
      candleContainer.position.set(x, 4.6, z);
      candleContainer.name = `candle-${i}`;

      // Slim gold candle cylinder
      const candle = new THREE.Mesh(candleGeo, candleMaterial);
      candle.position.y = 0.45;
      candle.castShadow = true;
      candleContainer.add(candle);

      // Wick
      const wick = new THREE.Mesh(wickGeo, wickMaterial);
      wick.position.y = 0.94;
      candleContainer.add(wick);

      // Procedural multi-layered flame group for high realism
      const flameGroup = new THREE.Group();
      flameGroup.position.set(0, 0.98, 0);
      flameGroup.name = `flame-${i}`;
      flameGroup.visible = candlesLit[i];

      // Inner hot core (bright yellow-white)
      const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
      flameGroup.add(innerFlame);

      // Outer glowing halo (orange-red, transparent, additive blending)
      const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
      flameGroup.add(outerFlame);

      candleContainer.add(flameGroup);
      flames.push(flameGroup);

      // Realistic local warm candle light casting soft shadows
      const pointLight = new THREE.PointLight(0xffa23e, 0.9, 4, 1.2);
      pointLight.position.set(0, 1.15, 0);
      pointLight.castShadow = true;
      pointLight.shadow.bias = -0.0002;
      pointLight.shadow.mapSize.width = 256;
      pointLight.shadow.mapSize.height = 256;
      pointLight.visible = candlesLit[i];
      candleContainer.add(pointLight);
      lights.push(pointLight);

      candleGroup.add(candleContainer);
    }

    flamesRef.current = flames;
    lightsRef.current = lights;

    // 6. Interaction: Raycasting & Rotation
    let isDragging = false;
    let previousMouseX = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(candleGroup.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.parent !== candleGroup) {
          obj = obj.parent;
        }
        if (obj && obj.name.startsWith("candle-")) {
          const index = parseInt(obj.name.split("-")[1]);
          onCandleClick(index);
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      cakeGroup.rotation.y += deltaX * 0.006;
      previousMouseX = e.clientX;
    };

    const onMouseUp = () => { isDragging = false; };

    // Mobile touch controls
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isDragging = true;
      previousMouseX = e.touches[0].clientX;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(candleGroup.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.parent !== candleGroup) {
          obj = obj.parent;
        }
        if (obj && obj.name.startsWith("candle-")) {
          const index = parseInt(obj.name.split("-")[1]);
          onCandleClick(index);
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      cakeGroup.rotation.y += deltaX * 0.006;
      previousMouseX = e.touches[0].clientX;
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    // 7. Animation Loop with realistic flame flicker noise
    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Soft spin when not active dragging
      if (!isDragging) {
        cakeGroup.rotation.y += 0.0045;
      }

      // Procedural flame jitter (height, scale & position noise)
      flamesRef.current.forEach((flame, idx) => {
        if (flame.visible) {
          const freq = 18 + idx * 3;
          const noiseY = Math.sin(elapsed * freq) * 0.12;
          const noiseX = Math.cos(elapsed * (freq - 4)) * 0.03;
          const noiseZ = Math.sin(elapsed * (freq + 2)) * 0.03;

          flame.scale.set(1 + noiseX * 0.5, 1 + noiseY * 0.9, 1 + noiseZ * 0.5);
          
          // Outer flame shifts slightly for lick/flutter feel
          const outer = flame.children[1];
          if (outer) {
            outer.position.set(noiseX * 0.08, 0, noiseZ * 0.08);
          }

          // Light flicker
          const light = lightsRef.current[idx];
          if (light) {
            light.intensity = 0.9 + 0.25 * Math.sin(elapsed * 25 + idx * 8);
          }
        }
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer?.domElement) {
        renderer.domElement.removeEventListener("mousedown", onMouseDown);
        renderer.domElement.removeEventListener("touchstart", onTouchStart);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);

      cancelAnimationFrame(animationId);
      renderer?.dispose();

      standBaseGeo.dispose();
      standStemGeo.dispose();
      standTopGeo.dispose();
      tier1Geo.dispose();
      tier2Geo.dispose();
      tier3Geo.dispose();
      flakeGeo.dispose();
      candleGeo.dispose();
      wickGeo.dispose();
      innerFlameGeo.dispose();
      outerFlameGeo.dispose();

      goldPlatterMaterial.dispose();
      pedestalGlassMaterial.dispose();
      darkGlazeMaterial.dispose();
      caramelGlazeMaterial.dispose();
      ivoryCreamMaterial.dispose();
      candleMaterial.dispose();
      wickMaterial.dispose();
      innerFlameMat.dispose();
      outerFlameMat.dispose();

      if (container && renderer.domElement) {
        try { container.removeChild(renderer.domElement); } catch (_) {}
      }
    };
  }, [numCandles]);

  // Sync lighting/flame state on props change
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
    />
  );
}
