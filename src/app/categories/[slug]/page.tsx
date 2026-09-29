import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLang } from '@/lib/lang';
import { t, content } from '@/lib/i18n';
import { getCategoryBySlug, searchSchemes } from '@/lib/schemes';
import SchemeCard from '@/components/SchemeCard';
import Disclaimer from '@/components/Disclaimer';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) return { title: 'Category not found' };
  return {
    title: `${cat.name_en} Schemes`,
    description: cat.description_en,
    alternates: { canonical: `/categories/${cat.slug}` },
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const lang = getLang();
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const schemes = await searchSchemes({ category: category.slug });
  const name = content(lang, category.name_kn, category.name_en, category.name_hi);
  const desc = content(lang, category.description_kn, category.description_en, category.description_hi);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="mb-5 flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700 font-kn">{t(lang, 'nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link href="/categories" className="hover:text-brand-700 font-kn">{t(lang, 'nav.categories')}</Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-slate-700 font-kn">{name}</span>
      </nav>

      <div className="card flex items-start gap-4 p-6 sm:p-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-3xl" aria-hidden>
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl font-kn">{name}</h1>
          <p className="mt-1.5 text-sm text-slate-500 font-kn">{desc}</p>
          <p className="mt-2 text-xs font-bold text-brand-700">
            {schemes.length} {t(lang, 'filter.results')}
          </p>
        </div>
      </div>

      {schemes.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-slate-500 font-kn">{t(lang, 'common.noResults')}</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((s) => (
            <SchemeCard key={s.id} scheme={s} lang={lang} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
