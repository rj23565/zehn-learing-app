# src/ui

Home for reusable UI primitives (buttons, cards, dialogs, inputs).

Tailwind v4 is configured to scan this directory via the `@source`
directive in `src/app/globals.css`, so any component placed here is
styled automatically — no extra configuration required.

Suggested structure:

```
src/ui/
  Button.tsx
  Card.tsx
  Dialog.tsx
  index.ts
```
