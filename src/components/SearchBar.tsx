'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLang } from './Providers';
import { t, tr } from '@/lib/i18n';

export default function SearchBar({ large = false, initialValue = '' }: { large?: boolean; initialValue?: string }) {
  const lang = useLang();
  const router = useRouter();
  const [q, setQ] = useState(initialValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/schemes?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} role="search" className="w-full">
      <div className={`flex gap-2 ${large ? 'flex-col sm:flex-row' : 'flex-row'}`}>
        <label htmlFor="scheme-search" className="sr-only">
          {t(lang, 'search.placeholder')}
        </label>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
            🔍
          </span>
          <input
            id="scheme-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(lang, 'search.placeholder')}
            className={`input !pl-11 ${large ? '!py-4 !text-base' : '!py-3'} font-kn`}
          />
        </div>
        <button type="submit" className={large ? 'btn-primary !px-8 !py-4 text-base font-kn' : 'btn-primary !px-5 !py-3 font-kn'}>
          {t(lang, 'search.button')}
        </button>
      </div>
      {large && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-medium">{tr(lang, 'ಉದಾಹರಣೆ:', 'प्रयास करें:', 'Try:')}</span>
          {(lang === 'hi'
            ? ['छात्रवृत्ति', 'किसान सब्सिडी', 'पेंशन', 'महिला योजना']
            : ['Scholarship', 'ವಿದ್ಯಾರ್ಥಿ ವೇತನ', 'Farmer subsidy', 'ರೈತ']
          ).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQ(ex);
                router.push(`/schemes?q=${encodeURIComponent(ex)}`);
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 hover:border-brand-300 hover:text-brand-700 font-kn"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
