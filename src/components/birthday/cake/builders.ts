import * as THREE from "three";
import { Materials, sprinkleColors } from "./materials";

export interface CandleData {
  group: THREE.Group;
  flameGroup: THREE.Group;
  flameCone: THREE.Mesh;
  flameTip: THREE.Mesh;
  flameCore: THREE.Mesh;
  pointLight: THREE.PointLight;
  baseIntensity: number;
  phase: number;
  flickerSpeed: number;
  flickerAmp: number;
  index: number;
}

export function buildTable(rootGroup: THREE.Group, wood: THREE.MeshStandardMaterial) {
  const tableGroup = new THREE.Group();
  rootGroup.add(tableGroup);

  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.7, 0.22, 64), wood);
  tableTop.position.y = -0.11;
  tableTop.castShadow = tableTop.receiveShadow = true;
  tableGroup.add(tableTop);

  const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.3, 32), wood);
  tableLeg.position.y = -0.85;
  tableLeg.castShadow = tableLeg.receiveShadow = true;
  tableGroup.add(tableLeg);

  const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.15, 32), wood);
  tableBase.position.y = -1.55;
  tableBase.castShadow = tableBase.receiveShadow = true;
  tableGroup.add(tableBase);
}

export function buildPlate(rootGroup: THREE.Group, plate: THREE.MeshStandardMaterial) {
  const plateGroup = new THREE.Group();
  plateGroup.position.y = 0.04;
  rootGroup.add(plateGroup);

  const surface = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.68, 0.1, 72), plate);
  surface.position.y = 0.05;
  surface.castShadow = surface.receiveShadow = true;
  plateGroup.add(surface);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.06, 16, 72), plate);
  rim.position.y = 0.1;
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = rim.receiveShadow = true;
  plateGroup.add(rim);

  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 48), plate);
  foot.position.y = -0.18;
  foot.castShadow = foot.receiveShadow = true;
  plateGroup.add(foot);
}

export function buildBottomTier(rootGroup: THREE.Group, mat: Materials) {
  const tier = new THREE.Group();
  tier.position.y = 0.18;
  rootGroup.add(tier);

  const sponge = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.33, 0.88, 64), mat.cakeSponge);
  sponge.position.y = 0.44;
  sponge.castShadow = sponge.receiveShadow = true;
  tier.add(sponge);

  const frosting = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.44, 0.92, 72), mat.frosting);
  frosting.position.y = 0.46;
  frosting.castShadow = frosting.receiveShadow = true;
  tier.add(frosting);

  const topFrosting = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.42, 0.06, 72), mat.frostingHighlight);
  topFrosting.position.y = 0.93;
  topFrosting.castShadow = topFrosting.receiveShadow = true;
  tier.add(topFrosting);

  // Drips
  const drips = new THREE.Group();
  drips.position.y = 0.9;
  tier.add(drips);
  const dripGeo = new THREE.SphereGeometry(0.055, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.7);
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
    const radius = 1.38 + (Math.random() - 0.5) * 0.06;
    const len = 0.15 + Math.random() * 0.35;
    const drip = new THREE.Mesh(dripGeo, mat.frosting);
    drip.position.set(Math.cos(angle) * radius, -0.02 - len * 0.35, Math.sin(angle) * radius);
    drip.scale.set(1, 1 + len * 4.5, 1);
    drip.rotation.z = (Math.random() - 0.5) * 0.3;
    drip.castShadow = drip.receiveShadow = true;
    drips.add(drip);
  }

  // Piping
  const piping = new THREE.Group();
  piping.position.y = 0.03;
  tier.add(piping);
  const dotGeo = new THREE.SphereGeometry(0.07, 10, 8);
  for (let i = 0; i < 56; i++) {
    const angle = (i / 56) * Math.PI * 2;
    const dot = new THREE.Mesh(dotGeo, mat.frostingHighlight);
    dot.position.set(Math.cos(angle) * 1.43, 0, Math.sin(angle) * 1.43);
    dot.scale.setScalar(0.85 + Math.random() * 0.3);
    dot.castShadow = dot.receiveShadow = true;
    piping.add(dot);
  }
}

export function buildTopTier(rootGroup: THREE.Group, mat: Materials): THREE.Group {
  const tier = new THREE.Group();
  tier.position.y = 0.95;
  rootGroup.add(tier);

  const sponge = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.89, 0.6, 56), mat.cakeSponge);
  sponge.position.y = 0.3;
  sponge.castShadow = sponge.receiveShadow = true;
  tier.add(sponge);

  const frosting = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 0.99, 0.64, 64), mat.frosting);
  frosting.position.y = 0.32;
  frosting.castShadow = frosting.receiveShadow = true;
  tier.add(frosting);

  const topFrosting = new THREE.Mesh(new THREE.CylinderGeometry(0.94, 0.97, 0.05, 64), mat.frostingHighlight);
  topFrosting.position.y = 0.65;
  topFrosting.castShadow = topFrosting.receiveShadow = true;
  tier.add(topFrosting);

  // Drips
  const drips = new THREE.Group();
  drips.position.y = 0.62;
  tier.add(drips);
  const dripGeo = new THREE.SphereGeometry(0.055, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.7);
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
    const radius = 0.94 + (Math.random() - 0.5) * 0.05;
    const len = 0.1 + Math.random() * 0.28;
    const drip = new THREE.Mesh(dripGeo, mat.frosting);
    drip.position.set(Math.cos(angle) * radius, -0.02 - len * 0.3, Math.sin(angle) * radius);
    drip.scale.set(1, 1 + len * 4, 1);
    drip.rotation.z = (Math.random() - 0.5) * 0.25;
    drip.castShadow = drip.receiveShadow = true;
    drips.add(drip);
  }

  // Piping
  const piping = new THREE.Group();
  piping.position.y = 0.03;
  tier.add(piping);
  const dotGeo = new THREE.SphereGeometry(0.07, 10, 8);
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2;
    const dot = new THREE.Mesh(dotGeo, mat.frostingHighlight);
    dot.position.set(Math.cos(angle) * 0.98, 0, Math.sin(angle) * 0.98);
    dot.scale.setScalar(0.8 + Math.random() * 0.25);
    dot.castShadow = dot.receiveShadow = true;
    piping.add(dot);
  }

  // Top swirl
  const swirl = new THREE.Group();
  swirl.position.y = 0.67;
  tier.add(swirl);
  const swirlDot = new THREE.SphereGeometry(0.05, 8, 6);
  for (let i = 0; i < 60; i++) {
    const t = i / 60;
    const r = 0.15 + t * 0.7;
    const a = t * Math.PI * 5.5;
    const dot = new THREE.Mesh(swirlDot, mat.frostingHighlight);
    dot.position.set(Math.cos(a) * r, 0.01, Math.sin(a) * r);
    dot.scale.setScalar(0.7 + Math.random() * 0.6);
    dot.castShadow = dot.receiveShadow = true;
    swirl.add(dot);
  }
  return tier;
}

export function buildCandles(
  rootGroup: THREE.Group,
  topTierGroup: THREE.Group,
  numCandles: number,
  mat: Materials
): { candlesGroup: THREE.Group; candleData: CandleData[]; flames: THREE.Group[]; lights: THREE.PointLight[] } {
  const candlesGroup = new THREE.Group();
  candlesGroup.position.y = 0.7;
  topTierGroup.add(candlesGroup);

  const candleData: CandleData[] = [];
  const flames: THREE.Group[] = [];
  const lights: THREE.PointLight[] = [];

  const cBodyGeo = new THREE.CylinderGeometry(0.045, 0.048, 0.42, 20);
  const cStripeGeo = new THREE.TorusGeometry(0.047, 0.012, 8, 20);
  const cTopRimGeo = new THREE.TorusGeometry(0.044, 0.008, 8, 20);
  const cWickGeo = new THREE.CylinderGeometry(0.006, 0.007, 0.06, 8);
  const cFlameConeGeo = new THREE.ConeGeometry(0.038, 0.22, 12, 1);
  const cFlameTipGeo = new THREE.SphereGeometry(0.022, 8, 6);
  const cFlameCoreGeo = new THREE.SphereGeometry(0.014, 6, 4);

  const candleCircleRadius = 0.38;

  for (let i = 0; i < numCandles; i++) {
    const angle = (i / numCandles) * Math.PI * 2 + 0.15;
    const cx = Math.cos(angle) * candleCircleRadius;
    const cz = Math.sin(angle) * candleCircleRadius;

    const candleGroup = new THREE.Group();
    candleGroup.position.set(cx, 0.04, cz);
    candleGroup.name = `candle-${i}`;
    candlesGroup.add(candleGroup);

    const body = new THREE.Mesh(cBodyGeo, mat.candle);
    body.position.y = 0.21;
    body.castShadow = body.receiveShadow = true;
    candleGroup.add(body);

    const stripe = new THREE.Mesh(cStripeGeo, mat.candleStripe);
    stripe.position.y = 0.32;
    stripe.rotation.x = Math.PI / 2;
    candleGroup.add(stripe);

    const topRim = new THREE.Mesh(cTopRimGeo, mat.frostingHighlight);
    topRim.position.y = 0.42;
    topRim.rotation.x = Math.PI / 2;
    candleGroup.add(topRim);

    const wick = new THREE.Mesh(cWickGeo, mat.wick);
    wick.position.y = 0.45;
    candleGroup.add(wick);

    const flameGroup = new THREE.Group();
    flameGroup.position.y = 0.48;
    flameGroup.name = "flameGroup";
    candleGroup.add(flameGroup);

    const flameCone = new THREE.Mesh(cFlameConeGeo, mat.flame);
    flameCone.position.y = 0.1;
    flameCone.name = "flameCone";
    flameGroup.add(flameCone);

    const flameTip = new THREE.Mesh(cFlameTipGeo, mat.flameTip);
    flameTip.position.y = 0.2;
    flameTip.name = "flameTip";
    flameGroup.add(flameTip);

    const flameCore = new THREE.Mesh(cFlameCoreGeo, mat.flameCore);
    flameCore.position.y = 0.08;
    flameCore.name = "flameCore";
    flameGroup.add(flameCore);

    const pointLight = new THREE.PointLight("#ff9944", 7, 2.5, 2);
    pointLight.position.y = 0.12;
    pointLight.name = "candleLight";
    flameGroup.add(pointLight);

    flames.push(flameGroup);
    lights.push(pointLight);
    candleData.push({
      group: candleGroup, flameGroup, flameCone, flameTip, flameCore, pointLight,
      baseIntensity: 7, phase: Math.random() * Math.PI * 2,
      flickerSpeed: 3.5 + Math.random() * 4, flickerAmp: 0.15 + Math.random() * 0.35, index: i,
    });
  }

  return { candlesGroup, candleData, flames, lights };
}

export function buildSprinkles(rootGroup: THREE.Group) {
  const group = new THREE.Group();
  rootGroup.add(group);
  const geo = new THREE.CylinderGeometry(0.016, 0.016, 0.09, 6);

  const place = (count: number, fn: (i: number) => { x: number; y: number; z: number }) => {
    for (let i = 0; i < count; i++) {
      const color = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.05 });
      const mesh = new THREE.Mesh(geo, mat);
      const p = fn(i);
      mesh.position.set(p.x, p.y, p.z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.castShadow = mesh.receiveShadow = true;
      group.add(mesh);
    }
  };

  place(90, () => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random() * (1.37 * 1.37 - 1.0 * 1.0) + 1.0 * 1.0);
    return { x: Math.cos(a) * r, y: 1.13, z: Math.sin(a) * r };
  });
  place(60, () => {
    const a = Math.random() * Math.PI * 2;
    const y = 0.25 + Math.random() * 0.8;
    const r = 1.41 + (Math.random() - 0.5) * 0.04;
    return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
  });
  place(50, () => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random() * (0.9 * 0.9 - 0.45 * 0.45) + 0.45 * 0.45);
    return { x: Math.cos(a) * r, y: 1.63, z: Math.sin(a) * r };
  });
  place(35, () => {
    const a = Math.random() * Math.PI * 2;
    const y = 1.0 + Math.random() * 0.55;
    const r = 0.96 + (Math.random() - 0.5) * 0.04;
    return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
  });
}

export interface ParticleData {
  mesh: THREE.Mesh;
  baseY: number;
  speed: number;
  amplitude: number;
  phase: number;
  rotSpeed: number;
}

export function buildParticles(rootGroup: THREE.Group): ParticleData[] {
  const group = new THREE.Group();
  rootGroup.add(group);
  const geo = new THREE.SphereGeometry(0.012, 4, 4);
  const data: ParticleData[] = [];

  for (let i = 0; i < 40; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: "#ffe8c0", roughness: 0.2, metalness: 0,
      emissive: "#ffcc88", emissiveIntensity: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 3.5;
    mesh.position.set(Math.cos(angle) * radius, -0.2 + Math.random() * 3.5, Math.sin(angle) * radius);
    mesh.scale.setScalar(0.4 + Math.random() * 1.2);
    group.add(mesh);
    data.push({
      mesh, baseY: mesh.position.y, speed: 0.3 + Math.random() * 0.8,
      amplitude: 0.15 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2,
    });
  }

  return data;
}
