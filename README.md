# Ride Ready Guide — Party-Night Planner

An after-hours holiday-event planner for a fictional theme park. Pick your
party nights from a 22-night season (Nov 13 – Dec 22), watch the budget roll up
live, and share or print your checklist. Twelve free-with-admission extras are
listed below the tool.

This is a standalone **Bolt / Vite + React + TypeScript** component comp
(`bolt-vite-react-ts` template). No backend, no external data — everything is
self-contained.

## Features

- **Calendar strip** — 22 party-night chips grouped by week, each showing
  weekday, date, price, and a crowd-level badge. Sold-out nights use a dashed
  border. Tapping a chip toggles it with a spring-settle animation.
- **Live side panel** — animated total cost (count-up that lands exactly),
  cheapest picked night, per-night crowd badges, a picked-nights list with
  remove buttons, and a cross-fading prose verdict that adapts to your selection.
  Includes a designed empty state.
- **Share panel** — a short-link mock (`rrg.party/…`) with a copy button and a
  print-preview mode that renders a clean paper checklist.
- **Free-with-admission** — 12 holiday extras shown as cards.
- **Full keyboard support** — arrow-key navigation across the calendar,
  Enter/Space to toggle, roving tabindex, and descriptive aria-labels.
- **Light / dark theme** — persisted to `localStorage`, respects
  `prefers-color-scheme` on first visit.
- **Reduced motion** — disables the spring animation, count-up, and verdict
  cross-fade when the user prefers reduced motion.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

## Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start the Vite dev server with HMR.      |
| `npm run build`  | Type-check (`tsc -b`) then build for production. |
| `npm run lint`   | Run ESLint over the project.             |
| `npm run preview`| Preview the production build locally.    |

## Tech

- **React 18** + **TypeScript**
- **Vite 6** build tooling
- **Tailwind CSS 3** + **PostCSS** / **Autoprefixer** (config included)
- **ESLint 9** with `typescript-eslint`, `react-hooks`, `react-refresh`
- Path alias `@/*` → `./src/*`

## Project structure

```
.
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── POLISH-MOVES.md
├── README.md
└── src
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── vite-env.d.ts
```

See [`POLISH-MOVES.md`](./POLISH-MOVES.md) for the five interaction details
that make the planner feel hand-built.

---

Fictional demo. Prices, dates, and event details are illustrative only.
