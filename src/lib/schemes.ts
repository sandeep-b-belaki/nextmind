import { rows, row, run } from './pg';
import type { Category, Department, SchemeDetail, SchemeListItem, SearchFilters } from './types';

const SELECT_LIST = `
  SELECT s.*, c.slug AS category_slug, c.name_kn AS category_name_kn, c.name_en AS category_name_en,
         c.name_hi AS category_name_hi,
         c.icon AS category_icon, d.slug AS department_slug, d.name_kn AS department_name_kn,
         d.name_en AS department_name_en, d.name_hi AS department_name_hi,
         (SELECT COUNT(*) FROM eligibility_rules er WHERE er.scheme_id = s.id) AS eligibility_count
  FROM schemes s
  JOIN categories c ON c.id = s.category_id
  JOIN departments d ON d.id = s.department_id
`;

export async function getCategories(): Promise<Category[]> {
  return rows<Category>('SELECT * FROM categories ORDER BY sort_order');
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return row<Category>('SELECT * FROM categories WHERE slug = $1', [slug]);
}

export async function getDepartments(): Promise<Department[]> {
  return rows<Department>('SELECT * FROM departments ORDER BY name_en');
}

export async function getPublishedSchemes(): Promise<SchemeListItem[]> {
  return rows<SchemeListItem>(
    `${SELECT_LIST} WHERE s.status IN ('published','needs_verification') ORDER BY s.last_date ASC`
  );
}

export async function getNewSchemes(limit = 6): Promise<SchemeListItem[]> {
  return rows<SchemeListItem>(
    `${SELECT_LIST} WHERE s.status IN ('published','needs_verification') ORDER BY s.created_at DESC, s.id DESC LIMIT $1`,
    [limit]
  );
}

export async function getPopularSchemes(limit = 6): Promise<SchemeListItem[]> {
  return rows<SchemeListItem>(
    `${SELECT_LIST} WHERE s.status IN ('published','needs_verification') ORDER BY s.view_count DESC LIMIT $1`,
    [limit]
  );
}

export async function getSchemeBySlug(slug: string, opts?: { incrementView?: boolean }): Promise<SchemeDetail | null> {
  const found = await row<SchemeDetail>(`${SELECT_LIST} WHERE s.slug = $1`, [slug]);
  if (!found) return null;
  if (opts?.incrementView) {
    await run('UPDATE schemes SET view_count = view_count + 1 WHERE id = $1', [found.id]);
  }
  found.eligibility = await rows('SELECT * FROM eligibility_rules WHERE scheme_id = $1', [found.id]);
  found.documents = await rows('SELECT * FROM documents WHERE scheme_id = $1 ORDER BY sort_order', [found.id]);
  found.steps = await rows('SELECT * FROM application_steps WHERE scheme_id = $1 ORDER BY step_number', [found.id]);
  found.tutorials = await rows('SELECT * FROM tutorials WHERE scheme_id = $1', [found.id]);
  return found;
}

export async function searchSchemes(filters: SearchFilters): Promise<SchemeListItem[]> {
  const where: string[] = [`s.status IN ('published','needs_verification')`];
  const params: unknown[] = [];

  if (filters.q) {
    const tokens = filters.q.trim().split(/\s+/).slice(0, 8);
    for (const token of tokens) {
      params.push(token);
      const p = `$${params.length}`;
      where.push(
        `(s.name_kn ILIKE '%' || ${p} || '%' OR s.name_en ILIKE '%' || ${p} || '%' OR s.desc_kn ILIKE '%' || ${p} || '%' OR s.desc_en ILIKE '%' || ${p} || '%'
          OR s.simple_kn ILIKE '%' || ${p} || '%' OR s.simple_en ILIKE '%' || ${p} || '%'
          OR c.name_kn ILIKE '%' || ${p} || '%' OR c.name_en ILIKE '%' || ${p} || '%'
          OR d.name_kn ILIKE '%' || ${p} || '%' OR d.name_en ILIKE '%' || ${p} || '%')`
      );
    }
  }
  if (filters.category) {
    params.push(filters.category);
    where.push(`c.slug = $${params.length}`);
  }
  if (filters.department) {
    params.push(filters.department);
    where.push(`d.slug = $${params.length}`);
  }
  if (filters.status === 'open') {
    where.push(`s.status != 'expired' AND s.last_date >= CURRENT_DATE`);
  } else if (filters.status === 'closed') {
    where.push(`(s.last_date < CURRENT_DATE OR s.status = 'expired')`);
  }
  if (filters.eligibility === 'students') where.push(`EXISTS (SELECT 1 FROM eligibility_rules er WHERE er.scheme_id = s.id AND er.field = 'student' AND er.value = 'true')`);
  if (filters.eligibility === 'farmers') where.push(`EXISTS (SELECT 1 FROM eligibility_rules er WHERE er.scheme_id = s.id AND er.field = 'farmer' AND er.value = 'true')`);
  if (filters.eligibility === 'women') where.push(`EXISTS (SELECT 1 FROM eligibility_rules er WHERE er.scheme_id = s.id AND er.field = 'gender' AND er.value = 'female')`);
  if (filters.eligibility === 'seniors') where.push(`EXISTS (SELECT 1 FROM eligibility_rules er WHERE er.scheme_id = s.id AND er.field = 'age_min' AND CAST(er.value AS INTEGER) >= 60)`);
  if (filters.eligibility === 'disability') where.push(`EXISTS (SELECT 1 FROM eligibility_rules er WHERE er.scheme_id = s.id AND er.field = 'disability' AND er.value = 'true')`);

  const sql = `${SELECT_LIST} WHERE ${where.join(' AND ')} ORDER BY s.last_date ASC`;
  return rows<SchemeListItem>(sql, params);
}

export async function countSchemes(): Promise<{ total: number; published: number; draft: number; expired: number; needs_verification: number }> {
  const r = await row<{
    total: number; published: number; draft: number; expired: number; needs_verification: number;
  }>(
    `SELECT COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status='published')::int AS published,
       COUNT(*) FILTER (WHERE status='draft')::int AS draft,
       COUNT(*) FILTER (WHERE status='expired')::int AS expired,
       COUNT(*) FILTER (WHERE status='needs_verification')::int AS needs_verification
     FROM schemes`
  );
  return r ?? { total: 0, published: 0, draft: 0, expired: 0, needs_verification: 0 };
}

export async function getSavedSchemes(userId: number): Promise<SchemeListItem[]> {
  return rows<SchemeListItem>(
    `${SELECT_LIST}
     JOIN saved_schemes ss ON ss.scheme_id = s.id
     WHERE ss.user_id = $1
     ORDER BY ss.created_at DESC`,
    [userId]
  );
}

export { applicationStatus } from './status';

export async function incrementView(slug: string) {
  await run('UPDATE schemes SET view_count = view_count + 1 WHERE slug = $1', [slug]);
}
