import type { Config } from "tailwindcss";

/**
 * Tailwind configuration.
 *
 * This project is Tailwind v4 (CSS-first): the build compiles utility
 * classes via PostCSS (`@tailwindcss/postcss`) and scans sources from the
 * `@source` directives in `src/app/globals.css`. The explicit `content`
 * array below documents and enforces the same scan targets for any tooling
 * that reads this config (editors, some v3-compatible plugins, CDNs), while
 * design tokens remain centralized in `globals.css` `@theme`.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mjs}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/ui/**/*.{ts,tsx,js,jsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
