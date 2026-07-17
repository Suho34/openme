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
  
  // Refs to update visibility dynamically
  const flamesRef = useRef<THREE.Group[]>([]);
  const lightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE, RENDERER, CAMERA
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.3, 25);
    camera.position.set(3.8, 1.9, 5.2);
    camera.lookAt(0, 0.7, 0);

    // A root group to hold everything so we can drag and rotate it
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight('#fdf5ec', 0.6);
    rootGroup.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight('#ffe8d6', '#3a1f1f', 0.5);
    rootGroup.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.8);
    keyLight.position.set(6, 8, 2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.02;
    rootGroup.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#ffd5c2', 1.4);
    rimLight.position.set(-3, 2, -4);
    rootGroup.add(rimLight);

    // MATERIALS
    const frostingMaterial = new THREE.MeshStandardMaterial({
        color: '#fef7f0',
        roughness: 0.5,
        metalness: 0.01,
        name: 'frosting',
    });
    const frostingHighlightMaterial = new THREE.MeshStandardMaterial({
        color: '#fffdfa',
        roughness: 0.38,
        metalness: 0.02,
        name: 'frostingHighlight',
    });
    const cakeSpongeMaterial = new THREE.MeshStandardMaterial({
        color: '#c8946b',
        roughness: 0.75,
        metalness: 0,
        name: 'cakeSponge',
    });
    const plateMaterial = new THREE.MeshStandardMaterial({
        color: '#fafaf8',
        roughness: 0.22,
        metalness: 0.06,
        name: 'porcelain',
    });
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: '#4a2c1b',
        roughness: 0.65,
        metalness: 0.03,
        name: 'wood',
    });
    const candleMaterial = new THREE.MeshStandardMaterial({
        color: '#fffefc',
        roughness: 0.28,
        metalness: 0.02,
        name: 'candle',
    });
    const candleStripeMaterial = new THREE.MeshStandardMaterial({
        color: '#f4e4d4',
        roughness: 0.3,
        metalness: 0.01,
        name: 'candleStripe',
    });
    const wickMaterial = new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.9,
        metalness: 0,
        name: 'wick',
    });
    const flameMaterial = new THREE.MeshStandardMaterial({
        color: '#ff9930',
        roughness: 0.25,
        metalness: 0,
        emissive: '#ff5e00',
        emissiveIntensity: 2.5,
        name: 'flame',
    });
    const flameTipMaterial = new THREE.MeshStandardMaterial({
        color: '#ffcc44',
        roughness: 0.2,
        metalness: 0,
        emissive: '#ffaa00',
        emissiveIntensity: 1.8,
        name: 'flameTip',
    });

    const sprinkleColors = [
        '#ff5e7a', '#ff4081', '#ff6e9f',
        '#4dc9f6', '#38b6ff', '#5ddbff',
        '#ffe066', '#ffd740', '#ffc107',
        '#7ce08b', '#4caf50', '#69f0ae',
        '#ff8a65', '#ff7043',
        '#ce93d8', '#ba68c8',
        '#ffffff', '#fafafa',
    ];

    // TABLE
    const tableGroup = new THREE.Group();
    rootGroup.add(tableGroup);

    const tableTop = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 2.7, 0.22, 64),
        tableMaterial
    );
    tableTop.position.y = -0.11;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    const tableLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 1.3, 32),
        tableMaterial
    );
    tableLeg.position.y = -0.85;
    tableLeg.castShadow = true;
    tableLeg.receiveShadow = true;
    tableGroup.add(tableLeg);

    const tableBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.6, 0.15, 32),
        tableMaterial
    );
    tableBase.position.y = -1.55;
    tableBase.castShadow = true;
    tableBase.receiveShadow = true;
    tableGroup.add(tableBase);

    // CAKE PLATE
    const plateGroup = new THREE.Group();
    plateGroup.position.y = 0.04;
    rootGroup.add(plateGroup);

    const plateSurface = new THREE.Mesh(
        new THREE.CylinderGeometry(1.65, 1.68, 0.1, 72),
        plateMaterial
    );
    plateSurface.position.y = 0.05;
    plateSurface.castShadow = true;
    plateSurface.receiveShadow = true;
    plateGroup.add(plateSurface);

    const plateRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.62, 0.06, 16, 72),
        plateMaterial
    );
    plateRim.position.y = 0.1;
    plateRim.rotation.x = Math.PI / 2;
    plateRim.castShadow = true;
    plateRim.receiveShadow = true;
    plateGroup.add(plateRim);

    const plateFoot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.6, 0.3, 48),
        plateMaterial
    );
    plateFoot.position.y = -0.18;
    plateFoot.castShadow = true;
    plateFoot.receiveShadow = true;
    plateGroup.add(plateFoot);

    // BOTTOM CAKE TIER
    const bottomTierGroup = new THREE.Group();
    bottomTierGroup.position.y = 0.18;
    rootGroup.add(bottomTierGroup);

    const bottomSponge = new THREE.Mesh(
        new THREE.CylinderGeometry(1.32, 1.33, 0.88, 64),
        cakeSpongeMaterial
    );
    bottomSponge.position.y = 0.44;
    bottomSponge.castShadow = true;
    bottomSponge.receiveShadow = true;
    bottomTierGroup.add(bottomSponge);

    const bottomFrosting = new THREE.Mesh(
        new THREE.CylinderGeometry(1.42, 1.44, 0.92, 72),
        frostingMaterial
    );
    bottomFrosting.position.y = 0.46;
    bottomFrosting.castShadow = true;
    bottomFrosting.receiveShadow = true;
    bottomTierGroup.add(bottomFrosting);

    const bottomTopFrosting = new THREE.Mesh(
        new THREE.CylinderGeometry(1.38, 1.42, 0.06, 72),
        frostingHighlightMaterial
    );
    bottomTopFrosting.position.y = 0.93;
    bottomTopFrosting.castShadow = true;
    bottomTopFrosting.receiveShadow = true;
    bottomTierGroup.add(bottomTopFrosting);

    // BOTTOM TIER DRIPS
    const bottomDripsGroup = new THREE.Group();
    bottomDripsGroup.position.y = 0.9;
    bottomTierGroup.add(bottomDripsGroup);

    const dripGeometry = new THREE.SphereGeometry(0.055, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const numDrips = 36;
    for (let i = 0; i < numDrips; i++) {
        const angle = (i / numDrips) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
        const radius = 1.38 + (Math.random() - 0.5) * 0.06;
        const dripLength = 0.15 + Math.random() * 0.35;
        const drip = new THREE.Mesh(dripGeometry, frostingMaterial);
        drip.position.set(
            Math.cos(angle) * radius,
            -0.02 - dripLength * 0.35,
            Math.sin(angle) * radius
        );
        drip.scale.set(1, 1 + dripLength * 4.5, 1);
        drip.rotation.z = (Math.random() - 0.5) * 0.3;
        drip.castShadow = true;
        drip.receiveShadow = true;
        bottomDripsGroup.add(drip);
    }

    // BOTTOM TIER PIPING
    const bottomPipingGroup = new THREE.Group();
    bottomPipingGroup.position.y = 0.03;
    bottomTierGroup.add(bottomPipingGroup);

    const pipingSphereGeom = new THREE.SphereGeometry(0.07, 10, 8);
    const numPiping = 56;
    for (let i = 0; i < numPiping; i++) {
        const angle = (i / numPiping) * Math.PI * 2;
        const radius = 1.43;
        const dot = new THREE.Mesh(pipingSphereGeom, frostingHighlightMaterial);
        dot.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        dot.scale.setScalar(0.85 + Math.random() * 0.3);
        dot.castShadow = true;
        dot.receiveShadow = true;
        bottomPipingGroup.add(dot);
    }

    // TOP CAKE TIER
    const topTierGroup = new THREE.Group();
    topTierGroup.position.y = 0.95;
    rootGroup.add(topTierGroup);

    const topSponge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.88, 0.89, 0.6, 56),
        cakeSpongeMaterial
    );
    topSponge.position.y = 0.3;
    topSponge.castShadow = true;
    topSponge.receiveShadow = true;
    topTierGroup.add(topSponge);

    const topFrosting = new THREE.Mesh(
        new THREE.CylinderGeometry(0.97, 0.99, 0.64, 64),
        frostingMaterial
    );
    topFrosting.position.y = 0.32;
    topFrosting.castShadow = true;
    topFrosting.receiveShadow = true;
    topTierGroup.add(topFrosting);

    const topSurfaceFrosting = new THREE.Mesh(
        new THREE.CylinderGeometry(0.94, 0.97, 0.05, 64),
        frostingHighlightMaterial
    );
    topSurfaceFrosting.position.y = 0.65;
    topSurfaceFrosting.castShadow = true;
    topSurfaceFrosting.receiveShadow = true;
    topTierGroup.add(topSurfaceFrosting);

    // TOP TIER DRIPS
    const topDripsGroup = new THREE.Group();
    topDripsGroup.position.y = 0.62;
    topTierGroup.add(topDripsGroup);

    const numTopDrips = 24;
    for (let i = 0; i < numTopDrips; i++) {
        const angle = (i / numTopDrips) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
        const radius = 0.94 + (Math.random() - 0.5) * 0.05;
        const dripLength = 0.1 + Math.random() * 0.28;
        const drip = new THREE.Mesh(dripGeometry, frostingMaterial);
        drip.position.set(
            Math.cos(angle) * radius,
            -0.02 - dripLength * 0.3,
            Math.sin(angle) * radius
        );
        drip.scale.set(1, 1 + dripLength * 4, 1);
        drip.rotation.z = (Math.random() - 0.5) * 0.25;
        drip.castShadow = true;
        drip.receiveShadow = true;
        topDripsGroup.add(drip);
    }

    // TOP TIER PIPING
    const topPipingGroup = new THREE.Group();
    topPipingGroup.position.y = 0.03;
    topTierGroup.add(topPipingGroup);

    const numTopPiping = 40;
    for (let i = 0; i < numTopPiping; i++) {
        const angle = (i / numTopPiping) * Math.PI * 2;
        const radius = 0.98;
        const dot = new THREE.Mesh(pipingSphereGeom, frostingHighlightMaterial);
        dot.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        dot.scale.setScalar(0.8 + Math.random() * 0.25);
        dot.castShadow = true;
        dot.receiveShadow = true;
        topPipingGroup.add(dot);
    }

    // TOP SURFACE SWIRL
    const swirlGroup = new THREE.Group();
    swirlGroup.position.y = 0.67;
    topTierGroup.add(swirlGroup);

    const swirlDotGeom = new THREE.SphereGeometry(0.05, 8, 6);
    const numSwirlDots = 60;
    for (let i = 0; i < numSwirlDots; i++) {
        const t = i / numSwirlDots;
        const radius = 0.15 + t * 0.7;
        const angle = t * Math.PI * 5.5;
        const dot = new THREE.Mesh(swirlDotGeom, frostingHighlightMaterial);
        dot.position.set(
            Math.cos(angle) * radius,
            0.01,
            Math.sin(angle) * radius
        );
        dot.scale.setScalar(0.7 + Math.random() * 0.6);
        dot.castShadow = true;
        dot.receiveShadow = true;
        swirlGroup.add(dot);
    }

    // CANDLES
    const candlesGroup = new THREE.Group();
    candlesGroup.position.y = 0.7;
    topTierGroup.add(candlesGroup);

    const candleData: any[] = [];
    const candleCircleRadius = 0.38;

    const flames: THREE.Group[] = [];
    const lights: THREE.PointLight[] = [];
    
    // Shared candle geometries
    const cBodyGeo = new THREE.CylinderGeometry(0.045, 0.048, 0.42, 20);
    const cStripeGeo = new THREE.TorusGeometry(0.047, 0.012, 8, 20);
    const cTopRimGeo = new THREE.TorusGeometry(0.044, 0.008, 8, 20);
    const cWickGeo = new THREE.CylinderGeometry(0.006, 0.007, 0.06, 8);
    const cFlameConeGeo = new THREE.ConeGeometry(0.038, 0.22, 12, 1);
    const cFlameTipGeo = new THREE.SphereGeometry(0.022, 8, 6);
    const cFlameCoreGeo = new THREE.SphereGeometry(0.014, 6, 4);

    const cFlameCoreMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.1,
        metalness: 0,
        emissive: '#ffffff',
        emissiveIntensity: 3,
    });

    for (let i = 0; i < numCandles; i++) {
        const angle = (i / numCandles) * Math.PI * 2 + 0.15;
        const cx = Math.cos(angle) * candleCircleRadius;
        const cz = Math.sin(angle) * candleCircleRadius;

        const candleGroup = new THREE.Group();
        candleGroup.position.set(cx, 0.04, cz);
        candleGroup.name = `candle-${i}`; // Important for raycaster interaction
        candlesGroup.add(candleGroup);

        const candleBody = new THREE.Mesh(cBodyGeo, candleMaterial);
        candleBody.position.y = 0.21;
        candleBody.castShadow = true;
        candleBody.receiveShadow = true;
        candleGroup.add(candleBody);

        const stripe = new THREE.Mesh(cStripeGeo, candleStripeMaterial);
        stripe.position.y = 0.32;
        stripe.rotation.x = Math.PI / 2;
        candleGroup.add(stripe);

        const topRim = new THREE.Mesh(cTopRimGeo, frostingHighlightMaterial);
        topRim.position.y = 0.42;
        topRim.rotation.x = Math.PI / 2;
        candleGroup.add(topRim);

        const wick = new THREE.Mesh(cWickGeo, wickMaterial);
        wick.position.y = 0.45;
        candleGroup.add(wick);

        const flameGroup = new THREE.Group();
        flameGroup.position.y = 0.48;
        flameGroup.name = 'flameGroup';
        candleGroup.add(flameGroup);

        const flameCone = new THREE.Mesh(cFlameConeGeo, flameMaterial);
        flameCone.position.y = 0.1;
        flameCone.name = 'flameCone';
        flameGroup.add(flameCone);

        const flameTip = new THREE.Mesh(cFlameTipGeo, flameTipMaterial);
        flameTip.position.y = 0.2;
        flameTip.name = 'flameTip';
        flameGroup.add(flameTip);

        const flameCore = new THREE.Mesh(cFlameCoreGeo, cFlameCoreMat);
        flameCore.position.y = 0.08;
        flameCore.name = 'flameCore';
        flameGroup.add(flameCore);

        const pointLight = new THREE.PointLight('#ff9944', 7, 2.5, 2);
        pointLight.position.y = 0.12;
        pointLight.name = 'candleLight';
        flameGroup.add(pointLight);

        flames.push(flameGroup);
        lights.push(pointLight);

        candleData.push({
            group: candleGroup,
            flameGroup: flameGroup,
            flameCone: flameCone,
            flameTip: flameTip,
            flameCore: flameCore,
            pointLight: pointLight,
            baseIntensity: 7,
            phase: Math.random() * Math.PI * 2,
            flickerSpeed: 3.5 + Math.random() * 4,
            flickerAmp: 0.15 + Math.random() * 0.35,
            index: i
        });
    }

    flamesRef.current = flames;
    lightsRef.current = lights;

    // INITIAL LIGHTING VISIBILITY SYNC
    flames.forEach((f, i) => f.visible = candlesLit[i] ?? true);
    lights.forEach((l, i) => l.visible = candlesLit[i] ?? true);

    // SPRINKLES
    const sprinkleGeom = new THREE.CylinderGeometry(0.016, 0.016, 0.09, 6);
    const allSprinklesGroup = new THREE.Group();
    rootGroup.add(allSprinklesGroup);

    const placeSprinklesOnAnnulus = (count: number, innerR: number, outerR: number, y: number, group: THREE.Group) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random() * (outerR * outerR - innerR * innerR) + innerR * innerR);
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const color = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
            const mat = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.35,
                metalness: 0.05,
            });
            const sprinkle = new THREE.Mesh(sprinkleGeom, mat);
            sprinkle.position.set(x, y, z);
            sprinkle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            sprinkle.castShadow = true;
            sprinkle.receiveShadow = true;
            group.add(sprinkle);
        }
    };

    const placeSprinklesOnCircle = (count: number, maxR: number, y: number, group: THREE.Group, minR = 0) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random() * (maxR * maxR - minR * minR) + minR * minR);
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const color = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
            const mat = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.35,
                metalness: 0.05,
            });
            const sprinkle = new THREE.Mesh(sprinkleGeom, mat);
            sprinkle.position.set(x, y, z);
            sprinkle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            sprinkle.castShadow = true;
            sprinkle.receiveShadow = true;
            group.add(sprinkle);
        }
    };

    const placeSprinklesOnSide = (count: number, radius: number, yMin: number, yMax: number, group: THREE.Group) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const y = yMin + Math.random() * (yMax - yMin);
            const r = radius + (Math.random() - 0.5) * 0.04;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const color = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
            const mat = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.35,
                metalness: 0.05,
            });
            const sprinkle = new THREE.Mesh(sprinkleGeom, mat);
            sprinkle.position.set(x, y, z);
            sprinkle.lookAt(x * 2, y, z * 2);
            sprinkle.rotateX((Math.random() - 0.5) * 0.6);
            sprinkle.rotateY((Math.random() - 0.5) * 0.6);
            sprinkle.castShadow = true;
            sprinkle.receiveShadow = true;
            group.add(sprinkle);
        }
    };

    placeSprinklesOnAnnulus(90, 1.0, 1.37, 1.13, allSprinklesGroup);
    placeSprinklesOnSide(60, 1.41, 0.25, 1.05, allSprinklesGroup);
    placeSprinklesOnCircle(50, 0.9, 1.63, allSprinklesGroup, 0.45);
    placeSprinklesOnSide(35, 0.96, 1.0, 1.55, allSprinklesGroup);

    // AMBIENT PARTICLES
    const particlesGroup = new THREE.Group();
    rootGroup.add(particlesGroup);
    const particleGeom = new THREE.SphereGeometry(0.012, 4, 4);
    const particleDataArr: any[] = [];
    const numParticles = 40;

    for (let i = 0; i < numParticles; i++) {
        const mat = new THREE.MeshStandardMaterial({
            color: '#ffe8c0',
            roughness: 0.2,
            metalness: 0,
            emissive: '#ffcc88',
            emissiveIntensity: 0.6,
        });
        const particle = new THREE.Mesh(particleGeom, mat);
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.5 + Math.random() * 3.5;
        particle.position.set(
            Math.cos(angle) * radius,
            -0.2 + Math.random() * 3.5,
            Math.sin(angle) * radius
        );
        particle.scale.setScalar(0.4 + Math.random() * 1.2);
        particlesGroup.add(particle);
        particleDataArr.push({
            mesh: particle,
            baseY: particle.position.y,
            speed: 0.3 + Math.random() * 0.8,
            amplitude: 0.15 + Math.random() * 0.6,
            phase: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 2,
        });
    }

    // INTERACTION (Raycasting for candles)
    let isDragging = false;
    let previousMouseX = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleIntersect = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(candlesGroup.children, true);
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.parent !== candlesGroup && obj.name.indexOf("candle-") === -1) {
          obj = obj.parent;
        }
        if (obj && obj.name.startsWith("candle-")) {
          const index = parseInt(obj.name.split("-")[1]);
          onCandleClick(index);
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      handleIntersect(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      rootGroup.rotation.y += deltaX * 0.006;
      previousMouseX = e.clientX;
    };

    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      handleIntersect(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      rootGroup.rotation.y += deltaX * 0.006;
      previousMouseX = e.touches[0].clientX;
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationId: number;

    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        const dt = Math.min(clock.getDelta(), 0.1);

        if (!isDragging) {
            rootGroup.rotation.y += 0.002; // Auto rotate slightly
        }

        // Animate candle flames
        candleData.forEach((data) => {
            if (!flamesRef.current[data.index]?.visible) return;

            const flicker = 1 + Math.sin(time * data.flickerSpeed + data.phase) * data.flickerAmp +
                Math.sin(time * data.flickerSpeed * 1.7 + data.phase + 1.3) * data.flickerAmp * 0.7 +
                Math.sin(time * data.flickerSpeed * 2.3 + data.phase + 2.7) * data.flickerAmp * 0.4;

            const flickerClamped = Math.max(0.55, Math.min(1.5, flicker));

            data.flameCone.scale.set(
                1 + (1 - flickerClamped) * 0.4,
                flickerClamped,
                1 + (1 - flickerClamped) * 0.4
            );
            data.flameCone.position.y = 0.1 * flickerClamped;

            data.flameTip.scale.setScalar(0.8 + flickerClamped * 0.4);
            data.flameTip.position.y = 0.18 + flickerClamped * 0.04;

            data.flameCore.scale.setScalar(0.7 + flickerClamped * 0.5);
            data.flameCore.position.y = 0.07 + flickerClamped * 0.03;

            data.pointLight.intensity = data.baseIntensity * flickerClamped;
            data.pointLight.position.y = 0.1 + flickerClamped * 0.04;

            const wobbleX = Math.sin(time * data.flickerSpeed * 0.7 + data.phase) * 0.006;
            const wobbleZ = Math.cos(time * data.flickerSpeed * 0.8 + data.phase) * 0.006;
            data.flameGroup.position.x = wobbleX;
            data.flameGroup.position.z = wobbleZ;
        });

        // Animate particles
        particleDataArr.forEach((pData) => {
            const floatY = Math.sin(time * pData.speed + pData.phase) * pData.amplitude;
            pData.mesh.position.y = pData.baseY + floatY;
            pData.mesh.rotation.y += pData.rotSpeed * dt;
            const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * pData.speed * 1.3 + pData.phase));
            pData.mesh.material.emissiveIntensity = 0.3 + alpha * 0.9;
            pData.mesh.material.opacity = alpha;
            pData.mesh.material.transparent = true;
        });

        const globalFlicker = 1 + Math.sin(time * 2.5) * 0.08 + Math.sin(time * 4.7) * 0.05;
        flameMaterial.emissiveIntensity = 2.5 * globalFlicker;
        flameTipMaterial.emissiveIntensity = 1.8 * globalFlicker;

        renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

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

      if (container && renderer.domElement) {
        try { container.removeChild(renderer.domElement); } catch (_) {}
      }
    };
  }, [numCandles]); // Intentionally not including candlesLit to avoid full re-render

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
      style={{ overflow: 'hidden' }}
    />
  );
}
