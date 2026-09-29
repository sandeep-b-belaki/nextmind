'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useApp, useLang } from '@/components/Providers';
import { t } from '@/lib/i18n';

function LoginForm() {
  const lang = useLang();
  const { setUser } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'error');
      setUser(data.user);
      router.push(next);
      router.refresh();
    } catch (err) {
      setError((err as Error).message === 'error' ? t(lang, 'common.error') : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <div>
        <label htmlFor="l-email" className="label font-kn">{t(lang, 'auth.email')}</label>
        <input
          id="l-email"
          type="email"
          required
          autoComplete="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="l-pass" className="label font-kn">{t(lang, 'auth.password')}</label>
        <input
          id="l-pass"
          type="password"
          required
          autoComplete="current-password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary mt-5 w-full font-kn disabled:opacity-60">
        {busy ? t(lang, 'common.loading') : t(lang, 'auth.login')}
      </button>
      <p className="mt-4 text-center text-sm text-slate-500 font-kn">
        {t(lang, 'auth.noAccount')}{' '}
        <Link href="/register" className="font-bold text-brand-700 hover:underline">
          {t(lang, 'auth.register')}
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  const lang = useLang();
  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl font-kn">
          {t(lang, 'auth.login')}
        </h1>
        <div className="mt-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
