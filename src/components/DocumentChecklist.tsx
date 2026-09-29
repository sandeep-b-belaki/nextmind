'use client';

import { useEffect, useState } from 'react';
import { useLang } from './Providers';
import { t, content } from '@/lib/i18n';
import type { SchemeDocument } from '@/lib/types';

export default function DocumentChecklist({ documents }: { documents: SchemeDocument[] }) {
  const lang = useLang();
  const [checked, setChecked] = useState<boolean[]>([]);
  const storageKey = `nm-checklist-${documents[0]?.scheme_id ?? 'x'}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length === documents.length) {
          setChecked(arr);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setChecked(new Array(documents.length).fill(false));
  }, [storageKey, documents.length]);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const ready = checked.filter(Boolean).length;

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900 font-kn">{t(lang, 'scheme.checklist')}</h3>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          {ready} / {documents.length} {t(lang, 'scheme.checklistProgress')}
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-accent-500 transition-all duration-300"
          style={{ width: `${documents.length ? (ready / documents.length) * 100 : 0}%` }}
          role="progressbar"
          aria-valuenow={ready}
          aria-valuemin={0}
          aria-valuemax={documents.length}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {documents.map((doc, i) => (
          <li key={i}>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                checked[i] ? 'border-accent-200 bg-accent-50' : 'border-slate-200 bg-white hover:border-brand-200'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-accent-600 focus:ring-accent-500"
              />
              <span>
                <span className={`block text-sm font-semibold ${checked[i] ? 'text-accent-800 line-through' : 'text-slate-800'} font-kn`}>
                  {content(lang, doc.name_kn, doc.name_en, doc.name_hi)}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500 font-kn">
                  {content(lang, doc.desc_kn, doc.desc_en, doc.desc_hi)}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
