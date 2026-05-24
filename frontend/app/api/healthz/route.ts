/**
 * Frontend → Backend health check.
 * Visit /api/healthz in browser to test connectivity.
 */
import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'https://api.raheeqarabia.com';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/ready`, { cache: 'no-store' });
    const data = await res.json() as unknown;
    return NextResponse.json({ backend: BACKEND, status: res.status, data });
  } catch (err) {
    return NextResponse.json(
      { backend: BACKEND, error: String(err) },
      { status: 503 },
    );
  }
}
