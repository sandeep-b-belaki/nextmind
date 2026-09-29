import { rows, row, run, queryReturning } from './pg';
import type { SchemeStatus, VerifyStatus } from './types';

export interface SchemeInput {
  slug?: string;
  name_kn: string;
  name_en: string;
  desc_kn?: string;
  desc_en?: string;
  simple_kn?: string;
  simple_en?: string;
  category_id: number;
  department_id: number;
  start_date: string;
  last_date: string;
  status: SchemeStatus;
  official_url?: string;
  notification_pdf?: string | null;
  tutorial_video?: string | null;
  image?: string | null;
  last_verified_at?: string;
  verify_status?: VerifyStatus;
  eligibility?: { field: string; operator: string; value: string }[];
  documents?: { name_kn: string; name_en: string; desc_kn: string; desc_en: string }[];
  steps?: { title_kn: string; title_en: string; body_kn: string; body_en: string; tip_kn: string; tip_en: string }[];
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9\u0C80-\u0CFF]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || `scheme-${Date.now()}`
  );
}

export async function adminGetStats() {
  const q = async (sql: string, params: unknown[] = []) => {
    const r = await row<{ c: number }>(sql, params);
    return Number(r?.c ?? 0);
  };
  return {
    total: await q('SELECT COUNT(*)::int AS c FROM schemes'),
    published: await q(`SELECT COUNT(*)::int AS c FROM schemes WHERE status='published'`),
    draft: await q(`SELECT COUNT(*)::int AS c FROM schemes WHERE status='draft'`),
    expired: await q(`SELECT COUNT(*)::int AS c FROM schemes WHERE status='expired' OR last_date < CURRENT_DATE`),
    needs_verification: await q(`SELECT COUNT(*)::int AS c FROM schemes WHERE status='needs_verification' OR verify_status='needs_review'`),
    users: await q('SELECT COUNT(*)::int AS c FROM users'),
    reports_open: await q(`SELECT COUNT(*)::int AS c FROM reports WHERE status='open'`),
    categories: await q('SELECT COUNT(*)::int AS c FROM categories'),
    departments: await q('SELECT COUNT(*)::int AS c FROM departments'),
    mostViewed: await rows<{ slug: string; name_kn: string; name_en: string; view_count: number; status: string }>(
      `SELECT slug, name_kn, name_en, view_count, status FROM schemes ORDER BY view_count DESC LIMIT 5`
    ),
    expiringSoon: await rows<{ slug: string; name_kn: string; name_en: string; last_date: string }>(
      `SELECT slug, name_kn, name_en, last_date FROM schemes
       WHERE status IN ('published','needs_verification') AND last_date >= CURRENT_DATE
       ORDER BY last_date ASC LIMIT 5`
    ),
    recentReports: await rows<{ id: number; type: string; message: string; scheme_slug: string | null; status: string; created_at: string }>(
      `SELECT * FROM reports ORDER BY created_at DESC LIMIT 5`
    ),
  };
}

export async function adminCreateScheme(input: SchemeInput): Promise<number> {
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name_en || input.name_kn);
  const exists = await row('SELECT 1 FROM schemes WHERE slug = $1', [slug]);
  const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug;

  const created = await queryReturning<{ id: number }>(
    `INSERT INTO schemes (slug, name_kn, name_en, desc_kn, desc_en, simple_kn, simple_en,
      category_id, department_id, start_date, last_date, status, official_url,
      notification_pdf, tutorial_video, image, last_verified_at, verify_status, view_count, is_demo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,0,1)
     RETURNING id`,
    [
      finalSlug, input.name_kn, input.name_en, input.desc_kn ?? '', input.desc_en ?? '',
      input.simple_kn ?? '', input.simple_en ?? '', input.category_id, input.department_id,
      input.start_date, input.last_date, input.status, input.official_url ?? '',
      input.notification_pdf ?? null, input.tutorial_video ?? null, input.image ?? null,
      input.last_verified_at ?? new Date().toISOString().slice(0, 10), input.verify_status ?? 'needs_review',
    ]
  );
  const id = created[0].id;
  await replaceChildren(id, input);
  return id;
}

export async function adminUpdateScheme(id: number, input: SchemeInput): Promise<void> {
  const existing = await row('SELECT id FROM schemes WHERE id = $1', [id]);
  if (!existing) throw new Error('NOT_FOUND');

  await run(
    `UPDATE schemes SET name_kn=$1, name_en=$2, desc_kn=$3, desc_en=$4, simple_kn=$5, simple_en=$6,
      category_id=$7, department_id=$8, start_date=$9, last_date=$10, status=$11, official_url=$12,
      notification_pdf=$13, tutorial_video=$14, image=$15, last_verified_at=$16, verify_status=$17,
      updated_at=now()
     WHERE id=$18`,
    [
      input.name_kn, input.name_en, input.desc_kn ?? '', input.desc_en ?? '',
      input.simple_kn ?? '', input.simple_en ?? '', input.category_id, input.department_id,
      input.start_date, input.last_date, input.status, input.official_url ?? '',
      input.notification_pdf ?? null, input.tutorial_video ?? null, input.image ?? null,
      input.last_verified_at ?? new Date().toISOString().slice(0, 10), input.verify_status ?? 'needs_review',
      id,
    ]
  );

  await replaceChildren(id, input);
}

async function replaceChildren(schemeId: number, input: SchemeInput): Promise<void> {
  await run('DELETE FROM eligibility_rules WHERE scheme_id = $1', [schemeId]);
  await run('DELETE FROM documents WHERE scheme_id = $1', [schemeId]);
  await run('DELETE FROM application_steps WHERE scheme_id = $1', [schemeId]);

  for (const r of input.eligibility ?? []) {
    if (r.field && r.value !== '') {
      await run('INSERT INTO eligibility_rules (scheme_id, field, operator, value) VALUES ($1, $2, $3, $4)', [
        schemeId, r.field, r.operator || 'eq', String(r.value),
      ]);
    }
  }
  const docs = input.documents ?? [];
  for (let i = 0; i < docs.length; i++) {
    const d = docs[i];
    if (d.name_kn || d.name_en) {
      await run('INSERT INTO documents (scheme_id, name_kn, name_en, desc_kn, desc_en, sort_order) VALUES ($1,$2,$3,$4,$5,$6)', [
        schemeId, d.name_kn, d.name_en, d.desc_kn ?? '', d.desc_en ?? '', i,
      ]);
    }
  }
  const steps = input.steps ?? [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.title_kn || s.title_en) {
      await run(
        `INSERT INTO application_steps (scheme_id, step_number, title_kn, title_en, body_kn, body_en, tip_kn, tip_en)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [schemeId, i + 1, s.title_kn, s.title_en, s.body_kn ?? '', s.body_en ?? '', s.tip_kn ?? '', s.tip_en ?? '']
      );
    }
  }
}

export async function adminDeleteScheme(id: number): Promise<void> {
  await run('DELETE FROM schemes WHERE id = $1', [id]);
}

export async function adminVerifyScheme(id: number, verify: VerifyStatus, status?: SchemeStatus, notes = ''): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (status) {
    await run('UPDATE schemes SET verify_status=$1, status=$2, last_verified_at=$3, updated_at=now() WHERE id=$4', [
      verify, status, today, id,
    ]);
  } else {
    await run('UPDATE schemes SET verify_status=$1, last_verified_at=$2, updated_at=now() WHERE id=$3', [
      verify, today, id,
    ]);
  }
  const admin = await row<{ id: number }>(`SELECT id FROM admin_users ORDER BY id LIMIT 1`);
  await run('INSERT INTO scheme_verification (scheme_id, status, notes, admin_id) VALUES ($1, $2, $3, $4)', [
    id, verify, notes, admin?.id ?? null,
  ]);
}

export async function adminCreateCategory(data: { slug: string; name_kn: string; name_en: string; icon?: string; description_kn?: string; description_en?: string }) {
  await run(
    'INSERT INTO categories (slug, name_kn, name_en, icon, description_kn, description_en, sort_order) VALUES ($1,$2,$3,$4,$5,$6,99)',
    [slugify(data.slug || data.name_en), data.name_kn, data.name_en, data.icon ?? '📁', data.description_kn ?? '', data.description_en ?? '']
  );
}

export async function adminCreateDepartment(data: { slug: string; name_kn: string; name_en: string }) {
  await run('INSERT INTO departments (slug, name_kn, name_en) VALUES ($1,$2,$3)', [
    slugify(data.slug || data.name_en), data.name_kn, data.name_en,
  ]);
}

export async function adminListUsers() {
  return rows<{ id: number; name: string; email: string; created_at: string }>(
    'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 200'
  );
}

export async function adminListReports() {
  return rows<{
    id: number; scheme_id: number | null; scheme_slug: string | null; type: string;
    message: string; email: string; status: string; created_at: string;
  }>('SELECT * FROM reports ORDER BY created_at DESC LIMIT 200');
}

export async function adminUpdateReportStatus(id: number, status: string) {
  await run('UPDATE reports SET status = $1 WHERE id = $2', [status, id]);
}
