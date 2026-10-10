/* ------------------------------------------------------------------ */
/* Zehn Brain Arcade — 20 distinct picture-based games                  */
/* Every game has its own mechanic, content pool, scoring and hints.    */
/* ------------------------------------------------------------------ */

export type Tile = { label?: string; emoji?: string; color?: string };

export type Round =
  | { kind: "pick"; prompt: string; spoken: string; display: Tile[]; options: Tile[]; answer: number; why?: string }
  | { kind: "pattern"; prompt: string; spoken: string; seq: Tile[]; options: Tile[]; answer: number }
  | { kind: "memory"; prompt: string; spoken: string; pairs: Tile[] }
  | { kind: "sequence"; prompt: string; spoken: string; steps: number[]; palette: Tile[] }
  | { kind: "reaction"; prompt: string; spoken: string; target: Tile; decoys: Tile[] }
  | { kind: "build"; prompt: string; spoken: string; word: string; clue: string; emoji: string }
  | { kind: "order"; prompt: string; spoken: string; items: { label: string; value: number; emoji?: string }[]; ascending: boolean }
  | { kind: "sort"; prompt: string; spoken: string; item: Tile; bins: Tile[]; answer: number };

export type EngineKind = Round["kind"];

export type GameDef = {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  skill: string;
  engine: EngineKind;
  minGrade: number;
  maxGrade: number;
  rounds: number;
  lives: number;
  tint: string;
  make: (level: number) => Round;
};

/* --------------------------- content pools ------------------------ */

type Animal = { e: string; n: string; sound: string; home: "Land" | "Water" | "Sky" };

export const ANIMALS: Animal[] = [
  { e: "🐶", n: "Dog", sound: "Woof", home: "Land" },
  { e: "🐱", n: "Cat", sound: "Meow", home: "Land" },
  { e: "🐮", n: "Cow", sound: "Moo", home: "Land" },
  { e: "🐑", n: "Sheep", sound: "Baa", home: "Land" },
  { e: "🐴", n: "Horse", sound: "Neigh", home: "Land" },
  { e: "🦁", n: "Lion", sound: "Roar", home: "Land" },
  { e: "🐘", n: "Elephant", sound: "Trumpet", home: "Land" },
  { e: "🐒", n: "Monkey", sound: "Ooh ooh", home: "Land" },
  { e: "🐸", n: "Frog", sound: "Ribbit", home: "Water" },
  { e: "🐟", n: "Fish", sound: "Blub", home: "Water" },
  { e: "🐬", n: "Dolphin", sound: "Click", home: "Water" },
  { e: "🐙", n: "Octopus", sound: "Silent", home: "Water" },
  { e: "🦆", n: "Duck", sound: "Quack", home: "Water" },
  { e: "🐦", n: "Bird", sound: "Tweet", home: "Sky" },
  { e: "🦅", n: "Eagle", sound: "Screech", home: "Sky" },
  { e: "🦋", n: "Butterfly", sound: "Silent", home: "Sky" },
  { e: "🐝", n: "Bee", sound: "Buzz", home: "Sky" },
  { e: "🦉", n: "Owl", sound: "Hoot", home: "Sky" },
];

const FRUITS = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🥝", "🍍"];
const VEHICLES = ["🚗", "🚌", "🚲", "✈️", "🚂", "🚀", "⛵", "🚜"];
const SHAPES: Tile[] = [
  { emoji: "🔴", label: "Circle" }, { emoji: "🟦", label: "Square" },
  { emoji: "🔺", label: "Triangle" }, { emoji: "⭐", label: "Star" },
  { emoji: "💚", label: "Heart" }, { emoji: "🟧", label: "Orange square" },
];
const COLORS: Tile[] = [
  { label: "Red", color: "#ef4444" }, { label: "Blue", color: "#3b82f6" },
  { label: "Green", color: "#22c55e" }, { label: "Yellow", color: "#eab308" },
  { label: "Purple", color: "#a855f7" }, { label: "Orange", color: "#f97316" },
];

const WORDS_EASY = ["CAT", "SUN", "DOG", "BOX", "CUP", "HAT", "BUS", "EGG"];
const WORDS_MID = ["TIGER", "PLANT", "RIVER", "HOUSE", "BREAD", "CLOUD", "MONEY", "SMILE"];
const WORDS_HARD = ["ELEPHANT", "COMPUTER", "MOUNTAIN", "LIBRARY", "JOURNEY", "GRAVITY"];

const OPPOSITES: [string, string][] = [
  ["Hot", "Cold"], ["Big", "Small"], ["Fast", "Slow"], ["Day", "Night"],
  ["Up", "Down"], ["Happy", "Sad"], ["Open", "Closed"], ["Full", "Empty"],
  ["Hard", "Soft"], ["Light", "Heavy"],
];

const RIDDLES: { q: string; options: string[]; a: number; why: string }[] = [
  { q: "2, 4, 8, 16 — what comes next?", options: ["24", "32", "20"], a: 1, why: "Each number doubles, so 16 × 2 = 32." },
  { q: "All roses are flowers. This is a rose. So it is…", options: ["A flower", "A tree", "Not a flower"], a: 0, why: "If every rose is a flower, any rose must be one." },
  { q: "1, 1, 2, 3, 5, 8 — what comes next?", options: ["11", "13", "12"], a: 1, why: "Add the last two: 5 + 8 = 13." },
  { q: "A farmer has 7 sheep; all but 3 run away. How many stay?", options: ["3", "4", "7"], a: 0, why: "'All but 3' means exactly 3 remain." },
  { q: "Which is heaviest: 1 kg iron, 1 kg cotton, or equal?", options: ["Iron", "Cotton", "Equal"], a: 2, why: "Both are one kilogram — the mass is identical." },
  { q: "99, 90, 81, 72 — what comes next?", options: ["65", "63", "66"], a: 1, why: "Subtract 9 each time: 72 − 9 = 63." },
  { q: "If today is Tuesday, what day is in 3 days?", options: ["Thursday", "Friday", "Saturday"], a: 1, why: "Tue → Wed → Thu → Fri." },
  { q: "Odd one out: 3, 5, 9, 11", options: ["5", "9", "11"], a: 1, why: "9 = 3 × 3, the only non-prime." },
];

const SCIENCE: { q: string; options: string[]; a: number; why: string }[] = [
  { q: "Which gas do plants release in sunlight?", options: ["Oxygen", "Carbon dioxide", "Helium"], a: 0, why: "Photosynthesis releases oxygen as a by-product." },
  { q: "Water boils at…", options: ["50°C", "100°C", "150°C"], a: 1, why: "At sea level water boils at 100 degrees Celsius." },
  { q: "The force pulling things down is…", options: ["Gravity", "Friction", "Magnetism"], a: 0, why: "Gravity attracts mass toward Earth's centre." },
  { q: "Which organ pumps blood?", options: ["Lungs", "Heart", "Liver"], a: 1, why: "The heart pumps blood around the body." },
  { q: "Sound travels fastest through…", options: ["Steel", "Air", "Vacuum"], a: 0, why: "Denser solids carry vibrations faster; vacuum carries none." },
  { q: "Which planet is called the Red Planet?", options: ["Venus", "Mars", "Jupiter"], a: 1, why: "Iron oxide dust makes Mars look red." },
  { q: "An electrical insulator is…", options: ["Copper", "Rubber", "Iron"], a: 1, why: "Rubber blocks the flow of electrons." },
  { q: "Humans breathe in mainly…", options: ["Oxygen", "Nitrogen gas for energy", "Carbon dioxide"], a: 0, why: "We use oxygen for respiration." },
];

/* ----------------------------- helpers ---------------------------- */

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(arr: T[]) => arr[rnd(arr.length)];
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
const sample = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n);

function options<T>(correct: T, pool: T[], n = 3): { list: T[]; index: number } {
  const others = shuffle(pool.filter((x) => x !== correct)).slice(0, n - 1);
  const list = shuffle([correct, ...others]);
  return { list, index: list.indexOf(correct) };
}

/* ------------------------------ games ----------------------------- */

export const GAMES: GameDef[] = [
  {
    id: "animal-memory", title: "Animal Memory", desc: "Flip the cards and find matching animal pairs.",
    emoji: "🐘", skill: "Memory", engine: "memory", minGrade: 0, maxGrade: 6,
    rounds: 1, lives: 99, tint: "from-indigo-500 to-violet-600",
    make: (level) => {
      const count = level <= 1 ? 4 : level <= 3 ? 6 : 8;
      return {
        kind: "memory",
        prompt: "Find every matching pair of animals",
        spoken: "Find every matching pair of animals.",
        pairs: sample(ANIMALS, count).map((a) => ({ emoji: a.e, label: a.n })),
      };
    },
  },
  {
    id: "count-animals", title: "Count the Animals", desc: "Count how many animals are hiding in the field.",
    emoji: "🐑", skill: "Counting", engine: "pick", minGrade: 0, maxGrade: 3,
    rounds: 8, lives: 3, tint: "from-emerald-500 to-teal-600",
    make: (level) => {
      const animal = pick(ANIMALS);
      const max = level <= 1 ? 5 : level <= 3 ? 9 : 14;
      const n = rnd(max) + 1;
      const pool = Array.from({ length: max + 2 }, (_, i) => i + 1);
      const { list, index } = options(n, pool);
      return {
        kind: "pick",
        prompt: `How many ${animal.n.toLowerCase()}s do you see?`,
        spoken: `How many ${animal.n.toLowerCase()}s do you see?`,
        display: Array.from({ length: n }, () => ({ emoji: animal.e })),
        options: list.map((v) => ({ label: String(v) })),
        answer: index,
        why: `There are ${n}.`,
      };
    },
  },
  {
    id: "animal-sounds", title: "Who Says That?", desc: "Hear the sound and tap the animal that makes it.",
    emoji: "🔊", skill: "Listening", engine: "pick", minGrade: 0, maxGrade: 3,
    rounds: 8, lives: 3, tint: "from-amber-500 to-orange-600",
    make: () => {
      const pool = ANIMALS.filter((a) => a.sound !== "Silent");
      const target = pick(pool);
      const { list, index } = options(target, pool);
      return {
        kind: "pick",
        prompt: `Which animal says "${target.sound}"?`,
        spoken: `Which animal says ${target.sound}?`,
        display: [],
        options: list.map((a) => ({ emoji: a.e, label: a.n })),
        answer: index,
        why: `The ${target.n.toLowerCase()} says ${target.sound}.`,
      };
    },
  },
  {
    id: "shape-pattern", title: "Shape Patterns", desc: "Study the blue pattern, then pick the orange answer.",
    emoji: "🔺", skill: "Logic", engine: "pattern", minGrade: 0, maxGrade: 7,
    rounds: 8, lives: 3, tint: "from-sky-500 to-blue-600",
    make: (level) => {
      const palette = sample(SHAPES, level >= 4 ? 3 : 2);
      const [A, B, C] = [palette[0], palette[1], palette[2] ?? palette[0]];
      const patterns = level >= 4
        ? [{ s: [A, B, C, A, B], a: C }, { s: [A, A, B, A, A], a: B }, { s: [A, B, B, C, A, B], a: B }]
        : [{ s: [A, B, A, B], a: A }, { s: [A, A, B, B], a: A }, { s: [A, B, B, A, B], a: B }];
      const p = pick(patterns);
      const { list, index } = options(p.a, SHAPES);
      return {
        kind: "pattern",
        prompt: "What comes next in the pattern?",
        spoken: "Look at the pattern. What comes next?",
        seq: p.s,
        options: list,
        answer: index,
      };
    },
  },
  {
    id: "odd-one-out", title: "Odd One Out", desc: "One picture does not belong with the others.",
    emoji: "🧐", skill: "Reasoning", engine: "pick", minGrade: 1, maxGrade: 12,
    rounds: 8, lives: 3, tint: "from-rose-500 to-pink-600",
    make: (level) => {
      const groups = [
        { set: ANIMALS.filter((a) => a.home === "Water").map((a) => a.e), odd: pick(FRUITS), why: "The others all live in water." },
        { set: FRUITS, odd: pick(VEHICLES), why: "The others are all fruits." },
        { set: VEHICLES, odd: pick(ANIMALS).e, why: "The others are all vehicles." },
        { set: ANIMALS.filter((a) => a.home === "Sky").map((a) => a.e), odd: pick(VEHICLES), why: "The others all fly by themselves." },
      ];
      const g = pick(groups);
      const keep = sample(g.set, level >= 3 ? 3 : 2);
      const list = shuffle([...keep.map((e) => ({ emoji: e })), { emoji: g.odd }]);
      return {
        kind: "pick",
        prompt: "Which one does not belong?",
        spoken: "Which one does not belong?",
        display: [],
        options: list,
        answer: list.findIndex((o) => o.emoji === g.odd),
        why: g.why,
      };
    },
  },
  {
    id: "big-small", title: "Bigger or Smaller", desc: "Pick the group that has more things in it.",
    emoji: "⚖️", skill: "Comparing", engine: "pick", minGrade: 0, maxGrade: 4,
    rounds: 8, lives: 3, tint: "from-violet-500 to-purple-600",
    make: (level) => {
      const max = level <= 2 ? 6 : 12;
      let a = rnd(max) + 1;
      let b = rnd(max) + 1;
      while (a === b) b = rnd(max) + 1;
      const wantMore = Math.random() > 0.5;
      const e1 = pick(FRUITS), e2 = pick(ANIMALS).e;
      const list = [
        { label: `${a}`, emoji: e1.repeat(Math.min(a, 6)) },
        { label: `${b}`, emoji: e2.repeat(Math.min(b, 6)) },
      ];
      const correct = wantMore ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
      return {
        kind: "pick",
        prompt: wantMore ? "Which side has MORE?" : "Which side has FEWER?",
        spoken: wantMore ? "Which side has more?" : "Which side has fewer?",
        display: [],
        options: list,
        answer: correct,
        why: `${a} and ${b} — ${wantMore ? Math.max(a, b) : Math.min(a, b)} wins.`,
      };
    },
  },
  {
    id: "color-rush", title: "Colour Rush", desc: "Tap the colour the word is asking for.",
    emoji: "🎨", skill: "Focus", engine: "pick", minGrade: 0, maxGrade: 3,
    rounds: 10, lives: 3, tint: "from-pink-500 to-rose-600",
    make: () => {
      const target = pick(COLORS);
      const { list, index } = options(target, COLORS, 4);
      return {
        kind: "pick",
        prompt: `Tap the colour ${target.label}`,
        spoken: `Tap the colour ${target.label}.`,
        display: [],
        options: list,
        answer: index,
      };
    },
  },
  {
    id: "word-builder", title: "Word Builder", desc: "Tap the letters in order to spell the picture.",
    emoji: "🔤", skill: "Spelling", engine: "build", minGrade: 2, maxGrade: 12,
    rounds: 6, lives: 3, tint: "from-teal-500 to-emerald-600",
    make: (level) => {
      const pool = level <= 2 ? WORDS_EASY : level <= 4 ? WORDS_MID : WORDS_HARD;
      const word = pick(pool);
      const animal = ANIMALS.find((a) => a.n.toUpperCase() === word);
      return {
        kind: "build",
        prompt: "Spell the word",
        spoken: "Build the word from the letters.",
        word,
        clue: `${word.length} letters`,
        emoji: animal?.e ?? "📝",
      };
    },
  },
  {
    id: "missing-letter", title: "Missing Letter", desc: "One letter ran away — put it back.",
    emoji: "🧩", skill: "Spelling", engine: "pick", minGrade: 1, maxGrade: 6,
    rounds: 8, lives: 3, tint: "from-cyan-500 to-sky-600",
    make: (level) => {
      const animal = pick(ANIMALS);
      const word = animal.n.toUpperCase();
      const idx = rnd(word.length);
      const missing = word[idx];
      const shown = word.split("").map((c, i) => (i === idx ? "_" : c)).join(" ");
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const { list, index } = options(missing, letters, level >= 3 ? 4 : 3);
      return {
        kind: "pick",
        prompt: `${animal.e}   ${shown}`,
        spoken: `Which letter is missing from ${animal.n}?`,
        display: [],
        options: list.map((l) => ({ label: l })),
        answer: index,
        why: `The word is ${word}.`,
      };
    },
  },
  {
    id: "math-sprint", title: "Math Sprint", desc: "Solve as many as you can before lives run out.",
    emoji: "➗", skill: "Numbers", engine: "pick", minGrade: 1, maxGrade: 12,
    rounds: 10, lives: 3, tint: "from-amber-500 to-yellow-600",
    make: (level) => {
      let text = "", ans = 0;
      if (level <= 1) { const a = rnd(9) + 1, b = rnd(9) + 1; text = `${a} + ${b}`; ans = a + b; }
      else if (level <= 2) { const a = rnd(20) + 5, b = rnd(15) + 2; text = `${a} - ${b}`; ans = a - b; }
      else if (level <= 3) { const a = rnd(10) + 2, b = rnd(9) + 2; text = `${a} × ${b}`; ans = a * b; }
      else if (level <= 4) { const b = rnd(8) + 2, q = rnd(9) + 2; text = `${b * q} ÷ ${b}`; ans = q; }
      else { const a = rnd(12) + 4; text = `${a}²`; ans = a * a; }
      const pool = Array.from({ length: 12 }, (_, i) => ans + i - 5).filter((v) => v !== ans && v >= 0);
      const { list, index } = options(ans, pool);
      return {
        kind: "pick",
        prompt: `${text} = ?`,
        spoken: `What is ${text.replace("×", "times").replace("÷", "divided by").replace("²", " squared")}?`,
        display: [],
        options: list.map((v) => ({ label: String(v) })),
        answer: index,
        why: `${text} = ${ans}.`,
      };
    },
  },
  {
    id: "number-order", title: "Number Ladder", desc: "Tap the numbers from smallest to largest.",
    emoji: "🪜", skill: "Ordering", engine: "order", minGrade: 1, maxGrade: 9,
    rounds: 6, lives: 3, tint: "from-lime-500 to-green-600",
    make: (level) => {
      const n = level <= 2 ? 4 : 5;
      const max = level <= 2 ? 20 : level <= 4 ? 99 : 500;
      const values = new Set<number>();
      while (values.size < n) values.add(rnd(max) + 1);
      const ascending = level <= 3 ? true : Math.random() > 0.5;
      return {
        kind: "order",
        prompt: ascending ? "Tap from smallest to largest" : "Tap from largest to smallest",
        spoken: ascending ? "Tap the numbers from smallest to largest." : "Tap the numbers from largest to smallest.",
        items: shuffle([...values]).map((v) => ({ label: String(v), value: v })),
        ascending,
      };
    },
  },
  {
    id: "simon-sequence", title: "Echo Sequence", desc: "Watch the animals light up, then repeat the order.",
    emoji: "✨", skill: "Working memory", engine: "sequence", minGrade: 1, maxGrade: 12,
    rounds: 8, lives: 3, tint: "from-fuchsia-500 to-purple-600",
    make: (level) => {
      const palette = sample(ANIMALS, 4).map((a) => ({ emoji: a.e, label: a.n }));
      const len = Math.min(8, 2 + level);
      return {
        kind: "sequence",
        prompt: "Repeat the sequence",
        spoken: "Watch carefully, then repeat the sequence.",
        steps: Array.from({ length: len }, () => rnd(4)),
        palette,
      };
    },
  },
  {
    id: "spot-change", title: "Spot the Stranger", desc: "Every picture is the same — except one.",
    emoji: "🔍", skill: "Attention", engine: "pick", minGrade: 2, maxGrade: 12,
    rounds: 8, lives: 3, tint: "from-orange-500 to-red-600",
    make: (level) => {
      const base = pick(ANIMALS).e;
      let other = pick(ANIMALS).e;
      while (other === base) other = pick(ANIMALS).e;
      const n = level <= 2 ? 6 : level <= 4 ? 9 : 12;
      const pos = rnd(n);
      const list = Array.from({ length: n }, (_, i) => ({ emoji: i === pos ? other : base }));
      return {
        kind: "pick",
        prompt: "Tap the one that is different",
        spoken: "Tap the picture that is different from the rest.",
        display: [],
        options: list,
        answer: pos,
      };
    },
  },
  {
    id: "habitat-sort", title: "Where Do I Live?", desc: "Send each animal to land, water or sky.",
    emoji: "🏞️", skill: "Classifying", engine: "sort", minGrade: 0, maxGrade: 6,
    rounds: 8, lives: 3, tint: "from-green-500 to-emerald-600",
    make: () => {
      const animal = pick(ANIMALS);
      const bins: Tile[] = [
        { label: "Land", emoji: "🌳" },
        { label: "Water", emoji: "🌊" },
        { label: "Sky", emoji: "☁️" },
      ];
      return {
        kind: "sort",
        prompt: `Where does the ${animal.n.toLowerCase()} live?`,
        spoken: `Where does the ${animal.n.toLowerCase()} live?`,
        item: { emoji: animal.e, label: animal.n },
        bins,
        answer: bins.findIndex((b) => b.label === animal.home),
      };
    },
  },
  {
    id: "opposites", title: "Opposite Day", desc: "Find the word that means the opposite.",
    emoji: "🔁", skill: "Vocabulary", engine: "pick", minGrade: 2, maxGrade: 12,
    rounds: 8, lives: 3, tint: "from-blue-500 to-indigo-600",
    make: () => {
      const [a, b] = pick(OPPOSITES);
      const flip = Math.random() > 0.5;
      const word = flip ? b : a;
      const answer = flip ? a : b;
      const pool = OPPOSITES.flat().filter((w) => w !== word && w !== answer);
      const { list, index } = options(answer, pool);
      return {
        kind: "pick",
        prompt: `What is the opposite of "${word}"?`,
        spoken: `What is the opposite of ${word}?`,
        display: [],
        options: list.map((l) => ({ label: l })),
        answer: index,
        why: `${word} ↔ ${answer}.`,
      };
    },
  },
  {
    id: "lightning-tap", title: "Lightning Tap", desc: "Tap the target animal the moment it appears.",
    emoji: "⚡", skill: "Reflex", engine: "reaction", minGrade: 0, maxGrade: 12,
    rounds: 6, lives: 3, tint: "from-yellow-500 to-amber-600",
    make: (level) => {
      const target = pick(ANIMALS);
      const decoyPool = ANIMALS.filter((a) => a.e !== target.e);
      return {
        kind: "reaction",
        prompt: `Tap only the ${target.n.toLowerCase()}`,
        spoken: `Tap only the ${target.n.toLowerCase()}. Wait for it.`,
        target: { emoji: target.e, label: target.n },
        decoys: sample(decoyPool, Math.min(5, 2 + level)).map((a) => ({ emoji: a.e, label: a.n })),
      };
    },
  },
  {
    id: "shadow-match", title: "Shadow Match", desc: "Match the dark shadow to the real animal.",
    emoji: "🫥", skill: "Visual", engine: "pick", minGrade: 0, maxGrade: 5,
    rounds: 8, lives: 3, tint: "from-slate-500 to-slate-700",
    make: () => {
      const target = pick(ANIMALS);
      const { list, index } = options(target, ANIMALS);
      return {
        kind: "pick",
        prompt: "Which animal makes this shadow?",
        spoken: "Which animal makes this shadow?",
        display: [{ emoji: target.e, color: "shadow" }],
        options: list.map((a) => ({ emoji: a.e, label: a.n })),
        answer: index,
        why: `It is the ${target.n.toLowerCase()}.`,
      };
    },
  },
  {
    id: "fraction-pizza", title: "Fraction Pizza", desc: "Read the shaded slices as a fraction.",
    emoji: "🍕", skill: "Fractions", engine: "pick", minGrade: 4, maxGrade: 12,
    rounds: 8, lives: 3, tint: "from-red-500 to-orange-600",
    make: (level) => {
      const denom = pick(level <= 3 ? [2, 4] : [3, 4, 5, 6, 8]);
      const num = rnd(denom - 1) + 1;
      const correct = `${num}/${denom}`;
      const pool = new Set<string>([correct]);
      while (pool.size < 4) {
        const d = pick([2, 3, 4, 5, 6, 8]);
        const n = rnd(d - 1) + 1;
        pool.add(`${n}/${d}`);
      }
      const list = shuffle([...pool]).slice(0, 3);
      if (!list.includes(correct)) list[0] = correct;
      const final = shuffle(list);
      return {
        kind: "pick",
        prompt: "What fraction is filled?",
        spoken: "What fraction of the pizza is filled?",
        display: Array.from({ length: denom }, (_, i) => ({
          emoji: i < num ? "🍕" : "⬜",
        })),
        options: final.map((f) => ({ label: f })),
        answer: final.indexOf(correct),
        why: `${num} of ${denom} slices are filled.`,
      };
    },
  },
  {
    id: "logic-riddle", title: "Logic Riddles", desc: "Short puzzles that stretch your reasoning.",
    emoji: "🧠", skill: "Logic", engine: "pick", minGrade: 5, maxGrade: 12,
    rounds: 8, lives: 3, tint: "from-purple-500 to-indigo-700",
    make: () => {
      const r = pick(RIDDLES);
      const correct = r.options[r.a];
      const list = shuffle(r.options);
      return {
        kind: "pick",
        prompt: r.q,
        spoken: r.q,
        display: [],
        options: list.map((o) => ({ label: o })),
        answer: list.indexOf(correct),
        why: r.why,
      };
    },
  },
  {
    id: "science-lab", title: "Science Lab", desc: "Quick-fire science questions with explanations.",
    emoji: "🔬", skill: "Science", engine: "pick", minGrade: 6, maxGrade: 12,
    rounds: 8, lives: 3, tint: "from-emerald-500 to-cyan-600",
    make: () => {
      const s = pick(SCIENCE);
      const correct = s.options[s.a];
      const list = shuffle(s.options);
      return {
        kind: "pick",
        prompt: s.q,
        spoken: s.q,
        display: [],
        options: list.map((o) => ({ label: o })),
        answer: list.indexOf(correct),
        why: s.why,
      };
    },
  },
];

export const gameById = (id: string) => GAMES.find((g) => g.id === id);

export function gamesForGrade(grade: number) {
  return GAMES.filter((g) => grade >= g.minGrade && grade <= g.maxGrade);
}

/** Starting difficulty 1..5 derived from the learner's class. */
export function levelForGrade(grade: number) {
  if (grade <= 0) return 1;
  if (grade <= 2) return 1;
  if (grade <= 4) return 2;
  if (grade <= 6) return 3;
  if (grade <= 9) return 4;
  return 5;
}
