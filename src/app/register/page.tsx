'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp, useLang } from '@/components/Providers';
import { t } from '@/lib/i18n';

export default function RegisterPage() {
  const lang = useLang();
  const { setUser } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'error');
      setUser(data.user);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError((err as Error).message === 'error' ? t(lang, 'common.error') : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl font-kn">
          {t(lang, 'auth.register')}
        </h1>
        <form onSubmit={submit} className="card mt-6 p-6 sm:p-8">
          <div>
            <label htmlFor="r-name" className="label font-kn">{t(lang, 'auth.name')}</label>
            <input
              id="r-name"
              required
              autoComplete="name"
              className="input font-kn"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="r-email" className="label font-kn">{t(lang, 'auth.email')}</label>
            <input
              id="r-email"
              type="email"
              required
              autoComplete="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="r-pass" className="label font-kn">{t(lang, 'auth.password')}</label>
            <input
              id="r-pass"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input"
              placeholder="8+ characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400 font-kn">
            {t(lang, 'auth.privacyNote')}
          </p>
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary mt-5 w-full font-kn disabled:opacity-60">
            {busy ? t(lang, 'common.loading') : t(lang, 'auth.register')}
          </button>
          <p className="mt-4 text-center text-sm text-slate-500 font-kn">
            {t(lang, 'auth.haveAccount')}{' '}
            <Link href="/login" className="font-bold text-brand-700 hover:underline">
              {t(lang, 'auth.login')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
