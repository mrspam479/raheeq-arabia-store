/**
 * Analytics façade — single interface for all pixel events.
 * Web pixels are deferred; CAPI fired server-side via /api/track proxy.
 * Dedup: shared event_id (UUID v4) sent to both web pixel + CAPI.
 * NEVER hash on the client side. NEVER put pixel scripts in <head>.
 */
import { v4 as uuidv4 } from 'uuid';

export type PixelEvent =
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'CompleteRegistration';

export interface TrackPayload {
  event: PixelEvent;
  eventId?: string;
  productSlug?: string;
  productNameAr?: string;
  value?: number;
  currency?: 'SAR';
  quantity?: number;
  orderId?: string;
  phone?: string;
  name?: string;
  fbp?: string;
  fbc?: string;
  ttp?: string;
  ttclid?: string;
  scClickId?: string;
  userAgent?: string;
  ip?: string;
  pageUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; identify: (...args: unknown[]) => void };
    snaptr?: (...args: unknown[]) => void;
    _pixelsLoaded?: boolean;
  }
}

export function generateEventId(): string {
  return uuidv4();
}

function getCookies(): { fbp?: string; fbc?: string; ttp?: string } {
  if (typeof document === 'undefined') return {};
  const get = (name: string) => {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match?.[1] ? decodeURIComponent(match[1]) : undefined;
  };
  return { fbp: get('_fbp'), fbc: get('_fbc'), ttp: get('_ttp') };
}

function getUtms() {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get('utm_source') ?? undefined,
    utmMedium: p.get('utm_medium') ?? undefined,
    utmCampaign: p.get('utm_campaign') ?? undefined,
    utmContent: p.get('utm_content') ?? undefined,
    utmTerm: p.get('utm_term') ?? undefined,
    ttclid: p.get('ttclid') ?? undefined,
    scClickId: p.get('ScCid') ?? undefined,
  };
}

async function sendCapi(payload: TrackPayload): Promise<void> {
  try {
    const cookies = getCookies();
    const utms = getUtms();
    const body: TrackPayload = {
      ...payload,
      ...cookies,
      ...utms,
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
    };
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Non-blocking — pixel failures must not break the funnel
  }
}

function fireWebPixels(payload: TrackPayload): void {
  const { event, eventId, value, currency, productSlug, orderId, quantity } = payload;

  const fbContents = productSlug
    ? [{ id: productSlug, quantity: quantity ?? 1 }]
    : undefined;

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    const metaParams: Record<string, unknown> = {
      currency: currency ?? 'SAR',
      ...(value !== undefined && { value }),
      ...(fbContents && { contents: fbContents, content_ids: fbContents.map((c) => c.id) }),
      ...(orderId && { order_id: orderId }),
    };
    window.fbq('track', event, metaParams, { eventID: eventId });
  }

  // TikTok Pixel
  if (window.ttq?.track) {
    const ttParams: Record<string, unknown> = {
      currency: currency ?? 'SAR',
      ...(value !== undefined && { value }),
      ...(fbContents && { contents: fbContents }),
      ...(orderId && { order_id: orderId }),
    };
    window.ttq.track(event, ttParams, { event_id: eventId });
  }

  // Snapchat Pixel
  if (typeof window.snaptr === 'function') {
    const snapParams: Record<string, unknown> = {
      currency: currency ?? 'SAR',
      ...(value !== undefined && { price: value }),
      ...(orderId && { transaction_id: orderId }),
    };
    window.snaptr('track', event, snapParams);
  }
}

export async function trackEvent(payload: TrackPayload): Promise<void> {
  const eventId = payload.eventId ?? generateEventId();
  const enriched = { ...payload, eventId };

  fireWebPixels(enriched);
  await sendCapi(enriched);
}

export function trackViewContent(productSlug: string, productNameAr: string): void {
  void trackEvent({ event: 'ViewContent', productSlug, productNameAr, currency: 'SAR' });
}

export function trackAddToCart(productSlug: string, value: number, quantity: number): void {
  void trackEvent({ event: 'AddToCart', productSlug, value, quantity, currency: 'SAR' });
}

export function trackInitiateCheckout(value: number): void {
  void trackEvent({ event: 'InitiateCheckout', value, currency: 'SAR' });
}

export function trackPurchase(
  orderId: string,
  value: number,
  phone: string,
  name: string,
): void {
  void trackEvent({ event: 'Purchase', orderId, value, phone, name, currency: 'SAR' });
}
