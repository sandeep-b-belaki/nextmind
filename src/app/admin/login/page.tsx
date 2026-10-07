'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '@/components/Providers';
import { t } from '@/lib/i18n';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const lang = useLang();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'error');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError((err as Error).message === 'error' ? t(lang, 'common.error') : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Logo size={48} />
          <span className="text-xl font-extrabold text-slate-900">E-Sahayak</span>
        </Link>
        <div className="card p-6 sm:p-8">
          <h1 className="text-center text-xl font-extrabold text-slate-900">🔐 Admin Login</h1>
          <p className="mt-1 text-center text-xs text-slate-400">Secure admin access — E-Sahayak Dashboard</p>
          <form onSubmit={submit} className="mt-6">
            <div>
              <label htmlFor="a-email" className="label">Email</label>
              <input
                id="a-email"
                type="email"
                required
                autoComplete="username"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="a-pass" className="label">Password</label>
              <input
                id="a-pass"
                type="password"
                required
                autoComplete="current-password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary mt-5 w-full disabled:opacity-60">
              {busy ? '...' : 'Login'}
            </button>
          </form>
          <div className="mt-5 rounded-xl bg-slate-50 p-3 text-center text-[11px] leading-relaxed text-slate-500">
            Demo credentials: <span className="font-mono font-semibold">admin@nextmind.demo / Admin@1234</span>
          </div>
        </div>
        <p className="mt-4 text-center text-sm">
          <Link href="/" className="font-semibold text-brand-700 hover:underline">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
