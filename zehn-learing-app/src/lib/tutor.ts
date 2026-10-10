/* ------------------------------------------------------------------ */
/* Lumio AI Tutor — local intelligence engine.                          */
/* Answers are composed in English and translated live by the client.   */
/* ------------------------------------------------------------------ */

export type TutorAction = { label: string; href: string };

export type TutorReply = {
  text: string;
  actions?: TutorAction[];
};

type Topic = {
  keys: string[];
  answer: string;
  link?: { lessonSubject: string; band: string };
};

const TOPICS: Topic[] = [
  {
    keys: ["fraction", "fractions", "half", "quarter"],
    link: { lessonSubject: "Math", band: "middle" },
    answer:
      "A fraction is a fair share of one whole. The bottom number counts the equal parts the whole was cut into, and the top number counts how many parts you have. Two pro tips: equivalent fractions (1/2 = 2/4) show the same amount, and to compare fractions fast, cross-multiply. Try the fractions lesson — it builds this visually.",
  },
  {
    keys: ["algebra", "solve x", "equation", "variable"],
    link: { lessonSubject: "Math", band: "high" },
    answer:
      "Algebra is detective work: a letter hides an unknown number, and an equation is your clue. The golden rule is balance — whatever you do to one side, do to the other. Undo operations in reverse order: addition first, then multiplication. If x + 3 = 7, remove 3 from both sides and x reveals itself as 4.",
  },
  {
    keys: ["quadratic", "parabola", "x²", "x^2"],
    link: { lessonSubject: "Math", band: "senior" },
    answer:
      "Quadratics (ax² + bx + c = 0) graph as parabolas — the same curve as a thrown basketball. Solve them in three passes: try factoring first, complete the square for structure, and use the quadratic formula as the universal key. The discriminant (b² − 4ac) tells you how many real roots exist before you even solve.",
  },
  {
    keys: ["multiplication", "times table", "multiply"],
    link: { lessonSubject: "Math", band: "middle" },
    answer:
      "Multiplication is fast repeated addition: 4 × 3 is 4 + 4 + 4. Learn tables as patterns, not lists — the 9s digits always sum to 9, and the 5s end in 5 or 0. Practice in Math Sprint on medium; speed comes from daily 60-second bursts.",
  },
  {
    keys: ["division", "divide", "sharing"],
    link: { lessonSubject: "Math", band: "middle" },
    answer:
      "Division is fair sharing: 12 ÷ 4 asks 'how many in each of 4 equal groups?' Multiplication and division undo each other — if 5 × 6 = 30 then 30 ÷ 5 = 6. Knowing one fact gives you the other for free.",
  },
  {
    keys: ["photosynthesis", "chlorophyll", "plants make food"],
    link: { lessonSubject: "Science", band: "high" },
    answer:
      "Photosynthesis is the plant's solar kitchen: leaves catch sunlight with green chlorophyll, roots supply water, and tiny pores called stomata take in CO₂. The plant bakes these into glucose (its food) and exhales oxygen as a bonus — every breath you take thanks a plant.",
  },
  {
    keys: ["gravity", "falling", "apple fall"],
    link: { lessonSubject: "Physics", band: "senior" },
    answer:
      "Gravity is Earth's quiet pull on everything with mass. It gives objects weight, keeps the Moon in orbit, and returns your ball after every throw. Newton's insight was realizing the same force that drops an apple also steers the planets.",
  },
  {
    keys: ["newton", "laws of motion", "inertia", "f = ma", "force"],
    link: { lessonSubject: "Physics", band: "senior" },
    answer:
      "Newton's three laws run the physical world: (1) objects keep doing what they're doing until a force interferes — inertia; (2) Force = mass × acceleration, so heavier things need bigger pushes; (3) every action has an equal opposite reaction — how rockets fly and how you walk.",
  },
  {
    keys: ["water cycle", "evaporation", "condensation", "rain"],
    link: { lessonSubject: "Science", band: "middle" },
    answer:
      "The water cycle loops Earth's water forever: the sun evaporates ocean water, cold upper air condenses the vapor into cloud droplets, heavy droplets fall as precipitation, and rivers carry it home. The water you drank today may once have been dinosaur water.",
  },
  {
    keys: ["solar system", "planet", "planets", "mars", "jupiter"],
    link: { lessonSubject: "Science", band: "middle" },
    answer:
      "Eight planets orbit our Sun: four rocky worlds near the fire (Mercury, Venus, Earth, Mars) and four giants far away (Jupiter, Saturn, Uranus, Neptune). Day and night come from Earth's 24-hour spin; seasons come from its tilted year-long orbit.",
  },
  {
    keys: ["electricity", "circuit", "current", "conductor", "insulator"],
    link: { lessonSubject: "Science", band: "high" },
    answer:
      "Electric current is electrons marching through a conductor — and they only move in a closed loop, the circuit. Copper conducts; rubber and plastic insulate (which is why wires are metal inside, plastic outside). A switch is simply a controlled break in the loop.",
  },
  {
    keys: ["chemical reaction", "chemistry", "atoms", "rust"],
    link: { lessonSubject: "Science", band: "senior" },
    answer:
      "A chemical reaction rearranges atoms into brand-new substances — rust, rising cake, fireworks. Spot one by its clues: gas bubbles, color change, heat or light, a new smell, or a precipitate. Atoms are conserved, so every equation must balance. Heat, catalysts and surface area speed reactions up.",
  },
  {
    keys: ["probability", "chance", "dice", "average"],
    link: { lessonSubject: "Math", band: "senior" },
    answer:
      "Probability = favorable outcomes ÷ total outcomes, always between 0 (impossible) and 1 (certain). A fair coin is 1/2, a die face is 1/6, an ace from 52 cards is 4/52. Data sense tip: averages summarize, but always ask what is being averaged.",
  },
  {
    keys: ["noun", "verb", "adjective", "grammar", "tense"],
    link: { lessonSubject: "English", band: "primary" },
    answer:
      "Sentence anatomy: nouns name (teacher, dog, ball), verbs act (run, read, fly), adjectives describe (big, red, shiny). Tenses time-travel your verbs — played (past), play (present), will play (future). Master these three word jobs and every sentence becomes a puzzle you can solve.",
  },
  {
    keys: ["count", "counting", "numbers"],
    link: { lessonSubject: "Numbers", band: "early" },
    answer:
      "Counting maps each object to exactly one number, in order, and the last number spoken is the total. Practice everywhere: stairs, snacks, stars. Once 1–10 is solid, try skip-counting by 2s and 5s — it quietly prepares the brain for multiplication.",
  },
  {
    keys: ["cell", "senses", "body", "human body"],
    link: { lessonSubject: "Science", band: "primary" },
    answer:
      "Your body is a collection of systems run by five senses: eyes (sight), ears (hearing), nose (smell), tongue (taste), skin (touch). They feed your brain constant information — and double as bodyguards, like snatching your hand from a hot pan before you even think.",
  },
];

const STUDY_TIPS: string[] = [
  "Study in 25-minute sprints with 5-minute breaks (the Pomodoro rhythm). Your brains consolidates memory during the pause, not just during the work.",
  "Test yourself instead of re-reading. Retrieval practice strengthens memory 2–3× more than passive review. Close the book, write what you remember, then check.",
  "Space your repetitions: review new material after 1 day, 3 days, then a week. Each well-timed review makes forgetting dramatically slower.",
  "Teach it. Explaining a topic out loud (even to an empty chair) exposes every gap in your understanding within seconds.",
  "Mix topics in one session (interleaving). It feels harder — and that desirable difficulty is exactly why it works.",
  "Sleep is a study tool. Your brain replays and files the day's learning during deep sleep, so a well-rested night beats a late-night cram.",
];

const MOTIVATION: string[] = [
  "You are not behind anyone — you are exactly where your next step starts. One finished lesson today beats a perfect plan tomorrow.",
  "Every expert you admire was once confused by the basics you are learning right now. Confusion is not weakness; it is the feeling of your brain rewiring.",
  "Progress hides in streaks. Show up for 15 focused minutes today and let the compound interest of learning do the heavy lifting.",
  "Hard problems are not walls — they are weights. Every one you lift makes the next one lighter.",
  "Your future self is being built by today's small decisions. Make one small brave attempt right now.",
];

/* ---------------- adaptive question generators -------------------- */

export type TutorSubject = "math" | "science" | "english" | "logic";

export type TutorQuestion = {
  q: string;
  options: string[];
  a: number;
  why: string;
};

const rnd = (n: number) => Math.floor(Math.random() * n) + 1;
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

function mathQ(level: number): TutorQuestion {
  const mk = (ans: number, q: string, why: string): TutorQuestion => {
    const wrong = new Set<number>();
    while (wrong.size < 2) {
      const w = ans + (rnd(6) - 3) * (rnd(2) === 1 ? 1 : -1);
      if (w !== ans) wrong.add(w);
    }
    const options = shuffle([ans, ...wrong]).map(String);
    return { q, options, a: options.indexOf(String(ans)), why };
  };
  if (level <= 2) {
    const a = rnd(9) + level * 4, b = rnd(9) + level * 3;
    return mk(a + b, `${a} + ${b} = ?`, `Add the tens first, then the ones: ${a} + ${b} = ${a + b}.`);
  }
  if (level <= 4) {
    const a = rnd(10) + 2, b = rnd(10) + 2;
    return mk(a * b, `${a} × ${b} = ?`, `${a} × ${b} means ${b} groups of ${a}: ${a * b}.`);
  }
  if (level <= 6) {
    const b = rnd(9) + 3, ans = rnd(9) + 3;
    return mk(ans, `${b * ans} ÷ ${b} = ?`, `Division undoes multiplication: ${b * ans} shares into groups of ${b}, so each is ${ans}.`);
  }
  const x = rnd(8) + 4, add = rnd(12) + 4;
  return mk(x, `If n + ${add} = ${x + add}, what is n?`, `Balance the scale: subtract ${add} from both sides to reveal n = ${x}.`);
}

const SCIENCE_BANK: TutorQuestion[] = [
  { q: "Which gas do plants release during photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen"], a: 0, why: "Photosynthesis converts CO₂ and water into glucose and releases oxygen." },
  { q: "What force keeps the Moon orbiting Earth?", options: ["Magnetism", "Friction", "Gravity"], a: 2, why: "Gravity — the same pull that drops an apple — steers the Moon." },
  { q: "Water vapor turning into cloud droplets is called…", options: ["Evaporation", "Condensation", "Precipitation"], a: 1, why: "Cooling vapor condenses into tiny droplets that form clouds." },
  { q: "Which of these is an electrical insulator?", options: ["Copper", "Rubber", "Iron"], a: 1, why: "Rubber blocks electron flow — that is why wires are coated in it." },
  { q: "How many planets orbit our Sun?", options: ["7", "8", "9"], a: 1, why: "Eight: four rocky inner planets and four outer giants." },
  { q: "F = ma is Newton's…", options: ["First law", "Second law", "Third law"], a: 1, why: "The second law: force equals mass times acceleration." },
  { q: "The green pigment that catches sunlight in leaves is…", options: ["Chlorophyll", "Glucose", "Stomata"], a: 0, why: "Chlorophyll absorbs light energy to power photosynthesis." },
  { q: "In a balanced chemical equation, atoms are…", options: ["Created", "Destroyed", "Conserved"], a: 2, why: "Atoms rearrange but never vanish — a core law of chemistry." },
];

const ENGLISH_BANK: TutorQuestion[] = [
  { q: "Which word is a verb?", options: ["Table", "Jump", "Blue"], a: 1, why: "Verbs are action words — jump describes an action." },
  { q: "'She ___ to school every day.'", options: ["go", "goes", "going"], a: 1, why: "Third-person singular present tense takes 'goes'." },
  { q: "Which is an adjective?", options: ["Quickly", "Brave", "Run"], a: 1, why: "Adjectives describe nouns — brave describes a person." },
  { q: "A plural of 'child' is…", options: ["Childs", "Children", "Childes"], a: 1, why: "Child has an irregular plural: children." },
  { q: "The past tense of 'teach' is…", options: ["Teached", "Taught", "Teachen"], a: 1, why: "Teach is irregular: teach → taught." },
  { q: "Which sentence is punctuated correctly?", options: ["wow what a game", "Wow, what a game!", "Wow what, a game!"], a: 1, why: "Capitalize the start, pause with a comma, close with an exclamation." },
  { q: "A word that joins sentences, like 'and' or 'but', is a…", options: ["Pronoun", "Conjunction", "Adverb"], a: 1, why: "Conjunctions connect clauses and ideas." },
  { q: "'Their, there and they're' — pick the possessive one.", options: ["Their", "There", "They're"], a: 0, why: "'Their' shows ownership; 'there' is a place; 'they're' is they are." },
];

const LOGIC_BANK: TutorQuestion[] = [
  { q: "What comes next: 2, 4, 8, 16, …?", options: ["24", "32", "20"], a: 1, why: "Each term doubles: 16 × 2 = 32." },
  { q: "What comes next: 1, 1, 2, 3, 5, 8, …?", options: ["11", "12", "13"], a: 2, why: "Fibonacci: each term is the sum of the two before it — 5 + 8 = 13." },
  { q: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely…", options: ["Lazzies", "Razzies only", "Neither"], a: 0, why: "Transitivity: Bloop → Razzie → Lazzie." },
  { q: "What comes next: 99, 90, 81, 72, …?", options: ["64", "63", "65"], a: 1, why: "Subtract 9 each step: 72 − 9 = 63." },
  { q: "A bat and ball cost $1.10. The bat costs $1 more than the ball. The ball costs…", options: ["$0.10", "$0.05", "$0.15"], a: 1, why: "$0.05 + $1.05 = $1.10 — the classic intuition trap." },
  { q: "Odd one out: 3, 5, 7, 9, 11", options: ["3", "9", "11"], a: 1, why: "9 is the only non-prime in the list." },
];

export function genTutorQuestion(subject: TutorSubject, level: number): TutorQuestion {
  if (subject === "math") return mathQ(level);
  const bank = subject === "science" ? SCIENCE_BANK : subject === "english" ? ENGLISH_BANK : LOGIC_BANK;
  const q = { ...bank[rnd(bank.length) - 1] };
  const correct = q.options[q.a];
  const options = shuffle(q.options);
  return { ...q, options, a: options.indexOf(correct) };
}

/* ------------------------------ engine ---------------------------- */

function scoreTopic(input: string, topic: Topic): number {
  let score = 0;
  const lower = input.toLowerCase();
  for (const key of topic.keys) {
    if (lower.includes(key)) score += key.length + 2;
  }
  // whole-word bonus
  for (const word of lower.split(/[^a-z²^]+/)) {
    if (word.length > 2 && topic.keys.some((k) => k === word)) score += 4;
  }
  return score;
}

export function produceReply(
  input: string,
  ctx: { name: string; gradeBandLabel: string }
): TutorReply {
  const lower = input.toLowerCase().trim();

  const cmd = (c: string) => lower === c;

  if (cmd("__tips__")) {
    const tips = shuffle(STUDY_TIPS).slice(0, 3);
    return {
      text: `Here are three evidence-based study techniques, ${ctx.name}:\n\n1. ${tips[0]}\n2. ${tips[1]}\n3. ${tips[2]}\n\nThe studies behind these are some of the strongest findings in learning science.`,
    };
  }

  if (cmd("__motive__")) {
    return { text: shuffle(MOTIVATION)[0] };
  }

  if (cmd("__plan__")) {
    return {
      text: `Here is a research-backed plan for today:\n\n1. One animated lesson from your ${ctx.gradeBandLabel} syllabus — watch it with the narrator on.\n2. Immediately take its quiz. Retrieval right after learning doubles retention.\n3. One brain-gym game at your current difficulty — push one level higher than yesterday if you can.\n4. Photograph today's diary page and work the 5-step plan.\n5. Tonight, spend 3 minutes recalling what you learned — no notes. Sleep does the rest.`,
      actions: [
        { label: "Open lessons", href: "/learn" },
        { label: "Brain gym", href: "/games" },
        { label: "Diary AI", href: "/diary" },
      ],
    };
  }

  if (cmd("__help__") || lower.includes("what can you do") || lower.includes("help")) {
    return {
      text: `I can do four things really well:\n\n1. Explain school topics clearly — try "explain fractions" or "what is gravity".\n2. Quiz you adaptively — I raise the difficulty every time you answer correctly.\n3. Share proven study techniques.\n4. Build your daily learning plan.\n\nJust ask in plain words, like a friend.`,
    };
  }

  if (/^(hi|hello|hey|namaste|hola|salut|yo)\b/.test(lower)) {
    return {
      text: `Hey ${ctx.name}! Ready when you are. Ask me to explain any topic, or say "quiz me" and I will adapt the difficulty to your answers.`,
    };
  }

  if (lower.includes("thank")) {
    return { text: "Anytime. Consistency is your superpower — ask me something harder next." };
  }

  if (lower.includes("exam") || lower.includes("test tomorrow") || lower.includes("prepare")) {
    return {
      text: "Exam strategy that actually works: (1) Skim the whole syllabus first and mark weak spots — study those first, not your favorites. (2) Do active recall: answer questions from memory before re-reading anything. (3) Solve under a timer. (4) The night before, sleep on time — memory consolidates during deep sleep and outweighs any last cram. Tell me a topic and I will quiz you on it right now.",
    };
  }

  // topic matching
  let best: Topic | null = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const s = scoreTopic(lower, topic);
    if (s > bestScore) {
      bestScore = s;
      best = topic;
    }
  }

  if (best && bestScore >= 5) {
    const actions: TutorAction[] = [];
    return { text: best.answer, actions };
  }

  // graceful fallback
  return {
    text: `Good question, ${ctx.name}. I do not have a crisp answer for that one yet — but here is how we can attack it together: (1) break it into smaller questions and ask me one at a time; (2) check the ${ctx.gradeBandLabel} lessons for the closest topic; (3) snap the textbook page in Diary AI and let it build you a plan.\n\nOr say "quiz me" and let me sharpen your thinking.`,
    actions: [
      { label: "Browse lessons", href: "/learn" },
      { label: "Diary AI", href: "/diary" },
    ],
  };
}

export const TUTOR_GREETING = (name: string) =>
  `Hey ${name}, I'm your AI tutor. I can explain any topic, drill you with adaptive quizzes, share study science, or plan your day.\n\nTry the quick actions below — or just type a question.`;

export const TUTOR_QUIZ_INTRO =
  "Challenge accepted. I will raise the difficulty every two correct answers. Pick a subject to begin:";
