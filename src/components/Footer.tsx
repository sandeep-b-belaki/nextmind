'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from './Providers';
import { t } from '@/lib/i18n';
import Logo from './Logo';

export default function Footer() {
  const lang = useLang();
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo size={36} id="ftr" />
              <span className="text-lg font-extrabold text-slate-900">NEXTMIND</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 font-kn">{t(lang, 'footer.about')}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-kn">{t(lang, 'footer.links')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link className="hover:text-brand-700 font-kn" href="/schemes">{t(lang, 'nav.schemes')}</Link></li>
              <li><Link className="hover:text-brand-700 font-kn" href="/categories">{t(lang, 'nav.categories')}</Link></li>
              <li><Link className="hover:text-brand-700 font-kn" href="/find-schemes">{t(lang, 'search.findForMe')}</Link></li>
              <li><Link className="hover:text-brand-700 font-kn" href="/how-it-works">{t(lang, 'nav.how')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-kn">{t(lang, 'nav.about')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link className="hover:text-brand-700 font-kn" href="/about">{t(lang, 'nav.about')}</Link></li>
              <li><Link className="hover:text-brand-700 font-kn" href="/contact">{t(lang, 'nav.contact')}</Link></li>
              <li><Link className="hover:text-brand-700 font-kn" href="/notifications">{t(lang, 'notif.title')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-kn">{t(lang, 'footer.legal')}</h3>
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 font-kn">
              {t(lang, 'disclaimer.body')}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} NextMind. {t(lang, 'footer.rights')}</span>
          <span className="font-semibold text-amber-600">{t(lang, 'demo.footer')}</span>
        </div>
      </div>
    </footer>
  );
}
