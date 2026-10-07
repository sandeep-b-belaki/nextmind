import type { Metadata } from 'next';
import Link from 'next/link';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';
import Disclaimer from '@/components/Disclaimer';

export const metadata: Metadata = {
  title: 'How It Works — ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
  description: 'Learn how E-Sahayak makes Karnataka government schemes easy to understand — search, eligibility, documents and step-by-step guides.',
};

const steps = [
  { n: 1, title: 'how.s1.title', body: 'how.s1.body', icon: '🔍' },
  { n: 2, title: 'how.s2.title', body: 'how.s2.body', icon: '💡' },
  { n: 3, title: 'how.s3.title', body: 'how.s3.body', icon: '✅' },
  { n: 4, title: 'how.s4.title', body: 'how.s4.body', icon: '🚀' },
];

export default function HowItWorksPage() {
  const lang = getLang();
  return (
    <div className="container-page py-8 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl font-kn">{t(lang, 'how.title')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base font-kn">{t(lang, 'how.desc')}</p>
      </div>

      <ol className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="card relative p-6 text-center">
            <span className="absolute right-4 top-4 text-3xl font-extrabold text-slate-100" aria-hidden>
              0{s.n}
            </span>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl" aria-hidden>
              {s.icon}
            </span>
            <h2 className="mt-4 text-base font-bold text-slate-900 font-kn">{t(lang, s.title)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 font-kn">{t(lang, s.body)}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <Link href="/find-schemes" className="btn-accent !px-8 !py-4 text-base font-kn">
          ✨ {t(lang, 'search.findForMe')}
        </Link>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <Disclaimer />
      </div>
    </div>
  );
}
