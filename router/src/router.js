// Path-prefix -> Cloudflare Pages origin. Add one line per demo.
export const APPS = {
  carver: 'carver-demo.pages.dev',
  pedals: 'pedals-demo.pages.dev',
};

// Resolve the first path segment to a backend origin, or null if unknown.
export function resolve(pathname) {
  const seg = pathname.split('/')[1] ?? '';
  return Object.prototype.hasOwnProperty.call(APPS, seg) ? APPS[seg] : null;
}
