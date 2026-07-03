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

## Suggest-values feature (Google Sheet backend)

Visitors can suggest clipping/gain/transparency for a pedal from the detail
panel. Submissions append to a Google Sheet via a Google Apps Script web app,
gated by a Cloudflare Turnstile CAPTCHA. Setup (one-time, manual):

1. **Turnstile:** In the Cloudflare dashboard, create a Turnstile widget. Note
   the **site key** (public) and **secret key** (private).
2. **Sheet + Apps Script:** Create a Google Sheet. Extensions > Apps Script
   (this makes the script *container-bound* to that sheet — required for the
   least-privilege scope below). Paste `apps-script/Code.gs`. Then Project
   Settings (⚙️) > enable "Show 'appsscript.json' manifest file in editor" and
   replace the manifest with `apps-script/appsscript.json` — it pins the OAuth
   scopes to `spreadsheets.currentonly` (this one sheet only, not all your
   spreadsheets) plus `script.external_request` (the Turnstile call). In
   Project Settings > Script Properties, add `TURNSTILE_SECRET` = your
   Turnstile secret key.
3. **Deploy:** Deploy > New deployment > Web app; "Execute as: Me",
   "Who has access: Anyone". Copy the `/exec` URL. On first deploy Google shows
   an "unverified app" screen and requests authorization — this is expected for
   a personal execute-as-me script; approve it (Advanced → Go to project).
4. **Wire the client:** set two public build vars (see `.env.example`):
   - `VITE_SUGGEST_URL` = the `/exec` URL
   - `VITE_TURNSTILE_SITE_KEY` = the Turnstile site key
   For local dev put these in `apps/pedals/.env.local`. For the deployed site,
   add them as **repository Variables** (Settings → Secrets and variables →
   Actions → Variables) — the `deploy-pedals.yml` build step already forwards
   them. Until they're set they resolve to empty and the feature stays hidden.
