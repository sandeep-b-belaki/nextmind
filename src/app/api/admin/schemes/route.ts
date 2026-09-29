import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminCreateScheme } from '@/lib/admin';
import type { SchemeInput } from '@/lib/admin';

export async function POST(req: Request) {
  try {
    requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as SchemeInput | null;
  if (!body?.name_kn || !body?.name_en || !body?.category_id || !body?.department_id || !body?.start_date || !body?.last_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const id = adminCreateScheme(body);
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
