import Link from 'next/link';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';

export default function NotFound() {
  const lang = getLang();
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <span className="text-6xl" aria-hidden>🔎</span>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900 font-kn">
        {t(lang, 'notFound.title')}
      </h1>
      <p className="mt-2 text-sm text-slate-500 font-kn">{t(lang, 'common.noResults')}</p>
      <Link href="/" className="btn-primary mt-6 font-kn">{t(lang, 'nav.home')}</Link>
    </div>
  );
}
