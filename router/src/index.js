import { resolve } from './router.js';

const CANONICAL_HOST = 'apps.andrewjesaitis.com';
const LEGACY_HOST = 'demos.andrewjesaitis.com';

const LANDING = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>apps · andrewjesaitis</title></head>
<body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:0 1rem">
<h1>apps</h1>
<ul>
  <li><a href="/carver/">carver</a> — seam carving in the browser</li>
  <li><a href="/pedals/">pedals</a> — overdrive pedal map</li>
</ul>
</body></html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Redirect the legacy host to the canonical one, preserving the path.
    if (url.hostname === LEGACY_HOST) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // Landing page at the root.
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(LANDING, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    const origin = resolve(url.pathname);
    if (!origin) return new Response('Not found', { status: 404 });

    // Reverse-proxy to the Pages origin, preserving method/headers/body/path.
    const upstream = new URL(url.toString());
    upstream.hostname = origin;
    upstream.protocol = 'https:';
    upstream.port = '';

    const resp = await fetch(new Request(upstream.toString(), request), {
      redirect: 'manual',
    });

    // Never leak the .pages.dev origin host in a redirect Location.
    const location = resp.headers.get('location');
    if (location && location.includes(origin)) {
      const headers = new Headers(resp.headers);
      headers.set('location', location.replaceAll(origin, CANONICAL_HOST));
      return new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers,
      });
    }
    return resp;
  },
};
