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
  if ((window as Record<string, unknown>).ttq) return;

  // Official TikTok initialization queue stub.
  // Must exist BEFORE events.js loads so the script can flush the queue.
  const win = window as unknown as Record<string, unknown>;
  const methods = [
    'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once',
    'ready', 'alias', 'group', 'enableCookie', 'disableCookie',
  ];
  const ttq: Record<string, unknown> = Object.assign([], {
    _i: {} as Record<string, unknown>,
    _t: {} as Record<string, unknown>,
    _o: {} as Record<string, unknown>,
  });
  methods.forEach((m) => {
    ttq[m] = (...args: unknown[]) => {
      (ttq as unknown[]).push([m, ...args]);
    };
  });
  (ttq as Record<string, unknown>)['load'] = (id: string) => {
    (ttq as Record<string, unknown>)['_i'] = { [id]: [] };
    (ttq as Record<string, unknown>)['_t'] = { [id]: +new Date() };
  };
  (ttq as Record<string, unknown>)['instance'] = (id: string) =>
    ((ttq as Record<string, unknown>)['_i'] as Record<string, unknown>)[id] ?? ttq;

  win['ttq'] = ttq;
  window.ttq = ttq as typeof window.ttq;

  // Initialize the pixel and fire PageView (queued until script loads)
  (ttq['load'] as (id: string) => void)(pixelId);
  (ttq['page'] as () => void)();

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + pixelId;
  document.body.appendChild(script);
}

// ─── Snapchat ─────────────────────────────────────────────────────────────────

function loadSnapPixel(pixelId: string): void {
  if (!pixelId) return;
  if (typeof window.snaptr === 'function') return;

  // Official Snapchat initialization queue stub.
  const snaptr = ((...args: unknown[]) => {
    (snaptr as { q: unknown[][] }).q
      ? (snaptr as { q: unknown[][] }).q.push(args)
      : ((snaptr as { q: unknown[][] }).q = [args]);
  }) as ((...args: unknown[]) => void) & { q: unknown[][] };
  snaptr.q = [];
  window.snaptr = snaptr;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://sc-static.net/scevent.min.js';
  document.body.appendChild(script);

  // Queue init + PAGE_VIEW before script loads — flushed when script executes
  window.snaptr('init', pixelId, {});
  window.snaptr('track', 'PAGE_VIEW');
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
