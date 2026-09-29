import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';
import { getCategories, getDepartments, searchSchemes } from '@/lib/schemes';
import SchemeCard from '@/components/SchemeCard';
import SchemeFilters from '@/components/SchemeFilters';
import SearchBar from '@/components/SearchBar';
import Disclaimer from '@/components/Disclaimer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Government Schemes — ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
  description:
    'Search and filter Karnataka government schemes, scholarships, subsidies and welfare programs by category, department and application status.',
  alternates: { languages: { 'kn-IN': '/kannada/schemes', 'en-US': '/schemes' } },
};

interface Props {
  searchParams: { q?: string; category?: string; department?: string; status?: string; eligibility?: string };
}

export default async function SchemesPage({ searchParams }: Props) {
  const lang = getLang();
  const categories = await getCategories();
  const departments = await getDepartments();
  const results = await searchSchemes(searchParams);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl font-kn">{t(lang, 'nav.schemes')}</h1>
        <p className="mt-2 text-sm text-slate-500 font-kn">
          {t(lang, 'hero.desc')}
        </p>
        <div className="mt-6">
          <Suspense>
            <SearchBar initialValue={searchParams.q ?? ''} />
          </Suspense>
        </div>
      </div>

      <div className="mt-8">
        <SchemeFilters categories={categories} departments={departments} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600 font-kn">
          {results.length} {t(lang, 'filter.results')}
          {searchParams.q ? ` — ${t(lang, 'common.resultsFor')} “${searchParams.q}”` : ''}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="card mt-4 p-10 text-center text-slate-500 font-kn">{t(lang, 'common.noResults')}</div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
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
