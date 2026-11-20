import * as THREE from "three";
import type { CakeStyle } from "@/lib/cakeStyles";

interface CakePalette {
  frosting: string;
  frostingHighlight: string;
  sponge: string;
  candle: string;
  candleStripe: string;
  sprinkles: string[];
}

export const sprinkleColors = [
  "#ff5e7a", "#ff4081", "#ff6e9f",
  "#4dc9f6", "#38b6ff", "#5ddbff",
  "#ffe066", "#ffd740", "#ffc107",
  "#7ce08b", "#4caf50", "#69f0ae",
  "#ff8a65", "#ff7043",
  "#ce93d8", "#ba68c8",
  "#ffffff", "#fafafa",
];

const PALETTES: Record<CakeStyle, CakePalette> = {
  classic: {
    frosting: "#FBF6EE",
    frostingHighlight: "#FFFDF9",
    sponge: "#C8946B",
    candle: "#FDF5E6",
    candleStripe: "#EED7B5",
    sprinkles: sprinkleColors,
  },
  berry: {
    frosting: "#FBE4E8",
    frostingHighlight: "#FFF2F4",
    sponge: "#E8A0B0",
    candle: "#FFF6F7",
    candleStripe: "#F7D6DD",
    sprinkles: ["#FF5E7A", "#FF4081", "#FF6E9F", "#FFFFFF", "#FFD740"],
  },
  matcha: {
    frosting: "#EEF4E8",
    frostingHighlight: "#F7FAF4",
    sponge: "#9BBF9B",
    candle: "#F4F8F0",
    candleStripe: "#DDE8D9",
    sprinkles: ["#7CE08B", "#4CAF50", "#C8E6C9", "#FFFFFF", "#FFD740"],
  },
  chocolate: {
    frosting: "#F5E7D3",
    frostingHighlight: "#FBEFE1",
    sponge: "#8A5A3B",
    candle: "#FDF1E2",
    candleStripe: "#F0DCC0",
    sprinkles: ["#D9A05B", "#A66A3C", "#FFE0B2", "#FFFFFF", "#FFD740"],
  },
};

export function createMaterials(style: CakeStyle = "classic") {
  const p = PALETTES[style] ?? PALETTES.classic;

  // Velvety artisan buttercream using MeshPhysicalMaterial
  const frosting = new THREE.MeshPhysicalMaterial({
    color: p.frosting,
    roughness: 0.55,
    metalness: 0.02,
    sheen: 0.85,
    sheenColor: new THREE.Color("#FFF1DC"),
    clearcoat: 0.08,
    name: "frosting",
  });

  const frostingHighlight = new THREE.MeshPhysicalMaterial({
    color: p.frostingHighlight,
    roughness: 0.42,
    metalness: 0.02,
    sheen: 0.9,
    sheenColor: new THREE.Color("#FFFFFF"),
    name: "frostingHighlight",
  });

  const cakeSponge = new THREE.MeshStandardMaterial({
    color: p.sponge,
    roughness: 0.78,
    metalness: 0,
    name: "cakeSponge",
  });

  // Vintage scalloped porcelain plate with clearcoat
  const plate = new THREE.MeshPhysicalMaterial({
    color: "#FAF8F5",
    roughness: 0.16,
    metalness: 0.04,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    name: "porcelain",
  });

  // Antique brass gold rim for the vintage plate
  const goldRim = new THREE.MeshStandardMaterial({
    color: "#C5A059",
    roughness: 0.25,
    metalness: 0.85,
    name: "goldRim",
  });

  // Aged dark walnut tabletop
  const wood = new THREE.MeshStandardMaterial({
    color: "#3B271E",
    roughness: 0.65,
    metalness: 0.04,
    name: "wood",
  });

  // Fresh glossy berries
  const berry = new THREE.MeshPhysicalMaterial({
    color: "#2B1633",
    roughness: 0.22,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    name: "berry",
  });

  // Beeswax taper candles
  const candle = new THREE.MeshPhysicalMaterial({
    color: p.candle,
    roughness: 0.35,
    metalness: 0.02,
    transmission: 0.12,
    thickness: 0.4,
    name: "candle",
  });

  const candleStripe = new THREE.MeshStandardMaterial({
    color: p.candleStripe,
    roughness: 0.35,
    metalness: 0.01,
    name: "candleStripe",
  });

  const wick = new THREE.MeshStandardMaterial({
    color: "#181412",
    roughness: 0.95,
    metalness: 0,
    name: "wick",
  });

  // Vivid photorealistic candle flame with warm gradient emissive
  const flame = new THREE.MeshStandardMaterial({
    color: "#FFA034",
    roughness: 0.15,
    metalness: 0,
    emissive: "#FF5500",
    emissiveIntensity: 3.2,
    name: "flame",
  });

  const flameTip = new THREE.MeshStandardMaterial({
    color: "#FFE066",
    roughness: 0.1,
    metalness: 0,
    emissive: "#FFB800",
    emissiveIntensity: 2.5,
    name: "flameTip",
  });

  const flameCore = new THREE.MeshStandardMaterial({
    color: "#FFFFFF",
    roughness: 0.05,
    metalness: 0,
    emissive: "#FFFFFF",
    emissiveIntensity: 4.5,
    name: "flameCore",
  });

  return {
    frosting,
    frostingHighlight,
    cakeSponge,
    plate,
    goldRim,
    wood,
    berry,
    candle,
    candleStripe,
    wick,
    flame,
    flameTip,
    flameCore,
    palette: p,
  };
}

export type Materials = ReturnType<typeof createMaterials>;
