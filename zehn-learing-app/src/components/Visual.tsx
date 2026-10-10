"use client";

import { motion } from "framer-motion";
import type { Slide } from "@/db/curriculum";
import { IconByName } from "./IconByName";

const BG: Record<string, string> = {
  violet: "from-violet-500/25 to-fuchsia-500/10 text-violet-300",
  amber: "from-amber-400/25 to-orange-500/10 text-amber-300",
  mint: "from-emerald-400/25 to-teal-500/10 text-emerald-300",
  sky: "from-sky-400/25 to-blue-500/10 text-sky-300",
  pink: "from-pink-400/25 to-rose-500/10 text-pink-300",
};

/** Animated visual panel for a lesson slide — the "cartoon layer". */
export function SlideVisual({ visual, color = "violet" }: { visual: Slide["visual"]; color?: string }) {
  const tint = BG[color] ?? BG.violet;

  return (
    <div
      className={`relative flex min-h-44 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br p-6 ${tint}`}
    >
      {/* drifting particles */}
      {[...Array(7)].map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white/40"
          style={{ left: `${8 + i * 14}%`, top: `${20 + ((i * 23) % 60)}%` }}
          animate={{ y: [0, -12, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2.2 + i * 0.28, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {visual.kind === "icon" && (
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-3xl bg-white/10 p-7 backdrop-blur-sm"
        >
          <IconByName name={visual.icon} className="h-16 w-16" strokeWidth={1.6} />
        </motion.div>
      )}

      {visual.kind === "cycle" && (
        <div className="relative h-36 w-36">
          {visual.icons.map((icon, i) => {
            const angle = (i / visual.icons.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(angle) * 38;
            const y = 50 + Math.sin(angle) * 38;
            return (
              <motion.div
                key={icon + i}
                className="absolute rounded-2xl bg-white/12 p-2.5 backdrop-blur-sm"
                style={{ left: `${x}%`, top: `${y}%`, x: "-50%", y: "-50%" }}
                animate={{ scale: [1, 1.18, 1] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * (2.4 / visual.icons.length),
                  ease: "easeInOut",
                }}
              >
                <IconByName name={icon} className="h-7 w-7" strokeWidth={1.8} />
              </motion.div>
            );
          })}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          >
            <IconByName name="Repeat" className="h-8 w-8 opacity-60" strokeWidth={1.8} />
          </motion.div>
        </div>
      )}

      {visual.kind === "bullets" && (
        <div className="flex w-full max-w-sm flex-col gap-2.5">
          {visual.items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.22, type: "spring", bounce: 0.4 }}
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-extrabold">
                {i + 1}
              </span>
              <span className="text-sm font-bold text-white/95">{item}</span>
            </motion.div>
          ))}
        </div>
      )}

      {visual.kind === "steps" && (
        <div className="flex w-full max-w-sm flex-col gap-2.5">
          {visual.items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.25, type: "spring", bounce: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 font-display text-sm font-bold backdrop-blur-sm"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              >
                {i + 1}
              </motion.span>
              <span className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white/95 backdrop-blur-sm">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {visual.kind === "big" && (
        <div className="flex flex-col items-center gap-2 text-center">
          <motion.span
            className="font-display text-6xl font-extrabold tracking-tight text-white drop-shadow-lg"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.55 }}
          >
            {visual.value}
          </motion.span>
          <motion.span
            className="max-w-60 text-sm font-bold text-white/85"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {visual.label}
          </motion.span>
        </div>
      )}
    </div>
  );
}
