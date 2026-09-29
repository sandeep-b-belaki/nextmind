import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminDeleteScheme, adminUpdateScheme } from '@/lib/admin';
import type { SchemeInput } from '@/lib/admin';

interface Ctx {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = (await req.json().catch(() => null)) as SchemeInput | null;
  if (!body) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  try {
    adminUpdateScheme(id, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = (e as Error).message === 'NOT_FOUND' ? 404 : 500;
    return NextResponse.json({ error: (e as Error).message }, { status });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  adminDeleteScheme(id);
  return NextResponse.json({ ok: true });
}
