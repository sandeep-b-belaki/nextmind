import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLang } from '@/lib/lang';
import { t, content } from '@/lib/i18n';
import { getSchemeBySlug } from '@/lib/schemes';
import { StatusBadge, VerifyBadge } from '@/components/SchemeCard';
import Disclaimer from '@/components/Disclaimer';
import DocumentChecklist from '@/components/DocumentChecklist';
import SaveButton from '@/components/SaveButton';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scheme = await getSchemeBySlug(params.slug);
  if (!scheme) return { title: 'Scheme not found' };
  const name = scheme.name_kn;
  const desc = scheme.desc_en;
  return {
    title: `${name} (${scheme.name_en})`,
    description: desc,
    alternates: {
      canonical: `/schemes/${scheme.slug}`,
      languages: { 'kn-IN': `/kannada/schemes/${scheme.slug}`, 'en-US': `/schemes/${scheme.slug}` },
    },
    openGraph: {
      title: `${scheme.name_en} | E-Sahayak`,
      description: desc,
      type: 'article',
    },
  };
}

export default async function SchemeDetailPage({ params }: Props) {
  const lang = getLang();
  const scheme = await getSchemeBySlug(params.slug, { incrementView: true });
  if (!scheme) notFound();

  const name = content(lang, scheme.name_kn, scheme.name_en, scheme.name_hi);
  const desc = content(lang, scheme.desc_kn, scheme.desc_en, scheme.desc_hi);
  const simple = content(lang, scheme.simple_kn, scheme.simple_en, scheme.simple_hi);
  const dept = content(lang, scheme.department_name_kn, scheme.department_name_en, scheme.department_name_hi);
  const cat = content(lang, scheme.category_name_kn, scheme.category_name_en, scheme.category_name_hi);

  const eligibilityLabels: Record<string, string> = {
    residency: t(lang, 'elig.residency'),
    student: t(lang, 'elig.student'),
    farmer: t(lang, 'elig.farmer'),
    disability: t(lang, 'elig.disability'),
    gender: t(lang, 'elig.gender'),
    employment: t(lang, 'elig.employment'),
    age_min: t(lang, 'elig.ageMin'),
    age_max: t(lang, 'elig.ageMax'),
    income_max: t(lang, 'elig.income'),
  };

  const eligibilityText = (field: string, op: string, value: string) => {
    if (field === 'age_min') return `${eligibilityLabels.age_min}: ${value}+`;
    if (field === 'age_max') return `${eligibilityLabels.age_max}: ${value}`;
    if (field === 'income_max') return `${eligibilityLabels.income_max}: ₹${(Number(value) / 100000).toFixed(2)} L`;
    if (field === 'residency') return eligibilityLabels.residency;
    if (field === 'student') return eligibilityLabels.student;
    if (field === 'farmer') return eligibilityLabels.farmer;
    if (field === 'disability') return eligibilityLabels.disability;
    if (field === 'gender') {
      if (value === 'female') return t(lang, 'elig.female');
      if (value === 'male') return t(lang, 'elig.male');
      return t(lang, 'elig.all');
    }
    if (field === 'employment') {
      const map: Record<string, string> = {
        unemployed: t(lang, 'elig.unemployed'),
        employed: t(lang, 'elig.employed'),
        selfemployed: t(lang, 'elig.selfemployed'),
      };
      return map[value] ?? value;
    }
    return `${field} ${op} ${value}`;
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: scheme.name_en,
    alternateName: scheme.name_kn,
    description: scheme.desc_en,
    provider: { '@type': 'Organization', name: dept },
    applicationDeadline: scheme.last_date,
    serviceType: cat,
    url: `/schemes/${scheme.slug}`,
  };

  return (
    <div className="container-page py-8 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700 font-kn">{t(lang, 'nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link href="/schemes" className="hover:text-brand-700 font-kn">{t(lang, 'nav.schemes')}</Link>
        <span aria-hidden>/</span>
        <Link href={`/categories/${scheme.category_slug}`} className="hover:text-brand-700 font-kn">{cat}</Link>
      </nav>

      {/* Scheme header */}
      <header className="card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 font-kn">
                {scheme.category_icon} {cat}
              </span>
              {scheme.is_demo === 1 && (
                <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">DEMO DATA</span>
              )}
              <VerifyBadge status={scheme.verify_status} lang={lang} />
            </div>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl font-kn">{name}</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500 font-kn">
              {t(lang, 'scheme.department')}: <span className="text-slate-700">{dept}</span>
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 font-kn">{desc}</p>

            <dl className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 px-4 py-2.5">
                <dt className="text-xs font-medium text-slate-500 font-kn">{t(lang, 'scheme.startDate')}</dt>
                <dd className="font-bold text-slate-800">{scheme.start_date}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-2.5">
                <dt className="text-xs font-medium text-slate-500 font-kn">{t(lang, 'scheme.lastDate')}</dt>
                <dd className="font-bold text-slate-800">{scheme.last_date}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-2.5">
                <dt className="text-xs font-medium text-slate-500 font-kn">{t(lang, 'scheme.views')}</dt>
                <dd className="font-bold text-slate-800">{scheme.view_count + 1}</dd>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 flex-col gap-3 lg:w-64">
            <StatusBadge scheme={scheme} lang={lang} />
            <a
              href={scheme.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-3.5 text-center font-kn"
            >
              {t(lang, 'scheme.apply')} ↗
            </a>
            <SaveButton schemeSlug={scheme.slug} />
            <p className="text-[11px] leading-relaxed text-slate-400 font-kn">{t(lang, 'scheme.applyNote')}</p>
          </div>
        </div>
      </header>

      <div className="mt-5">
        <Disclaimer />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Simple explanation */}
          <section className="card p-6 sm:p-7" id="simple-explanation">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 font-kn">
              <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-base">💡</span>
              {t(lang, 'scheme.simple')}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-700 font-kn">{simple}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 font-kn">{scheme.desc_en}</p>
          </section>

          {/* Eligibility */}
          <section className="card p-6 sm:p-7" id="eligibility">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 font-kn">
              <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-base">✅</span>
              {t(lang, 'scheme.eligibility')}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {scheme.eligibility.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-accent-100 bg-accent-50/60 p-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-600 text-[11px] font-bold text-white" aria-hidden>
                    ✓
                  </span>
                  <span className="text-sm font-semibold text-slate-800 font-kn">
                    {eligibilityText(rule.field, rule.operator, rule.value)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-xs font-semibold leading-relaxed text-amber-800 font-kn">
              <span aria-hidden>⚠️</span> {t(lang, 'scheme.eligibilityNote')}
            </p>
          </section>

          {/* Required documents */}
          <section className="card p-6 sm:p-7" id="documents">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 font-kn">
              <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-base">📄</span>
              {t(lang, 'scheme.documents')}
            </h2>
            <ul className="mt-4 space-y-3">
              {scheme.documents.map((doc, i) => (
                <li key={doc.id ?? i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="mt-0.5 text-base" aria-hidden>🗳️</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 font-kn">{content(lang, doc.name_kn, doc.name_en, doc.name_hi)}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500 font-kn">{content(lang, doc.desc_kn, doc.desc_en, doc.desc_hi)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Step-by-step guide */}
          <section className="card p-6 sm:p-7" id="steps">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 font-kn">
                <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-base">🗺️</span>
                {t(lang, 'scheme.steps')}
              </h2>
              {scheme.tutorial_video && (
                <a
                  href={scheme.tutorial_video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent !px-4 !py-2 text-xs font-kn"
                >
                  ▶ {t(lang, 'scheme.watchTutorial')}
                </a>
              )}
            </div>

            <ol className="mt-6 space-y-0">
              {scheme.steps.map((step, i) => {
                const last = i === scheme.steps.length - 1;
                const title = content(lang, step.title_kn, step.title_en, step.title_hi);
                const body = content(lang, step.body_kn, step.body_en, step.body_hi);
                const tip = content(lang, step.tip_kn, step.tip_en, step.tip_hi);
                return (
                  <li key={step.id ?? i} className="relative flex gap-4 pb-7 last:pb-0">
                    {!last && <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-brand-100" aria-hidden />}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white ring-4 ring-brand-50">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-white p-4">
                      <p className="text-sm font-bold text-slate-900 font-kn">
                        <span className="mr-1.5 text-[10px] font-extrabold uppercase text-brand-600">
                          {t(lang, 'scheme.step')} {i + 1}
                        </span>
                        {title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 font-kn">{body}</p>
                      {tip && (
                        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-xs leading-relaxed text-brand-800 font-kn">
                          <span aria-hidden>💡</span> {tip}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Official source */}
          <section className="card border-2 border-brand-100 p-6 sm:p-7" id="official">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 font-kn">
              <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-base">🏛️</span>
              {t(lang, 'scheme.official')}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex flex-wrap gap-1">
                <dt className="w-40 font-semibold text-slate-500 font-kn">{t(lang, 'scheme.department')}:</dt>
                <dd className="font-semibold text-slate-800 font-kn">{dept}</dd>
              </div>
              <div className="flex flex-wrap gap-1">
                <dt className="w-40 font-semibold text-slate-500 font-kn">{t(lang, 'scheme.lastVerified')}:</dt>
                <dd className="font-semibold text-slate-800">{scheme.last_verified_at}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={scheme.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 text-center font-kn"
              >
                {t(lang, 'scheme.viewNotification')} ↗
              </a>
              <a
                href={scheme.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center font-kn"
              >
                {t(lang, 'scheme.openWebsite')} ↗
              </a>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400 font-kn">
              {t(lang, 'demo.linkNote')}
            </p>
          </section>

          {/* Report incorrect info */}
          <section className="card p-5">
            <p className="text-sm text-slate-600 font-kn">
              {t(lang, 'scheme.infoIncorrect')}
            </p>
            <Link
              href={`/contact?type=report&scheme=${scheme.slug}`}
              className="btn-secondary mt-3 !py-2.5 text-xs font-kn"
            >
              {t(lang, 'scheme.reportBtn')}
            </Link>
          </section>
        </div>

        {/* Sidebar: application checklist */}
        <aside className="space-y-6">
          <DocumentChecklist documents={scheme.documents} />

          <div className="card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 font-kn">
              {t(lang, 'scheme.official')}
            </h3>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-kn">{t(lang, 'scheme.category')}</span>
                <Link href={`/categories/${scheme.category_slug}`} className="font-bold text-brand-700 hover:underline font-kn">
                  {cat}
                </Link>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-kn">{t(lang, 'scheme.lastDate')}</span>
                <span className="font-bold text-slate-800">{scheme.last_date}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-kn">{t(lang, 'scheme.lastVerified')}</span>
                <span className="font-bold text-slate-800">{scheme.last_verified_at}</span>
              </div>
            </div>
            <div className="mt-4">
              <VerifyBadge status={scheme.verify_status} lang={lang} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
