/**
 * PostCSS pipeline — Tailwind CSS v4.
 *
 * Tailwind v4 is CSS-first: design tokens live in `src/app/globals.css`
 * inside `@theme { ... }`, and source scanning is declared with `@source`
 * directives in that same file (src/app, src/components, src/ui).
 * A legacy `tailwind.config.ts` is intentionally NOT used — v4 ignores it
 * unless referenced via `@config`, and wiring one risks conflicting with the
 * existing @theme tokens (colors, breakpoints, fonts, animations).
 *
 * This file is what Vercel and `next build` actually execute to compile CSS.
 */
const postcssConfig = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default postcssConfig;
