import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { getSavedSchemes } from '@/lib/schemes';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';
import SchemeCard from '@/components/SchemeCard';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'My Account — ನನ್ನ ಖಾತೆ' };

export default async function AccountPage() {
  const lang = getLang();
  const user = await currentUser();
  if (!user) redirect('/login?next=/account');

  const schemes = await getSavedSchemes(user.id);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl font-kn">{t(lang, 'auth.myAccount')}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {user.name} · {user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/notifications" className="btn-secondary font-kn">
            <span aria-hidden>🔔</span> {t(lang, 'notif.title')}
          </Link>
          <LogoutButton />
        </div>
      </div>

      <h2 className="mt-8 text-lg font-bold text-slate-900 font-kn">★ {t(lang, 'auth.savedSchemes')}</h2>
      {schemes.length === 0 ? (
        <div className="card mt-4 p-10 text-center text-slate-500 font-kn">
          {t(lang, 'auth.savedEmpty')}{' '}
          <Link href="/schemes" className="font-bold text-brand-700 hover:underline">
            {t(lang, 'nav.schemes')}
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((s) => (
            <SchemeCard key={s.id} scheme={s} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
