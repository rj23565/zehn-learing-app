"use client";

import { Bird, Bug, Cat, Dog, Fish, Panda, Rabbit, Snail, Squirrel, Turtle, type LucideIcon } from "lucide-react";

export const AVATARS: { id: string; icon: LucideIcon; bg: string }[] = [
  { id: "owl", icon: Bird, bg: "from-violet-500 to-fuchsia-500" },
  { id: "rabbit", icon: Rabbit, bg: "from-pink-400 to-rose-500" },
  { id: "cat", icon: Cat, bg: "from-amber-400 to-orange-500" },
  { id: "dog", icon: Dog, bg: "from-sky-400 to-blue-600" },
  { id: "panda", icon: Panda, bg: "from-slate-500 to-slate-800" },
  { id: "bug", icon: Bug, bg: "from-indigo-400 to-indigo-700" },
  { id: "turtle", icon: Turtle, bg: "from-emerald-400 to-teal-600" },
  { id: "snail", icon: Snail, bg: "from-yellow-400 to-amber-600" },
  { id: "fish", icon: Fish, bg: "from-cyan-400 to-sky-600" },
  { id: "squirrel", icon: Squirrel, bg: "from-orange-400 to-red-500" },
];

export function Avatar({ id, size = 48, className = "" }: { id: string; size?: number; className?: string }) {
  const found = AVATARS.find((a) => a.id === id) ?? AVATARS[0];
  const Icon = found.icon;
  return (
    <span
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${found.bg} ${className}`}
      style={{ width: size, height: size }}
    >
      <Icon style={{ width: size * 0.58, height: size * 0.58 }} strokeWidth={2.2} />
    </span>
  );
}
