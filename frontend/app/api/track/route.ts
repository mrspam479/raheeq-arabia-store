import { type NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://api.raheeqarabia.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;

    const res = await fetch(`${BACKEND_URL}/api/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.BACKEND_API_KEY ?? '',
        'X-Forwarded-For': req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '',
        'X-Real-IP': req.headers.get('x-real-ip') ?? '',
        'User-Agent': req.headers.get('user-agent') ?? '',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json() as unknown;
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
