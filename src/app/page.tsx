import Link from 'next/link';
import { getLang } from '@/lib/lang';
import { t, tr } from '@/lib/i18n';
import { getCategories, getNewSchemes, getPopularSchemes } from '@/lib/schemes';
import { row } from '@/lib/pg';
import SearchBar from '@/components/SearchBar';
import SchemeCard from '@/components/SchemeCard';
import CategoryCard from '@/components/CategoryCard';
import Disclaimer from '@/components/Disclaimer';
import SectionHeading from '@/components/SectionHeading';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const lang = getLang();
  const categories = await getCategories();
  const newSchemes = await getNewSchemes(6);
  const popular = await getPopularSchemes(6);
  const schemeCount = (
    await row<{ c: number }>(`SELECT COUNT(*)::int AS c FROM schemes WHERE status IN ('published','needs_verification')`)
  )!.c;
  const deptCount = (await row<{ c: number }>('SELECT COUNT(*)::int AS c FROM departments'))!.c;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-100 opacity-60 blur-3xl" aria-hidden />
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-brand-100 opacity-60 blur-3xl" aria-hidden />
        <div className="container-page relative py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-bold text-brand-700 shadow-sm">
              <span aria-hidden>🏛️</span> {tr(lang, 'Karnataka Schemes · ಕರ್ನಾಟಕ', 'कर्नाटक सरकार की योजनाएँ', 'Karnataka Schemes')}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl font-kn text-balance">
              {t(lang, 'hero.title')}
            </h1>
            <p className="mt-3 text-base font-medium text-brand-700 sm:text-lg">{t(lang, 'hero.subtitle')}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base font-kn">
              {t(lang, 'hero.desc')}
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar large />
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/find-schemes" className="btn-accent w-full !px-7 !py-3.5 text-base font-kn sm:w-auto">
                <span aria-hidden>✨</span> {t(lang, 'search.findForMe')}
              </Link>
              <Link href="/how-it-works" className="btn-secondary w-full !px-7 !py-3.5 text-base font-kn sm:w-auto">
                {t(lang, 'nav.how')}
              </Link>
            </div>

            <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                { label: t(lang, 'home.stats.schemes'), value: schemeCount },
                { label: t(lang, 'home.stats.categories'), value: categories.length },
                { label: t(lang, 'home.stats.depts'), value: deptCount },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white/80 p-3 text-center backdrop-blur">
                  <dt className="text-2xl font-extrabold text-brand-700">{s.value}</dt>
                  <dd className="text-xs font-medium text-slate-500 font-kn">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-12 sm:py-16">
        <SectionHeading titleKey="home.categories" subKey="home.categoriesSub" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* New schemes */}
      <section className="border-y border-slate-200 bg-white py-12 sm:py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading titleKey="home.newSchemes" subKey="home.newSchemesSub" />
            <Link href="/schemes" className="mb-6 text-sm font-bold text-brand-700 hover:underline font-kn">
              {t(lang, 'common.viewAll')}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newSchemes.map((s) => (
              <SchemeCard key={s.id} scheme={s} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular schemes */}
      <section className="container-page py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading titleKey="home.popular" subKey="home.popularSub" />
          <Link href="/schemes" className="mb-6 text-sm font-bold text-brand-700 hover:underline font-kn">
            {t(lang, 'common.viewAll')}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((s) => (
            <SchemeCard key={s.id} scheme={s} lang={lang} />
          ))}
        </div>
      </section>

      {/* Find for me CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-brand-700 to-accent-700 py-14 text-white">
        <div className="container-page text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl font-kn">{t(lang, 'home.findTitle')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base font-kn">{t(lang, 'home.findDesc')}</p>
          <Link
            href="/find-schemes"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-800 shadow-lg transition hover:bg-brand-50"
          >
            <span aria-hidden>✨</span> {t(lang, 'search.findForMe')}
          </Link>
        </div>
      </section>

      {/* Demo + disclaimer */}
      <section className="container-page grid gap-4 py-10 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700">
            <span aria-hidden>🧪</span> DEMO DATA
          </p>
          <p className="font-kn">
            {t(lang, 'demo.banner')}
          </p>
        </div>
        <Disclaimer />
      </section>
    </>
  );
}
