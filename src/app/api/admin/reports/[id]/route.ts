import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminUpdateReportStatus } from '@/lib/admin';

interface Ctx {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  adminUpdateReportStatus(id, String(body.status ?? 'open'));
  return NextResponse.json({ ok: true });
}
