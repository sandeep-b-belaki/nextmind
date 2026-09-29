import { NextResponse } from 'next/server';
import { row } from '@/lib/pg';
import { createSession, setSessionCookie, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const email = String(body.email).toLowerCase().trim();
  const user = await row<{ id: number; name: string; email: string; password_hash: string }>(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (!user || !verifyPassword(String(body.password), user.password_hash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSession(user.id, null);
  setSessionCookie(token, 'user');
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
