import { NextResponse } from 'next/server';
import { row } from '@/lib/pg';
import { createSession, setSessionCookie, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const email = String(body.email).toLowerCase().trim();
  const admin = await row<{ id: number; name: string; email: string; password_hash: string; role: string }>(
    'SELECT id, name, email, password_hash, role FROM admin_users WHERE email = $1',
    [email]
  );

  if (!admin || !verifyPassword(String(body.password), admin.password_hash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSession(null, admin.id);
  setSessionCookie(token, 'admin');
  return NextResponse.json({ admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
}
