# apps

Andrew Jesaitis's browser demos, served from `apps.andrewjesaitis.com`.

- `apps/carver` — seam carving (Rust/WASM + React) → `/carver`
- `apps/pedals` — overdrive pedal map (React) → `/pedals`
- `router` — Worker that owns the domain and routes by path prefix

Each app deploys independently to its own Cloudflare Pages project; the router
stitches them under one domain. Add a demo: new `apps/<name>` package, a line in
`router/src/router.js`, and a `deploy-<name>.yml` workflow.
