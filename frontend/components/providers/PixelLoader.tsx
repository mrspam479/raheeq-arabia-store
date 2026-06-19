'use client';

/**
 * Deferred pixel loader.
 * - NEVER inject pixel scripts in <head> on first paint.
 * - Load after first interaction (scroll / pointerdown / keydown / touchstart)
 *   OR after requestIdleCallback fires (≥ 3 s timeout).
 * - Each pixel script is appended once; idempotency guarded by window._pixelsLoaded.
 *
 * Pixel IDs are fetched at runtime from /api/pixel-config so EasyPanel only
 * needs to inject them as runtime env vars — no Docker build-arg plumbing required.
 *
 * TikTok and Snapchat require their official initialization queue stub to be set up
 * BEFORE their script loads, otherwise the script downloads but never wakes up.
 */

import { useEffect } from 'react';

interface PixelConfig {
  tiktok: string;
  snap: string;
  meta: string;
}

async function fetchPixelConfig(): Promise<PixelConfig> {
  try {
    const res = await fetch('/api/pixel-config', { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch failed');
    return res.json() as Promise<PixelConfig>;
  } catch {
    return {
      tiktok: 'D8PIOU3C77U082M85FM0',
      snap: 'f2c54c8f-1550-44e8-8832-515ff3d8865c',
      meta: '',
    };
  }
}

// ─── Meta ────────────────────────────────────────────────────────────────────

function loadMetaPixel(pixelId: string): void {
  if (!pixelId) return;
  if (typeof window.fbq === 'function') return;

  // Set up the queue stub so fbq calls made before the script loads are queued
  const fbq = ((...args: unknown[]) => { fbq.queue.push(args); }) as ((...args: unknown[]) => void) & { queue: unknown[][] };
  fbq.queue = [];
  window.fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.body.appendChild(script);

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

// ─── TikTok ──────────────────────────────────────────────────────────────────

function loadTikTokPixel(pixelId: string): void {
  if (!pixelId) return;
  // Cast via unknown — Window doesn't have an index signature
  const win = window as unknown as Record<string, unknown>;
  if (win['ttq']) return;

  // Exact official TikTok initialization stub (adapted from TikTok docs).
  // window.TiktokAnalyticsObject tells the downloaded script which window
  // property holds the queue — without it the script does nothing.
  const lib = 'ttq';
  win['TiktokAnalyticsObject'] = lib;

  const methods = [
    'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once',
    'ready', 'alias', 'group', 'enableCookie', 'disableCookie',
    'holdConsent', 'revokeConsent', 'grantConsent',
  ];

  // TikTok's queue is an array with extra string-keyed properties — an inherently
  // dynamic JS pattern. `any` (not `any[]`) is required so TS allows both
  // array methods (push) and arbitrary property assignment (methods, _i, _t, _o).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ttq: any = [];
  ttq.methods = methods;
  ttq._i = {};
  ttq._t = {};
  ttq._o = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setAndDefer = (obj: any, method: string) => {
    obj[method] = (...args: unknown[]) => { obj.push([method, ...args]); };
  };
  methods.forEach((m) => setAndDefer(ttq, m));

  ttq.instance = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inst: any = [];
    methods.forEach((m) => setAndDefer(inst, m));
    return inst;
  };

  ttq.load = (id: string, opts?: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const i: any = [];
    i._u = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}&lib=${lib}`;
    ttq._i[id] = i;
    ttq._t[id] = +new Date();
    ttq._o[id] = opts ?? {};
  };

  win[lib] = ttq;
  window.ttq = ttq as typeof window.ttq;

  // Queue init + PageView BEFORE the script loads — flushed when events.js runs
  ttq.load(pixelId);
  ttq.page();

  // &lib=ttq is required — tells events.js which window property is the queue
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${pixelId}&lib=${lib}`;
  document.body.appendChild(script);
}

// ─── Snapchat ─────────────────────────────────────────────────────────────────

function loadSnapPixel(pixelId: string): void {
  if (!pixelId) return;
  if (typeof window.snaptr === 'function') return;

  // Exact match to Snap's official pixel stub.
  // - queue (not q) is what scevent.min.js flushes on load
  // - handleRequest check lets events fired after script loads go through immediately
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snaptr: any = (...args: unknown[]) => {
    if (snaptr.handleRequest) {
      snaptr.handleRequest(...args);
    } else {
      snaptr.queue.push(args);
    }
  };
  snaptr.queue = [];
  window.snaptr = snaptr;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://sc-static.net/scevent.min.js';
  document.body.appendChild(script);

  // Call on snaptr directly — window.snaptr is typed as optional so TS would
  // complain about invoking it even though we just assigned it above.
  snaptr('init', pixelId, {});
  snaptr('track', 'PAGE_VIEW');
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export function PixelLoader(): null {
  useEffect(() => {
    // Start fetching config immediately. By the time the user scrolls or 3 s
    // elapse this tiny request will already have resolved.
    const configPromise = fetchPixelConfig();

    async function loadAllPixels(): Promise<void> {
      if (window._pixelsLoaded) return;
      window._pixelsLoaded = true;
      const { meta, tiktok, snap } = await configPromise;
      loadMetaPixel(meta);
      loadTikTokPixel(tiktok);
      loadSnapPixel(snap);
    }

    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
    function onInteraction() {
      void loadAllPixels();
      events.forEach((e) => window.removeEventListener(e, onInteraction));
    }
    events.forEach((e) =>
      window.addEventListener(e, onInteraction, { passive: true, once: true }),
    );

    let idleId: number | ReturnType<typeof setTimeout>;
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(() => void loadAllPixels(), { timeout: 3000 });
    } else {
      idleId = setTimeout(() => void loadAllPixels(), 3000);
    }

    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteraction));
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as ReturnType<typeof setTimeout>);
      }
    };
  }, []);

  return null;
}
