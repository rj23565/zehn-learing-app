/* ------------------------------------------------------------------ */
/* Paint-style colour mixing (RYB model)                               */
/* Children expect blue + yellow = green, so we mix like real paint,   */
/* not like light. White tints, black shades.                          */
/* ------------------------------------------------------------------ */

export type Paint = {
  id: string;
  name: string;
  hex: string;
  /** red / yellow / blue pigment amounts, 0–1 */
  ryb: [number, number, number];
  kind?: "white" | "black";
};

export const PAINTS: Paint[] = [
  { id: "red", name: "Red", hex: "#e11d48", ryb: [1, 0, 0] },
  { id: "yellow", name: "Yellow", hex: "#facc15", ryb: [0, 1, 0] },
  { id: "blue", name: "Blue", hex: "#2563eb", ryb: [0, 0, 1] },
  { id: "orange", name: "Orange", hex: "#f97316", ryb: [1, 1, 0] },
  { id: "green", name: "Green", hex: "#16a34a", ryb: [0, 1, 1] },
  { id: "purple", name: "Purple", hex: "#9333ea", ryb: [1, 0, 1] },
  { id: "brown", name: "Brown", hex: "#92400e", ryb: [1, 1, 1] },
  { id: "white", name: "White", hex: "#ffffff", ryb: [0, 0, 0], kind: "white" },
  { id: "black", name: "Black", hex: "#111827", ryb: [1, 1, 1], kind: "black" },
];

/* --------------------------- conversions -------------------------- */

const CORNERS: Record<string, [number, number, number]> = {
  "000": [255, 255, 255], // nothing  → white
  "100": [228, 30, 72],   // red
  "010": [250, 204, 21],  // yellow
  "001": [37, 99, 235],   // blue
  "110": [249, 115, 22],  // orange
  "101": [147, 51, 234],  // purple
  "011": [22, 163, 74],   // green
  "111": [92, 54, 20],    // all three → brown
};

/** Trilinear interpolation through the RYB colour cube. */
export function rybToHex(r: number, y: number, b: number): string {
  const lerp = (a: number, c: number, t: number) => a + (c - a) * t;
  const out: number[] = [];
  for (let ch = 0; ch < 3; ch++) {
    const c00 = lerp(CORNERS["000"][ch], CORNERS["100"][ch], r);
    const c01 = lerp(CORNERS["001"][ch], CORNERS["101"][ch], r);
    const c10 = lerp(CORNERS["010"][ch], CORNERS["110"][ch], r);
    const c11 = lerp(CORNERS["011"][ch], CORNERS["111"][ch], r);
    const c0 = lerp(c00, c10, y);
    const c1 = lerp(c01, c11, y);
    out.push(Math.round(lerp(c0, c1, b)));
  }
  return `#${out.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`;

function blend(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

/* ------------------------------ mixing ---------------------------- */

export type MixResult = { hex: string; name: string; ryb: [number, number, number] };

const NAMED: { ryb: [number, number, number]; name: string }[] = [
  { ryb: [1, 0, 0], name: "Red" }, { ryb: [0, 1, 0], name: "Yellow" },
  { ryb: [0, 0, 1], name: "Blue" }, { ryb: [1, 1, 0], name: "Orange" },
  { ryb: [0, 1, 1], name: "Green" }, { ryb: [1, 0, 1], name: "Purple" },
  { ryb: [1, 1, 1], name: "Brown" },
];

function nameFor(ryb: [number, number, number]): string {
  let best = "New colour";
  let dist = Infinity;
  for (const n of NAMED) {
    const d = Math.hypot(ryb[0] - n.ryb[0], ryb[1] - n.ryb[1], ryb[2] - n.ryb[2]);
    if (d < dist) { dist = d; best = n.name; }
  }
  return best;
}

/** Mix any number of paints like real pigment. */
export function mixPaints(paints: Paint[]): MixResult | null {
  if (paints.length === 0) return null;
  if (paints.length === 1) {
    return { hex: paints[0].hex, name: paints[0].name, ryb: paints[0].ryb };
  }

  const whites = paints.filter((p) => p.kind === "white").length;
  const blacks = paints.filter((p) => p.kind === "black").length;
  const pigments = paints.filter((p) => !p.kind);

  // only white and/or black
  if (pigments.length === 0) {
    if (whites && blacks) return { hex: "#9ca3af", name: "Grey", ryb: [0.5, 0.5, 0.5] };
    if (whites) return { hex: "#ffffff", name: "White", ryb: [0, 0, 0] };
    return { hex: "#111827", name: "Black", ryb: [1, 1, 1] };
  }

  // average pigment vectors, then normalise so the strongest stays vivid
  const sum: [number, number, number] = [0, 0, 0];
  pigments.forEach((p) => { sum[0] += p.ryb[0]; sum[1] += p.ryb[1]; sum[2] += p.ryb[2]; });
  const avg: [number, number, number] = [sum[0] / pigments.length, sum[1] / pigments.length, sum[2] / pigments.length];
  const max = Math.max(...avg);
  const norm: [number, number, number] = max > 0
    ? [avg[0] / max, avg[1] / max, avg[2] / max]
    : avg;

  let hex = rybToHex(norm[0], norm[1], norm[2]);
  let name = nameFor(norm);

  // white tints, black shades
  for (let i = 0; i < whites; i++) { hex = blend(hex, "#ffffff", 0.45); name = `Light ${name.toLowerCase()}`; }
  for (let i = 0; i < blacks; i++) { hex = blend(hex, "#111827", 0.42); name = `Dark ${name.toLowerCase()}`; }
  if (whites && name.toLowerCase().includes("light red")) name = "Pink";

  return { hex, name, ryb: norm };
}

/** Hue-cycling rainbow brush colour. */
export function rainbowAt(step: number): string {
  const h = (step * 7) % 360;
  const s = 0.85, l = 0.55;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/** Extra palette for free drawing. */
export const SWATCHES: string[] = [
  "#111827", "#6b7280", "#ffffff", "#e11d48", "#f97316", "#facc15",
  "#84cc16", "#16a34a", "#06b6d4", "#2563eb", "#7c3aed", "#9333ea",
  "#ec4899", "#92400e", "#fda4af", "#fde68a", "#a7f3d0", "#bfdbfe",
];
