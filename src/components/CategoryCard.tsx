'use client';

import Link from 'next/link';
import { useLang } from './Providers';
import { content } from '@/lib/i18n';
import type { Category } from '@/lib/types';

export default function CategoryCard({ category, count }: { category: Category; count?: number }) {
  const lang = useLang();
  const name = content(lang, category.name_kn, category.name_en, category.name_hi);
  const desc = content(lang, category.description_kn, category.description_en, category.description_hi);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-2xl" aria-hidden>
        {category.icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-slate-900 group-hover:text-brand-700 font-kn">{name}</span>
          {typeof count === 'number' && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{count}</span>
          )}
        </span>
        <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-slate-500 font-kn">{desc}</span>
      </span>
    </Link>
  );
}
