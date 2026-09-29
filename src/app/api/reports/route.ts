import { NextResponse } from 'next/server';
import { row, run } from '@/lib/pg';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.message) return NextResponse.json({ error: 'Missing message' }, { status: 400 });

  const type = String(body.type ?? 'feedback').slice(0, 50);
  const schemeSlug = body.scheme_slug ? String(body.scheme_slug).slice(0, 200) : null;
  let schemeId: number | null = null;
  if (schemeSlug) {
    const found = await row<{ id: number }>('SELECT id FROM schemes WHERE slug = $1', [schemeSlug]);
    schemeId = found?.id ?? null;
  }
  await run(
    'INSERT INTO reports (scheme_id, scheme_slug, type, message, email, status) VALUES ($1, $2, $3, $4, $5, $6)',
    [
      schemeId,
      schemeSlug,
      type,
      String(body.message).slice(0, 5000),
      String(body.email ?? '').slice(0, 200),
      'open',
    ]
  );
  return NextResponse.json({ ok: true });
}
