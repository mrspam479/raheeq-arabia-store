'use client';

/**
 * Deferred pixel loader.
 * Rules (docs/13):
 * - NEVER inject pixel scripts in <head> on first paint.
 * - Load after first interaction (scroll / pointerdown) OR after
 *   requestIdleCallback fires (≥ 3 s timeout).
 * - Each pixel script is appended once; idempotency guarded by window._pixelsLoaded.
 */

import { useEffect } from 'react';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? '';
const SNAP_PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ?? '';

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

function loadAllPixels(): void {
  if (window._pixelsLoaded) return;
  window._pixelsLoaded = true;
  loadMetaPixel(META_PIXEL_ID);
  loadTikTokPixel(TIKTOK_PIXEL_ID);
  loadSnapPixel(SNAP_PIXEL_ID);
}

export function PixelLoader(): null {
  useEffect(() => {
    // Interaction-based loading
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
    function onInteraction() {
      loadAllPixels();
      events.forEach((e) => window.removeEventListener(e, onInteraction));
    }
    events.forEach((e) => window.addEventListener(e, onInteraction, { passive: true, once: true }));

    // Idle fallback after 3 s
    let idleId: number | ReturnType<typeof setTimeout>;
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(loadAllPixels, { timeout: 3000 });
    } else {
      idleId = setTimeout(loadAllPixels, 3000);
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
