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
    ttq?: {
      track: (event: string, params: Record<string, unknown>, options?: Record<string, unknown>) => void;
      identify: (...args: unknown[]) => void;
      page: () => void;
    };
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

    // Build the nested structure the backend TrackEventIn schema expects
    const body = {
      event_name: payload.event,
      event_id: payload.eventId,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      user: {
        phone: payload.phone ?? null,
        first_name: payload.name ?? null,
      },
      client: {
        user_agent: navigator.userAgent,
        fbp: cookies.fbp ?? null,
        fbc: cookies.fbc ?? null,
        ttp: cookies.ttp ?? null,
        ttclid: utms.ttclid ?? null,
        sc_click_id: utms.scClickId ?? null,
      },
      data: {
        currency: payload.currency ?? 'SAR',
        value: payload.value ?? 0,
        contents: payload.productSlug
          ? [{ id: payload.productSlug, quantity: payload.quantity ?? 1, item_price: payload.value ?? 0 }]
          : [],
        num_items: payload.quantity ?? (payload.productSlug ? 1 : 0),
        content_type: 'product',
        order_id: payload.orderId ?? null,
      },
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

// TikTok uses different event names from the standard set
const TIKTOK_EVENT_MAP: Record<string, string> = {
  Purchase: 'CompletePayment',
};

// Snapchat uses SCREAMING_SNAKE_CASE event names
const SNAP_EVENT_MAP: Record<string, string> = {
  ViewContent: 'VIEW_CONTENT',
  AddToCart: 'ADD_CART',
  InitiateCheckout: 'START_CHECKOUT',
  Purchase: 'PURCHASE',
  PageView: 'PAGE_VIEW',
};

function fireWebPixels(payload: TrackPayload): void {
  const { event, eventId, value, currency, productSlug, orderId, quantity } = payload;

  // Meta Pixel — uses standard event names
  if (typeof window.fbq === 'function') {
    const fbContents = productSlug
      ? [{ id: productSlug, quantity: quantity ?? 1 }]
      : undefined;
    const metaParams: Record<string, unknown> = {
      currency: currency ?? 'SAR',
      ...(value !== undefined && { value }),
      ...(fbContents && { contents: fbContents, content_ids: fbContents.map((c) => c.id) }),
      ...(orderId && { order_id: orderId }),
    };
    window.fbq('track', event, metaParams, { eventID: eventId });
  }

  // TikTok Pixel — needs CompletePayment for Purchase, content_id (not id) in contents
  if (window.ttq?.track) {
    const tiktokEvent = TIKTOK_EVENT_MAP[event] ?? event;
    const ttContents = productSlug
      ? [{ content_id: productSlug, quantity: quantity ?? 1, price: value ?? 0 }]
      : undefined;
    const ttParams: Record<string, unknown> = {
      currency: currency ?? 'SAR',
      ...(value !== undefined && { value }),
      ...(ttContents && { contents: ttContents }),
      ...(orderId && { order_id: orderId }),
    };
    window.ttq.track(tiktokEvent, ttParams, { event_id: eventId });
  }

  // Snapchat Pixel — needs SCREAMING_SNAKE_CASE event names
  if (typeof window.snaptr === 'function') {
    const snapEvent = SNAP_EVENT_MAP[event] ?? event;
    const snapParams: Record<string, unknown> = {
      currency: currency ?? 'SAR',
      ...(value !== undefined && { price: value }),
      ...(orderId && { transaction_id: orderId }),
    };
    window.snaptr('track', snapEvent, snapParams);
  }
}

export async function trackEvent(payload: TrackPayload): Promise<void> {
  const eventId = payload.eventId ?? generateEventId();
  const enriched = { ...payload, eventId };

  fireWebPixels(enriched);
  await sendCapi(enriched);
}

export function trackViewContent(productSlug: string, productNameAr: string, value?: number): void {
  void trackEvent({ event: 'ViewContent', productSlug, productNameAr, value, currency: 'SAR' });
}

export function trackAddToCart(productSlug: string, value: number, quantity: number): void {
  void trackEvent({ event: 'AddToCart', productSlug, value, quantity, currency: 'SAR' });
}

export interface CartItem {
  slug: string;
  quantity: number;
  unitPrice: number;
}

export function trackInitiateCheckout(value: number, items?: CartItem[]): void {
  void trackEvent({
    event: 'InitiateCheckout',
    value,
    currency: 'SAR',
    // Use first item for content_id (TikTok VSA requirement)
    productSlug: items?.[0]?.slug,
    quantity: items?.reduce((sum, i) => sum + i.quantity, 0),
  });
}

export function trackPurchase(
  orderId: string,
  value: number,
  phone: string,
  name: string,
  eventId: string,
): void {
  void trackEvent({ event: 'Purchase', eventId, orderId, value, phone, name, currency: 'SAR' });
}
