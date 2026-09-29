import { NextResponse } from 'next/server';
import { row, queryReturning } from '@/lib/pg';
import { createSession, hashPassword, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const email = String(body.email).toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (String(body.password).length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const existing = await row('SELECT id FROM users WHERE email = $1', [email]);
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const name = String(body.name).trim().slice(0, 100);
  const result = await queryReturning<{ id: number }>(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
    [name, email, hashPassword(String(body.password))]
  );

  const userId = result[0].id;
  const token = await createSession(userId, null);
  setSessionCookie(token, 'user');

  return NextResponse.json({ user: { id: userId, name, email } });
}
