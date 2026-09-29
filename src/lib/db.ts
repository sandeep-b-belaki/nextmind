import fs from 'fs';
import path from 'path';
import { pool, rowRaw, queryReturning } from './pg';
import { categories, departments, demoSchemes, OFFICIAL_PORTALS, PORTAL_OVERRIDES } from './demo-data';
import { extraSchemes } from './demo-data-extra';
import { hashPassword } from './password';

let initialized: Promise<void> | null = null;

export async function initDatabase(): Promise<void> {
  if (!initialized) {
    initialized = (async () => {
      const schemaPath = path.join(process.cwd(), 'docs', 'schema.postgresql.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool().query(schema);
      await seed();
    })().catch((err) => {
      initialized = null;
      throw err;
    });
  }
  return initialized;
}

async function seed(): Promise<void> {
  const client = await pool().connect();
  try {
    await client.query('BEGIN');

    const catIds: Record<string, number> = {};
    for (const c of categories) {
      const r = await client.query(
        `INSERT INTO categories (slug, name_kn, name_en, name_hi, icon, description_kn, description_en, description_hi, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [c.slug, c.name_kn, c.name_en, c.name_hi, c.icon, c.description_kn, c.description_en, c.description_hi, c.sort_order]
      );
      if (r.rows.length > 0) {
        catIds[c.slug] = r.rows[0].id as number;
      } else {
        const existing = await client.query('SELECT id FROM categories WHERE slug = $1', [c.slug]);
        catIds[c.slug] = existing.rows[0].id as number;
      }
    }

    const deptIds: Record<string, number> = {};
    for (const d of departments) {
      const r = await client.query(
        `INSERT INTO departments (slug, name_kn, name_en, name_hi) VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [d.slug, d.name_kn, d.name_en, d.name_hi]
      );
      if (r.rows.length > 0) {
        deptIds[d.slug] = r.rows[0].id as number;
      } else {
        const existing = await client.query('SELECT id FROM departments WHERE slug = $1', [d.slug]);
        deptIds[d.slug] = existing.rows[0].id as number;
      }
    }

    for (const s of [...demoSchemes, ...extraSchemes]) {
      const existing = await client.query('SELECT id FROM schemes WHERE slug = $1', [s.slug]);
      if (existing.rows.length > 0) continue;
      const r = await client.query(
        `INSERT INTO schemes (slug, name_kn, name_en, name_hi, desc_kn, desc_en, desc_hi, simple_kn, simple_en, simple_hi,
            category_id, department_id, start_date, last_date, status, official_url,
            tutorial_video, last_verified_at, verify_status, view_count, is_demo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,1)
         RETURNING id`,
        [
          s.slug, s.name_kn, s.name_en, s.name_hi,
          s.desc_kn, s.desc_en, s.desc_hi,
          s.simple_kn, s.simple_en, s.simple_hi,
          catIds[s.category], deptIds[s.department],
          s.start_date, s.last_date, s.status,
          PORTAL_OVERRIDES[s.slug] || s.official_url || OFFICIAL_PORTALS[s.department] || 'https://karnataka.gov.in',
          s.tutorial_video, s.last_verified_at, s.verify_status, s.view_count,
        ]
      );
      const sid = r.rows[0].id as number;

      for (const rule of s.eligibility) {
        await client.query(
          'INSERT INTO eligibility_rules (scheme_id, field, operator, value) VALUES ($1, $2, $3, $4)',
          [sid, rule.field, rule.operator, rule.value]
        );
      }
      await Promise.all(
        s.documents.map((doc, i) =>
          client.query(
            `INSERT INTO documents (scheme_id, name_kn, name_en, name_hi, desc_kn, desc_en, desc_hi, sort_order)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [sid, doc.name_kn, doc.name_en, doc.name_hi, doc.desc_kn, doc.desc_en, doc.desc_hi, i]
          )
        )
      );
      await Promise.all(
        s.steps.map((st, i) =>
          client.query(
            `INSERT INTO application_steps (scheme_id, step_number, title_kn, title_en, title_hi, body_kn, body_en, body_hi, tip_kn, tip_en, tip_hi)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [sid, i + 1, st.title_kn, st.title_en, st.title_hi, st.body_kn, st.body_en, st.body_hi, st.tip_kn, st.tip_en, st.tip_hi]
          )
        )
      );
      if (s.tutorial_video) {
        await client.query(
          `INSERT INTO tutorials (scheme_id, title_kn, title_en, title_hi, video_url) VALUES ($1, $2, $3, $4, $5)`,
          [sid, 'ಕನ್ನಡ ಟ್ಯುಟೋರಿಯಲ್', 'Kannada Tutorial', 'हिंदी ट्यूटोरियल', s.tutorial_video]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const admin = await rowRaw<{ n: number }>('SELECT COUNT(*)::int AS n FROM admin_users');
  if (!admin || admin.n === 0) {
    await pool().query('INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)', [
      'Admin',
      'admin@nextmind.demo',
      hashPassword('Admin@1234'),
      'admin',
    ]);
  }
}

export { queryReturning };
