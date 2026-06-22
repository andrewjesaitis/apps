// Path-prefix -> Cloudflare Pages origin (the project's canonical *.pages.dev,
// from `wrangler pages deploy` output). NOTE: carver's is `carver-demo-efs`,
// not `carver-demo` — the bare name was globally taken, so Cloudflare suffixed
// this account's project. Verify the real subdomain in the deploy log before editing.
export const APPS = {
  carver: 'carver-demo-efs.pages.dev',
  pedals: 'pedals-demo.pages.dev',
};

// Resolve the first path segment to a backend origin, or null if unknown.
export function resolve(pathname) {
  const seg = pathname.split('/')[1] ?? '';
  return Object.prototype.hasOwnProperty.call(APPS, seg) ? APPS[seg] : null;
}
