/* Line-art colouring pages — every region can be tapped and filled. */

export type Region = { d: string; hint?: string; n?: number };

/** A numbered colour key — "fill region 3 with colour 3". */
export type KeyColor = { n: number; hex: string; name: string };

export type ColoringPage = {
  id: string;
  title: string;
  emoji: string;
  viewBox: string;
  /** drawn first, behind the fillable regions */
  backdrop?: Region[];
  regions: Region[];
  /** numbered palette for colour-by-numbers mode */
  key?: KeyColor[];
  /** black outline strokes drawn on top */
  lines?: string[];
};

export const COLORING_PAGES: ColoringPage[] = [
  {
    id: "butterfly", title: "Butterfly", emoji: "🦋", viewBox: "0 0 200 180",
    key: [
      { n: 1, hex: "#f97316", name: "Orange" },
      { n: 2, hex: "#7c3aed", name: "Purple" },
      { n: 3, hex: "#facc15", name: "Yellow" },
      { n: 4, hex: "#ec4899", name: "Pink" },
    ],
    regions: [
      { d: "M96 90 C60 40 10 36 14 76 C18 112 62 108 96 90 Z", hint: "wing", n: 1 },
      { d: "M104 90 C140 40 190 36 186 76 C182 112 138 108 104 90 Z", hint: "wing", n: 1 },
      { d: "M96 92 C64 108 26 120 36 150 C46 176 86 148 96 112 Z", hint: "wing", n: 1 },
      { d: "M104 92 C136 108 174 120 164 150 C154 176 114 148 104 112 Z", hint: "wing", n: 1 },
      { d: "M100 44 q10 10 10 40 q0 44 -10 62 q-10 -18 -10 -62 q0 -30 10 -40z", hint: "body", n: 2 },
      { d: "M100 48 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0", hint: "head", n: 3 },
      { d: "M56 68 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0", hint: "spot", n: 4 },
      { d: "M144 68 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0", hint: "spot", n: 4 },
      { d: "M66 136 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0", hint: "spot", n: 4 },
      { d: "M134 136 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0", hint: "spot", n: 4 },
    ],
    lines: ["M100 40 q-12 -20 -26 -24", "M100 40 q12 -20 26 -24"],
  },
  {
    id: "house", title: "Little House", emoji: "🏠", viewBox: "0 0 200 180",
    key: [
      { n: 1, hex: "#fde68a", name: "Cream" },
      { n: 2, hex: "#dc2626", name: "Red" },
      { n: 3, hex: "#92400e", name: "Brown" },
      { n: 4, hex: "#38bdf8", name: "Sky blue" },
      { n: 5, hex: "#6b7280", name: "Grey" },
      { n: 6, hex: "#16a34a", name: "Green" },
      { n: 7, hex: "#facc15", name: "Yellow" },
    ],
    regions: [
      { d: "M20 160 h160 v-70 h-160 z", hint: "wall", n: 1 },
      { d: "M100 24 L190 94 H10 Z", hint: "roof", n: 2 },
      { d: "M84 160 v-52 h32 v52 z", hint: "door", n: 3 },
      { d: "M36 106 h34 v30 h-34 z", hint: "window", n: 4 },
      { d: "M130 106 h34 v30 h-34 z", hint: "window", n: 4 },
      { d: "M146 58 h18 v28 h-18 z", hint: "chimney", n: 5 },
      { d: "M0 160 h200 v20 h-200 z", hint: "ground", n: 6 },
      { d: "M100 20 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0", hint: "sun", n: 7 },
    ],
    lines: ["M53 106 v30 M36 121 h34", "M147 106 v30 M130 121 h34", "M110 134 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0"],
  },
  {
    id: "fish", title: "Happy Fish", emoji: "🐟", viewBox: "0 0 200 150",
    key: [
      { n: 1, hex: "#f97316", name: "Orange" },
      { n: 2, hex: "#ef4444", name: "Red" },
      { n: 3, hex: "#ffffff", name: "White" },
      { n: 4, hex: "#facc15", name: "Yellow" },
      { n: 5, hex: "#bae6fd", name: "Light blue" },
    ],
    regions: [
      { d: "M30 75 C30 40 80 28 120 44 C150 56 168 72 168 75 C168 78 150 94 120 106 C80 122 30 110 30 75 Z", hint: "body", n: 1 },
      { d: "M168 75 L196 50 L192 100 Z", hint: "tail", n: 2 },
      { d: "M96 48 L108 20 L126 50 Z", hint: "fin", n: 2 },
      { d: "M96 102 L108 130 L126 100 Z", hint: "fin", n: 2 },
      { d: "M62 62 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0", hint: "eye", n: 3 },
      { d: "M118 60 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0", hint: "spot", n: 4 },
      { d: "M140 88 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0", hint: "spot", n: 4 },
      { d: "M18 40 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0", hint: "bubble", n: 5 },
      { d: "M34 24 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0", hint: "bubble", n: 5 },
    ],
    lines: ["M62 62 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0", "M44 84 q12 10 24 2"],
  },
  {
    id: "flower", title: "Flower", emoji: "🌸", viewBox: "0 0 200 190",
    key: [
      { n: 1, hex: "#ec4899", name: "Pink" },
      { n: 2, hex: "#facc15", name: "Yellow" },
      { n: 3, hex: "#16a34a", name: "Green" },
    ],
    regions: [
      { d: "M100 28 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0", hint: "petal", n: 1 },
      { d: "M148 62 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0", hint: "petal", n: 1 },
      { d: "M52 62 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0", hint: "petal", n: 1 },
      { d: "M130 110 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0", hint: "petal", n: 1 },
      { d: "M70 110 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0", hint: "petal", n: 1 },
      { d: "M100 76 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0", hint: "middle", n: 2 },
      { d: "M94 120 h12 v66 h-12 z", hint: "stem", n: 3 },
      { d: "M100 148 C70 134 52 146 54 164 C68 176 92 168 100 148 Z", hint: "leaf", n: 3 },
      { d: "M100 158 C130 144 148 156 146 174 C132 186 108 178 100 158 Z", hint: "leaf", n: 3 },
    ],
  },
  {
    id: "rocket", title: "Rocket", emoji: "🚀", viewBox: "0 0 200 200",
    key: [
      { n: 1, hex: "#e2e8f0", name: "Silver" },
      { n: 2, hex: "#dc2626", name: "Red" },
      { n: 3, hex: "#64748b", name: "Grey" },
      { n: 4, hex: "#38bdf8", name: "Sky blue" },
      { n: 5, hex: "#f97316", name: "Orange" },
      { n: 6, hex: "#facc15", name: "Yellow" },
    ],
    regions: [
      { d: "M100 12 C128 44 140 86 140 124 H60 C60 86 72 44 100 12 Z", hint: "body", n: 1 },
      { d: "M60 124 L26 170 L62 156 Z", hint: "fin", n: 2 },
      { d: "M140 124 L174 170 L138 156 Z", hint: "fin", n: 2 },
      { d: "M60 124 h80 v26 h-80 z", hint: "base", n: 3 },
      { d: "M100 70 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0", hint: "window", n: 4 },
      { d: "M78 150 q22 46 44 0 q-22 24 -44 0 z", hint: "flame", n: 5 },
      { d: "M26 34 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0", hint: "star", n: 6 },
      { d: "M172 48 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0", hint: "star", n: 6 },
      { d: "M164 18 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0", hint: "star", n: 6 },
    ],
    lines: ["M100 70 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0"],
  },
  {
    id: "car", title: "Little Car", emoji: "🚗", viewBox: "0 0 220 140",
    key: [
      { n: 1, hex: "#2563eb", name: "Blue" },
      { n: 2, hex: "#bae6fd", name: "Light blue" },
      { n: 3, hex: "#1f2937", name: "Black" },
      { n: 4, hex: "#9ca3af", name: "Silver" },
      { n: 5, hex: "#facc15", name: "Yellow" },
      { n: 6, hex: "#6b7280", name: "Grey" },
    ],
    regions: [
      { d: "M18 96 C18 72 36 70 54 70 L66 42 h86 l16 28 c20 2 32 6 32 26 z", hint: "body", n: 1 },
      { d: "M74 50 h30 v20 h-42 z", hint: "window", n: 2 },
      { d: "M112 50 h32 l12 20 h-44 z", hint: "window", n: 2 },
      { d: "M60 100 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0", hint: "wheel", n: 3 },
      { d: "M164 100 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0", hint: "wheel", n: 3 },
      { d: "M60 100 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0", hint: "hub", n: 4 },
      { d: "M164 100 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0", hint: "hub", n: 4 },
      { d: "M192 78 h14 v12 h-14 z", hint: "light", n: 5 },
      { d: "M0 120 h220 v20 h-220 z", hint: "road", n: 6 },
    ],
  },
];

export const pageById = (id: string) => COLORING_PAGES.find((p) => p.id === id) ?? COLORING_PAGES[0];

/** Stickers for the creative scene builder. */
export const STICKERS: string[] = [
  "🌞", "🌈", "☁️", "⭐", "🌙", "🌸", "🌳", "🏠", "🚗", "⛵", "🚀", "🎈",
  "🦋", "🐟", "🐱", "🐶", "🐘", "🦁", "🐢", "🐰", "🦉", "🐝", "🍎", "🍌",
  "⚽", "🎸", "📚", "✏️", "🎁", "👑", "💎", "🍕",
];

/** Backdrops for the scene builder. */
export const SCENES: { id: string; name: string; css: string }[] = [
  { id: "sky", name: "Sky", css: "linear-gradient(#bae6fd,#e0f2fe 60%,#bbf7d0)" },
  { id: "space", name: "Space", css: "linear-gradient(#0f172a,#312e81)" },
  { id: "sunset", name: "Sunset", css: "linear-gradient(#fb923c,#fbbf24 55%,#fde68a)" },
  { id: "sea", name: "Sea", css: "linear-gradient(#67e8f9,#0ea5e9 60%,#1e40af)" },
  { id: "forest", name: "Forest", css: "linear-gradient(#bbf7d0,#4ade80 70%,#15803d)" },
  { id: "paper", name: "Paper", css: "linear-gradient(#ffffff,#f1f5f9)" },
];
