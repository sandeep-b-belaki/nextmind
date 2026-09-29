import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession } from '@/lib/auth';

export async function POST() {
  const token = cookies().get('nm_admin')?.value;
  if (token) destroySession(token);
  cookies().delete('nm_admin');
  return NextResponse.json({ ok: true });
}
