import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { row, rows, run } from '@/lib/pg';
import { applicationStatus } from '@/lib/status';

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ saved: false, schemes: [] }, { status: 401 });
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (slug) {
    const found = await row(
      `SELECT 1 AS saved FROM saved_schemes ss JOIN schemes s ON s.id = ss.scheme_id
       WHERE ss.user_id = $1 AND s.slug = $2`,
      [user.id, slug]
    );
    return NextResponse.json({ saved: !!found });
  }

  const schemes = await rows<Record<string, unknown>>(
    `SELECT s.*, c.slug AS category_slug, c.name_kn AS category_name_kn, c.name_en AS category_name_en,
            d.slug AS department_slug, d.name_kn AS department_name_kn,
            d.name_en AS department_name_en,
            (SELECT COUNT(*) FROM eligibility_rules er WHERE er.scheme_id = s.id) AS eligibility_count
     FROM saved_schemes ss
     JOIN schemes s ON s.id = ss.scheme_id
     JOIN categories c ON c.id = s.category_id
     JOIN departments d ON d.id = s.department_id
     WHERE ss.user_id = $1
     ORDER BY ss.created_at DESC`,
    [user.id]
  );
  return NextResponse.json({
    schemes: schemes.map((s) => ({
      ...s,
      app_status: applicationStatus(s as never),
    })),
  });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const { slug } = await req.json().catch(() => ({}));
  const scheme = await row<{ id: number }>('SELECT id FROM schemes WHERE slug = $1', [String(slug ?? '')]);
  if (!scheme) return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
  await run('INSERT INTO saved_schemes (user_id, scheme_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [
    user.id,
    scheme.id,
  ]);
  return NextResponse.json({ saved: true });
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const { slug } = await req.json().catch(() => ({}));
  const scheme = await row<{ id: number }>('SELECT id FROM schemes WHERE slug = $1', [String(slug ?? '')]);
  if (!scheme) return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
  await run('DELETE FROM saved_schemes WHERE user_id = $1 AND scheme_id = $2', [user.id, scheme.id]);
  return NextResponse.json({ saved: false });
}
