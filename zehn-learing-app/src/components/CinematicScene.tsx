"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* Layered motion effects keyed by scene visual — sits on top of the artwork */

function RainOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(22)].map((_, i) => (
        <motion.span key={i}
          className="absolute h-5 w-[2px] rounded-full bg-sky-200/70"
          style={{ left: `${(i * 47) % 100}%` }}
          initial={{ top: "-10%" }}
          animate={{ top: "112%" }}
          transition={{ duration: 0.95 + (i % 4) * 0.18, repeat: Infinity, delay: (i * 0.23) % 1.1, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

function VaporOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.span key={i}
          className="absolute bottom-0 h-2 w-2 rounded-full bg-white/70 blur-[1px]"
          style={{ left: `${8 + ((i * 67) % 84)}%` }}
          animate={{ y: [0, -220], opacity: [0, 0.9, 0], scale: [0.6, 1.3, 0.4] }}
          transition={{ duration: 3.6 + (i % 3), repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function TwinkleOverlay({ count = 16 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {[...Array(count)].map((_, i) => (
        <span key={i}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            left: `${(i * 61) % 96}%`,
            top: `${(i * 41) % 80}%`,
            width: i % 4 === 0 ? 4 : 2.5,
            height: i % 4 === 0 ? 4 : 2.5,
            animationDelay: `${(i * 0.31) % 2.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function DownArrowsOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-around opacity-70">
      {[0, 1, 2].map((i) => (
        <motion.svg key={i} width="34" height="60" viewBox="0 0 34 60"
          animate={{ y: [-14, 24], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35, ease: "easeIn" }}>
          <path d="M17 4 v44 m0 0 l-10 -10 m10 10 l10 -10" stroke="#fbbf24" strokeWidth="5" fill="none" strokeLinecap="round" />
        </motion.svg>
      ))}
    </div>
  );
}

function SparkleDrift() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(9)].map((_, i) => (
        <motion.span key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-amber-200/80"
          style={{ left: `${10 + ((i * 53) % 82)}%`, top: `${15 + ((i * 37) % 70)}%` }}
          animate={{ y: [0, -16, 0], opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

const EFFECTS: Record<string, string> = {
  rain: "rain", "apple-fall": "arrows", earth: "arrows",
  evap: "vapor", "ocean-sun": "vapor",
  night: "stars", stars: "stars", moon: "stars",
  cloud: "sparkle", river: "sparkle", rocket: "stars", tree: "sparkle", ball: "sparkle",
};

/** Cinematic scene: artwork + smooth Ken Burns camera + motion overlays */
export function CinematicScene({
  img,
  visual,
  sceneKey,
}: {
  img?: string;
  visual: string;
  sceneKey: number;
}) {
  const effect = EFFECTS[visual] ?? "sparkle";
  const dir = sceneKey % 2 === 0 ? 1 : -1;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#0a0f22] ring-1 ring-white/10 shadow-[0_30px_80px_-24px_rgba(0,0,0,.8)]">
      {img && (
        <motion.div
          key={img + sceneKey}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.02 }}
          transition={{ duration: 1.1, ease: [0.22, 0.8, 0.35, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1.04, 1.16],
              x: [0, 14 * dir],
              y: [0, -10 * dir],
            }}
            transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          >
            <Image src={img} alt="" fill priority sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover" />
          </motion.div>
        </motion.div>
      )}

      {/* cinematic vignette + grade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,.45)" }} />

      {/* motion effect layer */}
      {effect === "rain" && <RainOverlay />}
      {effect === "vapor" && <VaporOverlay />}
      {effect === "stars" && <TwinkleOverlay count={18} />}
      {effect === "arrows" && <DownArrowsOverlay />}
      {effect === "sparkle" && <SparkleDrift />}

      {/* film-grain flicker */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white mix-blend-overlay"
        animate={{ opacity: [0.015, 0.05, 0.015] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
    </div>
  );
}
