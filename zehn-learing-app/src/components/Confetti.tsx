"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#7C5CFF", "#FFB020", "#22C39A", "#FF6B9D", "#38BDF8", "#A3E635"];

/** Fires a burst of confetti pieces from the given element (or screen center). */
export function fireConfetti(origin?: { x: number; y: number }, count = 90) {
  if (typeof window === "undefined") return;
  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(host);

  const cx = origin?.x ?? window.innerWidth / 2;
  const cy = origin?.y ?? window.innerHeight / 2.4;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    const size = 6 + Math.random() * 8;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 120 + Math.random() * 340;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity - 160;
    const rot = Math.random() * 720 - 360;
    const color = COLORS[i % COLORS.length];
    const round = Math.random() > 0.6;

    p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${
      round ? size : size * 0.5
    }px;background:${color};border-radius:${round ? "50%" : "2px"};`;

    host.appendChild(p);
    p.animate(
      [
        { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 420}px)) rotate(${rot}deg)`,
          opacity: 0,
        },
      ],
      { duration: 1300 + Math.random() * 700, easing: "cubic-bezier(.15,.6,.4,1)" }
    );
  }
  setTimeout(() => host.remove(), 2300);
}

/** Tiny helper component that fires confetti once on mount. */
export function ConfettiBurst({ count = 90 }: { count?: number }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const t = setTimeout(() => fireConfetti(undefined, count), 150);
    return () => clearTimeout(t);
  }, [count]);
  return null;
}
