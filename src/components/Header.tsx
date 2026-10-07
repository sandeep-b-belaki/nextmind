'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp, useLang } from './Providers';
import { t } from '@/lib/i18n';
import Logo from './Logo';

const navItems = [
  { href: '/', key: 'nav.home' },
  { href: '/schemes', key: 'nav.schemes' },
  { href: '/categories', key: 'nav.categories' },
  { href: '/how-it-works', key: 'nav.how' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
];

export default function Header() {
  const lang = useLang();
  const { setLang, user, setUser } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Logo size={44} priority />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">E-Sahayak</span>
              <span className="hidden text-[11px] text-slate-500 sm:block font-kn">{t(lang, 'tagline')}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  } font-kn`}
                >
                  {t(lang, item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex">
              <button
                onClick={() => setLang('kn')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  lang === 'kn' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                } font-kn`}
                aria-pressed={lang === 'kn'}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  lang === 'hi' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-pressed={lang === 'hi'}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  lang === 'en' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-pressed={lang === 'en'}
              >
                English
              </button>
            </div>

            <Link
              href="/schemes"
              className="btn-primary hidden !px-4 !py-2.5 text-xs sm:inline-flex sm:text-sm"
            >
              <span aria-hidden>🔍</span> {t(lang, 'search.button')}
            </Link>

            {user ? (
              <Link href="/account" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:block font-kn">
                {user.name.split(' ')[0]}
              </Link>
            ) : (
              <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:block font-kn">
                {t(lang, 'auth.login')}
              </Link>
            )}

            <button
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-100 py-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 font-kn"
                >
                  {t(lang, item.key)}
                </Link>
              ))}
              <div className="mt-2 flex items-center gap-2 px-3">
                <button
                  onClick={() => setLang('kn')}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold font-kn ${
                    lang === 'kn' ? 'bg-brand-50 text-brand-700' : 'text-slate-500'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    lang === 'hi' ? 'bg-brand-50 text-brand-700' : 'text-slate-500'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    lang === 'en' ? 'bg-brand-50 text-brand-700' : 'text-slate-500'
                  }`}
                >
                  English
                </button>
              </div>
              <div className="mt-2 flex flex-col gap-2 px-3">
                <Link href="/schemes" onClick={() => setOpen(false)} className="btn-primary text-sm">
                  <span aria-hidden>🔍</span> {t(lang, 'search.button')}
                </Link>
                {user ? (
                  <>
                    <Link href="/account" onClick={() => setOpen(false)} className="btn-secondary text-sm font-kn">
                      {t(lang, 'auth.myAccount')}
                    </Link>
                    <button onClick={logout} className="btn-secondary text-sm font-kn">
                      {t(lang, 'auth.logout')}
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm font-kn">
                    {t(lang, 'auth.login')} / {t(lang, 'auth.register')}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
