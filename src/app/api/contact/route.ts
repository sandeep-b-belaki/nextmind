import { NextResponse } from 'next/server';
import { run } from '@/lib/pg';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const message = String(body.message).slice(0, 5000);
  await run('INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)', [
    String(body.name).slice(0, 200),
    String(body.email).slice(0, 200),
    String(body.subject ?? '').slice(0, 200),
    message,
  ]);
  return NextResponse.json({ ok: true });
}
