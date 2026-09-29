import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { row, run } from '@/lib/pg';
import type { NotificationPrefs } from '@/lib/types';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  let prefs = await row<NotificationPrefs & { user_id: number }>(
    'SELECT * FROM notification_prefs WHERE user_id = $1',
    [user.id]
  );
  if (!prefs) {
    await run(
      'INSERT INTO notification_prefs (user_id, new_schemes, deadlines) VALUES ($1, 1, 1) ON CONFLICT DO NOTHING',
      [user.id]
    );
    prefs = (await row<NotificationPrefs & { user_id: number }>(
      'SELECT * FROM notification_prefs WHERE user_id = $1',
      [user.id]
    )) as NotificationPrefs & { user_id: number };
  }
  return NextResponse.json({ prefs });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const val = (k: string) => (body[k] ? 1 : 0);
  await run(
    `INSERT INTO notification_prefs (user_id, new_schemes, deadlines, scholarships, farmers, employment)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT(user_id) DO UPDATE SET
       new_schemes = excluded.new_schemes,
       deadlines = excluded.deadlines,
       scholarships = excluded.scholarships,
       farmers = excluded.farmers,
       employment = excluded.employment`,
    [user.id, val('new_schemes'), val('deadlines'), val('scholarships'), val('farmers'), val('employment')]
  );
  return NextResponse.json({ ok: true });
}
