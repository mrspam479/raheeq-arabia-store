/**
 * Server-side proxy for POST /api/orders
 *
 * IP forwarding note:
 * The chain is: Browser → Cloudflare → EasyPanel(frontend) → Cloudflare → EasyPanel(backend)
 * When this proxy calls the backend, Cloudflare replaces X-Forwarded-For with the
 * frontend container IP, so MaxMind gets a data center IP → fail-open → geo check bypassed.
 *
 * Fix: Cloudflare always sets CF-Connecting-IP on the *incoming* request with the
 * real user IP. We read it here and forward it as X-Real-Client-IP (a custom header
 * that Cloudflare passes through unchanged). The backend reads X-Real-Client-IP first.
 */
import { type NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'https://api.raheeqarabia.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // CF-Connecting-IP = Cloudflare's guaranteed real user IP on the incoming request
    const realUserIp =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',').at(0)?.trim() ||
      req.headers.get('x-real-ip') ||
      '';

    const idempotencyKey = req.headers.get('idempotency-key') ?? '';

    const res = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        // Custom header — Cloudflare forwards it untouched so the backend always
        // receives the original user IP even after the second Cloudflare hop
        'X-Real-Client-IP': realUserIp,
        'X-Forwarded-For': realUserIp,
        'X-Real-IP': realUserIp,
        'User-Agent': req.headers.get('user-agent') ?? '',
      },
      body,
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return NextResponse.json(
      { detail: { code: 'NETWORK_ERROR', message: 'تعذّر الاتصال بالخادم، حاولي مرة أخرى.' } },
      { status: 503 },
    );
  }
}
