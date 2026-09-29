'use client';

import { useState } from 'react';
import { useLang } from './Providers';
import { t } from '@/lib/i18n';
import type { NotificationPrefs as Prefs } from '@/lib/types';

const items: { key: keyof Prefs; label: string; icon: string }[] = [
  { key: 'new_schemes', label: 'notif.newSchemes', icon: '🔔' },
  { key: 'deadlines', label: 'notif.deadlines', icon: '📅' },
  { key: 'scholarships', label: 'notif.scholarships', icon: '🎓' },
  { key: 'farmers', label: 'notif.farmers', icon: '🌾' },
  { key: 'employment', label: 'notif.employment', icon: '💼' },
];

export default function NotificationPrefs({ initial }: { initial: Prefs }) {
  const lang = useLang();
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const toggle = (key: keyof Prefs) => {
    setPrefs((p) => ({ ...p, [key]: p[key] ? 0 : 1 }));
    setState('idle');
  };

  const save = async () => {
    setState('saving');
    try {
      const res = await fetch('/api/notifications/prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      setState(res.ok ? 'saved' : 'idle');
    } catch {
      setState('idle');
    }
  };

  return (
    <div className="card p-6">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.key}>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-brand-200">
              <span className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-sm font-semibold text-slate-800 font-kn">{t(lang, item.label)}</span>
              </span>
              <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={!!prefs[item.key]}
                  onChange={() => toggle(item.key)}
                />
                <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-accent-600" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} disabled={state === 'saving'} className="btn-primary font-kn disabled:opacity-60">
          {state === 'saving' ? t(lang, 'common.loading') : t(lang, 'notif.save')}
        </button>
        {state === 'saved' && <span className="text-sm font-semibold text-accent-600 font-kn">{t(lang, 'notif.savedMsg')}</span>}
      </div>
    </div>
  );
}
