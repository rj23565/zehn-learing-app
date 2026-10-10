"use client";

import { motion } from "framer-motion";

/**
 * Zehn brand mark — an owl-brain fused with a spark of insight.
 * Pure SVG so it stays razor sharp on every device and theme.
 */
export function Logo({
  size = 40,
  animated = true,
  className = "",
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  const Wrapper = animated ? motion.div : "div";
  const motionProps = animated
    ? {
        animate: { y: [0, -3, 0] },
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  return (
    <Wrapper className={className} style={{ width: size, height: size }} {...motionProps}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
        <defs>
          <linearGradient id="zehn-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="zehn-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* squircle plate */}
        <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#zehn-bg)" />
        <rect x="2" y="2" width="60" height="60" rx="18" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" />

        {/* brain hemisphere lines */}
        <path
          d="M32 15c-7.2 0-12.4 4.6-12.4 10.6 0 2.2.8 4 2 5.6-1.5 1.6-2.4 3.6-2.4 5.9C19.2 43.3 24.9 48 32 48s12.8-4.7 12.8-10.9c0-2.3-.9-4.3-2.4-5.9 1.2-1.6 2-3.4 2-5.6C44.4 19.6 39.2 15 32 15Z"
          fill="rgba(255,255,255,.16)"
          stroke="rgba(255,255,255,.75)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M32 16v32" stroke="rgba(255,255,255,.65)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M26 24c-3 1-4.4 3.2-4.2 5.8M38 24c3 1 4.4 3.2 4.2 5.8M25.5 38c-2.4.6-3.8 2-4 4M38.5 38c2.4.6 3.8 2 4 4"
          stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* owl eyes = knowledge */}
        <circle cx="26" cy="31" r="4.4" fill="#fff" />
        <circle cx="38" cy="31" r="4.4" fill="#fff" />
        <circle cx="26.9" cy="31.4" r="2.1" fill="#1e1b4b" />
        <circle cx="38.9" cy="31.4" r="2.1" fill="#1e1b4b" />

        {/* insight spark */}
        <path d="M33.4 50.5h-5.1l1.3-5.4h-3.2l5.6-8.1-1.2 5.3h3.3l-5.2 8.2Z"
          fill="url(#zehn-spark)" transform="translate(2.2 -1.5) scale(1.05)" opacity="0.95" />
      </svg>
    </Wrapper>
  );
}

export function LogoWord({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>Zehn</span>
  );
}
