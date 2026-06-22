# The Overdrive Map

Interactive map of ~60 guitar overdrive / distortion / boost / fuzz pedals,
positioned by clipping hardness (x) and gain (y), colored by circuit family.
Published at `demos.andrewjesaitis.com/pedals`.

## Stack
- Vite + React + TypeScript (strict)
- Vitest for the pure geometry modules (`src/geometry/*.test.ts`)
- Plain CSS with custom properties; warm-dark "scope" theme

## Develop
- `pnpm install`
- `pnpm dev` — local dev server
- `pnpm test` — run unit tests
- `pnpm build` — production build to `dist/pedals/`
- `pnpm lint` / `pnpm fmt` / `pnpm typecheck`

## Conventions
- All visualization math lives in `src/geometry/` as pure, tested functions
  (no React, no DOM): scales, collision dodge, sweep/arrow geometry, waveform
  and EQ-curve generators.
- Data lives in `src/data/` (`families.ts`, `pedals.ts`, `eq.ts`); shared
  types in `src/types.ts`.
- Components own no math; they call geometry functions and render SVG.
- Domain reasoning and data provenance: `docs/HANDOFF.md`,
  `docs/pedal-research-reference.md`.
