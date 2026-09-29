'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLang } from './Providers';
import { t, content } from '@/lib/i18n';
import type { Category, Department } from '@/lib/types';

interface Props {
  categories: Category[];
  departments: Department[];
}

export default function SchemeFilters({ categories, departments }: Props) {
  const lang = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    router.replace(`${pathname}?${next.toString()}`);
  };

  const clear = () => router.replace(pathname);

  const hasFilters = ['q', 'category', 'department', 'status', 'eligibility'].some((k) => params.get(k));

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 font-kn">{t(lang, 'filter.title')}</h2>
        {hasFilters && (
          <button onClick={clear} className="text-xs font-bold text-brand-700 hover:underline font-kn">
            {t(lang, 'filter.clear')}
          </button>
        )}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="f-category" className="label font-kn">{t(lang, 'filter.category')}</label>
          <select
            id="f-category"
            className="input !py-2.5 !text-sm"
            value={params.get('category') ?? ''}
            onChange={(e) => update('category', e.target.value)}
          >
            <option value="">{t(lang, 'filter.all')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.icon} {content(lang, c.name_kn, c.name_en, c.name_hi)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-dept" className="label font-kn">{t(lang, 'filter.department')}</label>
          <select
            id="f-dept"
            className="input !py-2.5 !text-sm"
            value={params.get('department') ?? ''}
            onChange={(e) => update('department', e.target.value)}
          >
            <option value="">{t(lang, 'filter.all')}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.slug}>
                {content(lang, d.name_kn, d.name_en, d.name_hi)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-status" className="label font-kn">{t(lang, 'filter.status')}</label>
          <select
            id="f-status"
            className="input !py-2.5 !text-sm"
            value={params.get('status') ?? ''}
            onChange={(e) => update('status', e.target.value)}
          >
            <option value="">{t(lang, 'filter.all')}</option>
            <option value="open">{t(lang, 'filter.open')}</option>
            <option value="closed">{lang === 'kn' ? 'ಮುಗಿದ ಅರ್ಜಿಗಳು' : 'Closed applications'}</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-elig" className="label font-kn">{t(lang, 'filter.eligibility')}</label>
          <select
            id="f-elig"
            className="input !py-2.5 !text-sm"
            value={params.get('eligibility') ?? ''}
            onChange={(e) => update('eligibility', e.target.value)}
          >
            <option value="">{t(lang, 'filter.all')}</option>
            <option value="students">{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿಗಳು' : 'Students'}</option>
            <option value="farmers">{lang === 'kn' ? 'ರೈತರು' : 'Farmers'}</option>
            <option value="women">{lang === 'kn' ? 'ಮಹಿಳೆಯರು' : 'Women'}</option>
            <option value="seniors">{lang === 'kn' ? 'ಹಿರಿಯ ನಾಗರಿಕರು' : 'Senior citizens'}</option>
            <option value="disability">{lang === 'kn' ? 'ವಿಕಲಚೇತನಿಗಳು' : 'Persons with disabilities'}</option>
          </select>
        </div>
        <div className="flex items-end">
          <a href="/find-schemes" className="btn-accent w-full !py-2.5 text-xs font-kn">
            ✨ {t(lang, 'search.findForMe')}
          </a>
        </div>
      </div>
    </div>
  );
}
