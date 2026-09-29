import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminCreateDepartment } from '@/lib/admin';

export async function POST(req: Request) {
  try {
    requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.name_kn || !body?.name_en) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try {
    adminCreateDepartment(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Department may already exist' }, { status: 409 });
  }
}
