'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLang } from './Providers';
import { t } from '@/lib/i18n';

export default function ContactForm() {
  const lang = useLang();
  const params = useSearchParams();
  const preType = params.get('type') ?? '';
  const preScheme = params.get('scheme') ?? '';
  const [form, setForm] = useState({ name: '', email: '', subject: preType === 'report' ? 'report' : '', message: preScheme ? `Scheme: ${preScheme}\n` : '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      const isReport = ['report', 'broken-link', 'expired'].includes(form.subject);
      if (isReport) {
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: form.subject,
            message: form.message,
            email: form.email,
            scheme_slug: preScheme || null,
          }),
        });
        if (!res.ok) throw new Error('failed');
      } else {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('failed');
      }
      setState('sent');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="card border-accent-200 bg-accent-50 p-8 text-center">
        <span className="text-4xl" aria-hidden>✅</span>
        <p className="mt-3 text-base font-bold text-accent-800 font-kn">{t(lang, 'contact.sent')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label font-kn">{t(lang, 'contact.name')}</label>
          <input
            id="c-name"
            required
            className="input font-kn"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="c-email" className="label font-kn">{t(lang, 'contact.email')}</label>
          <input
            id="c-email"
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="c-subject" className="label font-kn">{t(lang, 'contact.subject')}</label>
        <select
          id="c-subject"
          className="input font-kn"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        >
          <option value="">{t(lang, 'contact.subject')}</option>
          <option value="report">{t(lang, 'contact.sub.report')}</option>
          <option value="broken-link">{t(lang, 'contact.sub.broken')}</option>
          <option value="expired">{t(lang, 'contact.sub.expired')}</option>
          <option value="feedback">{t(lang, 'contact.report')}</option>
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="c-message" className="label font-kn">{t(lang, 'contact.message')}</label>
        <textarea
          id="c-message"
          required
          rows={5}
          className="input font-kn"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      {state === 'error' && <p className="mt-3 text-sm font-semibold text-red-600 font-kn">{t(lang, 'common.error')}</p>}
      <button type="submit" disabled={state === 'sending'} className="btn-primary mt-5 w-full font-kn disabled:opacity-60 sm:w-auto">
        {state === 'sending' ? t(lang, 'common.loading') : t(lang, 'contact.send')}
      </button>
    </form>
  );
}
