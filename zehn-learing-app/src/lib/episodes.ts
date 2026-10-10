export type Scene = { visual: string; count?: number; narration: string; img?: string };

export type Episode = {
  id: string;
  title: string;
  blurb: string;
  tint: string;
  cover: string;
  scenes: Scene[];
};

export const EPISODES: Episode[] = [
  {
    id: "ep-water",
    title: "Droplet's Big Adventure",
    blurb: "Follow a tiny water drop through the amazing water cycle.",
    tint: "from-sky-400 to-blue-600",
    cover: "/images/ep-water-1.webp",
    scenes: [
      { visual: "ocean-sun", img: "/images/ep-water-1.webp", narration: "Meet Droplet! He lives in the warm blue ocean, and the big sun is shining on him." },
      { visual: "evap", img: "/images/ep-water-1.webp", narration: "The sun's heat makes Droplet feel lighter and lighter. He is turning into invisible vapor!" },
      { visual: "cloud", img: "/images/ep-water-2.webp", narration: "Up high, the air is cold. Droplet hugs millions of tiny friends, and together they become a fluffy cloud." },
      { visual: "rain", img: "/images/ep-water-2.webp", narration: "Soon the cloud is too heavy. Splash! Droplet falls back down as a raindrop." },
      { visual: "river", img: "/images/ep-water-2.webp", narration: "He flows into a river, back to the sea — ready to fly again. Water never stops moving!" },
    ],
  },
  {
    id: "ep-stars",
    title: "Luna Counts the Stars",
    blurb: "A sleepy little owl learns to count with the night sky.",
    tint: "from-indigo-500 to-purple-700",
    cover: "/images/ep-stars-1.webp",
    scenes: [
      { visual: "night", count: 0, img: "/images/ep-stars-1.webp", narration: "It is bedtime, but Luna the little owl is not sleepy. She looks up at the giant night sky." },
      { visual: "stars", count: 1, img: "/images/ep-stars-1.webp", narration: "She starts to count. One! One bright star is twinkling above the hill." },
      { visual: "stars", count: 3, img: "/images/ep-stars-1.webp", narration: "Two… three! Three stars blink hello at Luna." },
      { visual: "stars", count: 5, img: "/images/ep-stars-2.webp", narration: "Four… five! Five shining stars make a beautiful picture in the sky." },
      { visual: "moon", img: "/images/ep-stars-2.webp", narration: "Counting made the big sky feel friendly and small. Good night, Luna. Sweet dreams!" },
    ],
  },
  {
    id: "ep-gravity",
    title: "Why Things Fall Down",
    blurb: "An apple, a ball, and a rocket explain the force of gravity.",
    tint: "from-emerald-500 to-teal-700",
    cover: "/images/ep-gravity-1.webp",
    scenes: [
      { visual: "tree", img: "/images/ep-gravity-1.webp", narration: "High on a branch hangs a red apple, dreaming about the soft green grass below." },
      { visual: "apple-fall", img: "/images/ep-gravity-1.webp", narration: "Plop! The apple lets go — and falls DOWN. Never up, never sideways. Always down. Why?" },
      { visual: "earth", img: "/images/ep-gravity-2.webp", narration: "Because our Earth is like a gentle giant magnet. It pulls everything toward itself. That pull is called gravity!" },
      { visual: "ball", img: "/images/ep-gravity-1.webp", narration: "That is why your ball always comes back when you throw it up. Gravity catches it every time." },
      { visual: "rocket", img: "/images/ep-gravity-2.webp", narration: "Only a super-fast rocket can escape Earth's pull — and zoom into space! Three, two, one… blast off!" },
    ],
  }, 
];
