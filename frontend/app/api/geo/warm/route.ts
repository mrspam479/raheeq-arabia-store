/**
 * Geo cache warm-up proxy.
 * Called fire-and-forget when the checkout modal opens so the MaxMind result
 * is already cached by the time the customer clicks "confirm order".
 */
import { type NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'https://api.raheeqarabia.com';

export async function GET(req: NextRequest) {
  const realUserIp =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',').at(0)?.trim() ||
    req.headers.get('x-real-ip') ||
    '';

  // Fire-and-forget — we don't await or care about the result here.
  // The backend will call MaxMind and cache the result in memory.
  void fetch(`${BACKEND}/api/orders/geo-warm`, {
    method: 'GET',
    headers: {
      'X-Real-Client-IP': realUserIp,
      'X-Forwarded-For': realUserIp,
      'X-Real-IP': realUserIp,
    },
  }).catch(() => {});

  return new NextResponse(null, { status: 204 });
}
