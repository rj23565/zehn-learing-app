"use client";

import { motion } from "framer-motion";

/**
 * Lumi — the learning owl buddy. Pure animated SVG so it stays crisp
 * at any size and never waits on a download.
 */
export function Mascot({
  size = 64,
  mood = "idle",
  className = "",
}: {
  size?: number;
  mood?: "idle" | "happy" | "speaking" | "sleep";
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={
        mood === "happy"
          ? { y: [0, -8, 0], rotate: [0, -4, 4, 0] }
          : mood === "speaking"
            ? { y: [0, -3, 0] }
            : { y: [0, -5, 0] }
      }
      transition={{
        duration: mood === "speaking" ? 0.55 : 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
        <defs>
          <linearGradient id="lumi-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B6CFF" />
            <stop offset="100%" stopColor="#5B3DF0" />
          </linearGradient>
          <linearGradient id="lumi-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7F3FF" />
            <stop offset="100%" stopColor="#E4DBFF" />
          </linearGradient>
        </defs>

        {/* wings */}
        <ellipse cx="16" cy="72" rx="12" ry="20" fill="#5B3DF0" opacity="0.9" transform="rotate(-18 16 72)" />
        <ellipse cx="104" cy="72" rx="12" ry="20" fill="#5B3DF0" opacity="0.9" transform="rotate(18 104 72)" />

        {/* body */}
        <ellipse cx="60" cy="66" rx="46" ry="44" fill="url(#lumi-body)" />
        <ellipse cx="60" cy="78" rx="30" ry="28" fill="url(#lumi-belly)" />

        {/* ear tufts */}
        <path d="M28 34 L36 14 L46 30 Z" fill="#4A2FD8" />
        <path d="M92 34 L84 14 L74 30 Z" fill="#4A2FD8" />

        {/* eyes */}
        <g className="mascot-blink" style={{ transformOrigin: "60px 52px" }}>
          <circle cx="44" cy="52" r="15" fill="#fff" />
          <circle cx="76" cy="52" r="15" fill="#fff" />
          {mood === "sleep" ? (
            <>
              <path d="M36 52 q8 6 16 0" stroke="#2A1B5E" strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <path d="M68 52 q8 6 16 0" stroke="#2A1B5E" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="47" cy="54" r="6.5" fill="#2A1B5E" />
              <circle cx="73" cy="54" r="6.5" fill="#2A1B5E" />
              <circle cx="49" cy="51.5" r="2.2" fill="#fff" />
              <circle cx="75" cy="51.5" r="2.2" fill="#fff" />
            </>
          )}
        </g>

        {/* beak */}
        <path d="M60 62 L52 70 Q60 78 68 70 Z" fill="#FFB020" />

        {/* belly star badge */}
        <path
          d="M60 84 l3 6 6.6 1 -4.8 4.6 1.2 6.5 -6 -3.2 -6 3.2 1.2 -6.5 -4.8 -4.6 6.6 -1 z"
          fill="#FFB020"
        />

        {/* cheeks */}
        <circle cx="30" cy="66" r="5" fill="#FF9FC6" opacity="0.75" />
        <circle cx="90" cy="66" r="5" fill="#FF9FC6" opacity="0.75" />
      </svg>
    </motion.div>
  );
}
