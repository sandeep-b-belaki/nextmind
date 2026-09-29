'use client';

import { useLang } from './Providers';
import { t } from '@/lib/i18n';

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  const lang = useLang();
  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-amber-50 ${compact ? 'p-4' : 'p-5'} text-sm leading-relaxed text-amber-900`}
      role="note"
    >
      <p className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700">
        <span aria-hidden>⚠️</span> {t(lang, 'disclaimer.title')}
      </p>
      <p className="font-kn">{t(lang, 'disclaimer.body')}</p>
    </div>
  );
}
