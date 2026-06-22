import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolve } from './router.js';
import worker from './index.js';

describe('resolve', () => {
  it('maps known prefixes to their Pages origin', () => {
    expect(resolve('/carver/')).toBe('carver-demo.pages.dev');
    expect(resolve('/pedals/app.js')).toBe('pedals-demo.pages.dev');
  });
  it('returns null for the root and unknown prefixes', () => {
    expect(resolve('/')).toBeNull();
    expect(resolve('/nope/x')).toBeNull();
  });
});

describe('worker.fetch', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('301s the legacy host to the canonical host, preserving path', async () => {
    const res = await worker.fetch(new Request('https://demos.andrewjesaitis.com/carver/x'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://apps.andrewjesaitis.com/carver/x');
  });

  it('serves an HTML landing page at the root', async () => {
    const res = await worker.fetch(new Request('https://apps.andrewjesaitis.com/'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(await res.text()).toContain('/pedals');
  });

  it('404s an unknown prefix', async () => {
    const res = await worker.fetch(new Request('https://apps.andrewjesaitis.com/nope'));
    expect(res.status).toBe(404);
  });

  it('proxies a known prefix to its origin and rewrites a leaked Location', async () => {
    const fetchMock = vi.fn(async (req) => {
      expect(new URL(req.url).hostname).toBe('pedals-demo.pages.dev');
      return new Response('hi', {
        status: 301,
        headers: { location: 'https://pedals-demo.pages.dev/pedals/' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const res = await worker.fetch(new Request('https://apps.andrewjesaitis.com/pedals'));
    expect(fetchMock).toHaveBeenCalled();
    expect(res.headers.get('location')).toBe('https://apps.andrewjesaitis.com/pedals/');
  });

  it('landing page lists both demos', async () => {
    const res = await worker.fetch(new Request('https://apps.andrewjesaitis.com/'));
    const body = await res.text();
    expect(body).toContain('/carver/');
    expect(body).toContain('/pedals/');
  });

  it('passes through a normal 200 response body unchanged', async () => {
    const fetchMock = vi.fn(async () =>
      new Response('<html>hello</html>', { status: 200, headers: { 'content-type': 'text/html' } })
    );
    vi.stubGlobal('fetch', fetchMock);
    const res = await worker.fetch(new Request('https://apps.andrewjesaitis.com/pedals/index.html'));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('<html>hello</html>');
    expect(res.headers.get('location')).toBeNull();
  });

  it('forwards method, headers, and body to the upstream', async () => {
    let capturedReq;
    const fetchMock = vi.fn(async (req) => {
      capturedReq = req;
      return new Response('ok', { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    await worker.fetch(
      new Request('https://apps.andrewjesaitis.com/pedals/submit', {
        method: 'POST',
        headers: { 'x-test': '1' },
        body: 'payload=42',
      })
    );
    expect(capturedReq.method).toBe('POST');
    expect(capturedReq.headers.get('x-test')).toBe('1');
    expect(await capturedReq.text()).toBe('payload=42');
  });

  it('301s the legacy host preserving query string', async () => {
    const res = await worker.fetch(
      new Request('https://demos.andrewjesaitis.com/carver/x?a=1&b=2')
    );
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://apps.andrewjesaitis.com/carver/x?a=1&b=2');
  });
});
