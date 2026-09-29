import type { MetadataRoute } from 'next';
import { rows } from '@/lib/pg';

export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://nextmind.example';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const schemes = await rows<{ slug: string; updated_at: string }>(
    `SELECT slug, updated_at FROM schemes WHERE status IN ('published','needs_verification')`
  );
  const categories = await rows<{ slug: string }>('SELECT slug FROM categories');

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/schemes`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/categories`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/find-schemes`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/how-it-works`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.4 },
  ];

  return [
    ...staticPages,
    ...categories.map((c) => ({
      url: `${BASE}/categories/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...schemes.map((s) => ({
      url: `${BASE}/schemes/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
    ...schemes.map((s) => ({
      url: `${BASE}/kannada/schemes/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ];
}
