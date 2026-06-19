'use client';

/**
 * Deferred pixel loader.
 * Rules (docs/13):
 * - NEVER inject pixel scripts in <head> on first paint.
 * - Load after first interaction (scroll / pointerdown) OR after
 *   requestIdleCallback fires (≥ 3 s timeout).
 * - Each pixel script is appended once; idempotency guarded by window._pixelsLoaded.
 *
 * Pixel IDs are fetched at runtime from /api/pixel-config (server-side env vars)
 * instead of being baked into the bundle at build time. This means EasyPanel only
 * needs to inject them as runtime env vars — no Docker build-arg plumbing required.
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
    if (!res.ok) throw new Error('config fetch failed');
    return res.json() as Promise<PixelConfig>;
  } catch {
    // Hardcoded fallback — pixel IDs are public, not secret
    return {
      tiktok: 'D8PIOU3C77U082M85FM0',
      snap: 'f2c54c8f-1550-44e8-8832-515ff3d8865c',
      meta: '',
    };
  }
}

function loadMetaPixel(pixelId: string): void {
  if (!pixelId) return;
  const f = window as unknown as Record<string, unknown>;
  if (typeof f.fbq === 'function') return;

  const fbq = ((...args: unknown[]) => {
    fbq.queue.push(args);
  }) as ((...args: unknown[]) => void) & { queue: unknown[][] };
  fbq.queue = [];
  window.fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.body.appendChild(script);

  window.fbq?.('init', pixelId);
  window.fbq?.('track', 'PageView');
}

function loadTikTokPixel(pixelId: string): void {
  if (!pixelId) return;
  if ((window as unknown as Record<string, unknown>).ttq) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + pixelId;
  script.onload = () => {
    window.ttq?.page();
  };
  document.body.appendChild(script);
}

function loadSnapPixel(pixelId: string): void {
  if (!pixelId) return;
  if (typeof window.snaptr === 'function') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://sc-static.net/scevent.min.js';
  script.onload = () => {
    window.snaptr?.('init', pixelId, {});
    window.snaptr?.('track', 'PAGE_VIEW');
  };
  document.body.appendChild(script);
}

export function PixelLoader(): null {
  useEffect(() => {
    // Begin fetching config immediately — by the time the user interacts
    // or 3 s elapse, this tiny request will already have resolved.
    const configPromise = fetchPixelConfig();

    async function loadAllPixels(): Promise<void> {
      if (window._pixelsLoaded) return;
      window._pixelsLoaded = true;
      const { meta, tiktok, snap } = await configPromise;
      loadMetaPixel(meta);
      loadTikTokPixel(tiktok);
      loadSnapPixel(snap);
    }

    // Interaction-based loading
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
    function onInteraction() {
      void loadAllPixels();
      events.forEach((e) => window.removeEventListener(e, onInteraction));
    }
    events.forEach((e) => window.addEventListener(e, onInteraction, { passive: true, once: true }));

    // Idle fallback after 3 s
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
