'use client';

import Link from 'next/link';
import { t, content } from '@/lib/i18n';
import { applicationStatus } from '@/lib/status';
import type { Lang, SchemeListItem } from '@/lib/types';

const statusStyles: Record<string, string> = {
  open: 'bg-accent-100 text-accent-800',
  upcoming: 'bg-brand-100 text-brand-800',
  closed: 'bg-slate-100 text-slate-500',
};

export function StatusBadge({ scheme, lang }: { scheme: SchemeListItem; lang: Lang }) {
  const status = applicationStatus(scheme);
  const dot = status === 'open' ? 'bg-accent-500' : status === 'upcoming' ? 'bg-brand-500' : 'bg-slate-400';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {t(lang, `scheme.status.${status}`)}
    </span>
  );
}

export function VerifyBadge({ status, lang }: { status: string; lang: Lang }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold text-accent-700">
        ✓ {t(lang, 'scheme.verified')}
      </span>
    );
  }
  if (status === 'expired') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
        ● {t(lang, 'scheme.expired')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
      ● {t(lang, 'scheme.needsReview')}
    </span>
  );
}

export default function SchemeCard({ scheme, lang }: { scheme: SchemeListItem; lang: Lang }) {
  const name = content(lang, scheme.name_kn, scheme.name_en, scheme.name_hi);
  const desc = content(lang, scheme.desc_kn, scheme.desc_en, scheme.desc_hi);
  const dept = content(lang, scheme.department_name_kn, scheme.department_name_en, scheme.department_name_hi);
  const cat = content(lang, scheme.category_name_kn, scheme.category_name_en, scheme.category_name_hi);

  return (
    <article className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl" aria-hidden>
          {scheme.category_icon}
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge scheme={scheme} lang={lang} />
          <VerifyBadge status={scheme.verify_status} lang={lang} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-brand-700">
        <span className="rounded-md bg-brand-50 px-2 py-0.5 font-kn">{cat}</span>
        {scheme.is_demo === 1 && (
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-amber-700">{t(lang, 'scheme.demo')}</span>
        )}
      </div>

      <h3 className="mt-2 text-base font-bold leading-snug text-slate-900 font-kn group-hover:text-brand-700">
        {name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500 font-kn">{desc}</p>

      <dl className="mt-3 space-y-1.5 text-xs text-slate-500">
        <div className="flex justify-between gap-2">
          <dt className="font-medium">{t(lang, 'scheme.department')}:</dt>
          <dd className="truncate text-right font-kn">{dept}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="font-medium">{t(lang, 'scheme.lastDate')}:</dt>
          <dd className="font-semibold text-slate-700">{scheme.last_date}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
        <Link href={`/schemes/${scheme.slug}`} className="btn-primary flex-1 !px-3 !py-2 text-xs font-kn">
          {t(lang, 'scheme.viewDetails')}
        </Link>
        <a
          href={scheme.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 !px-3 !py-2 text-xs font-kn"
          title={t(lang, 'scheme.applyNote')}
        >
          {t(lang, 'scheme.apply')}
        </a>
      </div>
    </article>
  );
}
