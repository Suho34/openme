// Cake styles the creator can pick from. Each maps to a distinct
// 3D cake color palette (see cake/materials.ts) and a swatch for the UI.

export type CakeStyle = "classic" | "berry" | "matcha" | "chocolate";

export interface CakeStyleInfo {
  id: CakeStyle;
  label: string;
  mood: string;
  swatch: [string, string]; // frosting / sponge colors for the picker dot
  palette: {
    frosting: string;
    frostingHighlight: string;
    sponge: string;
    candle: string;
    candleStripe: string;
    sprinkles: string[];
  };
}

export const CAKE_STYLES: CakeStyleInfo[] = [
  {
    id: "classic",
    label: "Vanilla Cream",
    mood: "Timeless & cozy",
    swatch: ["#fef7f0", "#c8946b"],
    palette: {
      frosting: "#fef7f0",
      frostingHighlight: "#fffdfa",
      sponge: "#c8946b",
      candle: "#fffefc",
      candleStripe: "#f4e4d4",
      sprinkles: [
        "#ff5e7a",
        "#4dc9f6",
        "#ffe066",
        "#7ce08b",
        "#ce93d8",
        "#ffffff",
      ],
    },
  },
  {
    id: "berry",
    label: "Rose Berry",
    mood: "Sweet & romantic",
    swatch: ["#fbe4e8", "#e8a0b0"],
    palette: {
      frosting: "#fbe4e8",
      frostingHighlight: "#fff2f4",
      sponge: "#e8a0b0",
      candle: "#fff6f7",
      candleStripe: "#f7d6dd",
      sprinkles: ["#ff5e7a", "#ff4081", "#ff6e9f", "#ffffff", "#ffd740"],
    },
  },
  {
    id: "matcha",
    label: "Matcha Mint",
    mood: "Fresh & gentle",
    swatch: ["#eef4e8", "#9bbf9b"],
    palette: {
      frosting: "#eef4e8",
      frostingHighlight: "#f7faf4",
      sponge: "#9bbf9b",
      candle: "#f4f8f0",
      candleStripe: "#dde8d9",
      sprinkles: ["#7ce08b", "#4caf50", "#c8e6c9", "#ffffff", "#ffd740"],
    },
  },
  {
    id: "chocolate",
    label: "Golden Cocoa",
    mood: "Warm & rich",
    swatch: ["#f5e7d3", "#8a5a3b"],
    palette: {
      frosting: "#f5e7d3",
      frostingHighlight: "#fbefe1",
      sponge: "#8a5a3b",
      candle: "#fdf1e2",
      candleStripe: "#f0dcc0",
      sprinkles: ["#d9a05b", "#a66a3c", "#ffe0b2", "#ffffff", "#ffd740"],
    },
  },
];

export const DEFAULT_CAKE_STYLE: CakeStyle = "classic";
