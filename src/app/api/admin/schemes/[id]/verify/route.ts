import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminVerifyScheme } from '@/lib/admin';
import type { SchemeStatus, VerifyStatus } from '@/lib/types';

interface Ctx {
  params: { id: string };
}

export async function POST(req: Request, { params }: Ctx) {
  try {
    requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const verify = String(body.verify_status ?? 'needs_review') as VerifyStatus;
  const status = body.status ? (String(body.status) as SchemeStatus) : undefined;
  const notes = String(body.notes ?? '').slice(0, 1000);
  adminVerifyScheme(id, verify, status, notes);
  return NextResponse.json({ ok: true });
}
