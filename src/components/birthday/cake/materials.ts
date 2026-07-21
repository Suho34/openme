import * as THREE from "three";

export function createMaterials() {
  const frosting = new THREE.MeshStandardMaterial({
    color: "#fef7f0", roughness: 0.5, metalness: 0.01, name: "frosting",
  });
  const frostingHighlight = new THREE.MeshStandardMaterial({
    color: "#fffdfa", roughness: 0.38, metalness: 0.02, name: "frostingHighlight",
  });
  const cakeSponge = new THREE.MeshStandardMaterial({
    color: "#c8946b", roughness: 0.75, metalness: 0, name: "cakeSponge",
  });
  const plate = new THREE.MeshStandardMaterial({
    color: "#fafaf8", roughness: 0.22, metalness: 0.06, name: "porcelain",
  });
  const wood = new THREE.MeshStandardMaterial({
    color: "#4a2c1b", roughness: 0.65, metalness: 0.03, name: "wood",
  });
  const candle = new THREE.MeshStandardMaterial({
    color: "#fffefc", roughness: 0.28, metalness: 0.02, name: "candle",
  });
  const candleStripe = new THREE.MeshStandardMaterial({
    color: "#f4e4d4", roughness: 0.3, metalness: 0.01, name: "candleStripe",
  });
  const wick = new THREE.MeshStandardMaterial({
    color: "#1a1a1a", roughness: 0.9, metalness: 0, name: "wick",
  });
  const flame = new THREE.MeshStandardMaterial({
    color: "#ff9930", roughness: 0.25, metalness: 0,
    emissive: "#ff5e00", emissiveIntensity: 2.5, name: "flame",
  });
  const flameTip = new THREE.MeshStandardMaterial({
    color: "#ffcc44", roughness: 0.2, metalness: 0,
    emissive: "#ffaa00", emissiveIntensity: 1.8, name: "flameTip",
  });
  const flameCore = new THREE.MeshStandardMaterial({
    color: "#ffffff", roughness: 0.1, metalness: 0,
    emissive: "#ffffff", emissiveIntensity: 3,
  });

  return { frosting, frostingHighlight, cakeSponge, plate, wood, candle, candleStripe, wick, flame, flameTip, flameCore };
}

export type Materials = ReturnType<typeof createMaterials>;

export const sprinkleColors = [
  "#ff5e7a", "#ff4081", "#ff6e9f",
  "#4dc9f6", "#38b6ff", "#5ddbff",
  "#ffe066", "#ffd740", "#ffc107",
  "#7ce08b", "#4caf50", "#69f0ae",
  "#ff8a65", "#ff7043",
  "#ce93d8", "#ba68c8",
  "#ffffff", "#fafafa",
];
