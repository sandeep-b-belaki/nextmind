'use client';

import { useLang } from './Providers';
import { t } from '@/lib/i18n';
import ESahayakAvatar from './ESahayakAvatar';

export default function ESahayakCard() {
  const lang = useLang();

  return (
    <div className="mx-auto flex max-w-2xl items-start gap-4 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-accent-50 p-5 shadow-card sm:gap-5 sm:p-6">
      <ESahayakAvatar size={96} className="shrink-0" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-extrabold text-slate-900">E-Sahayak</h2>
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            AI
          </span>
        </div>
        <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-brand-700 font-kn">
          {t(lang, 'sahayak.role')}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 font-kn">{t(lang, 'sahayak.greeting')}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 font-kn">{t(lang, 'sahayak.hint')}</p>
      </div>
    </div>
  );
}
