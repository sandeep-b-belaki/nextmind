import type { Metadata } from 'next';
import Link from 'next/link';
import { getLang } from '@/lib/lang';
import { t, content } from '@/lib/i18n';
import Disclaimer from '@/components/Disclaimer';

export const metadata: Metadata = {
  title: 'About — E-Sahayak ಎಂದರೇನು?',
  description:
    'E-Sahayak helps citizens understand Karnataka government schemes without reading complicated government documents. Independent information platform.',
};

export default function AboutPage() {
  const lang = getLang();
  return (
    <div className="container-page py-8 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl font-kn">{t(lang, 'about.title')}</h1>

        <div className="card mt-6 p-6 sm:p-8">
          <p className="text-base leading-8 text-slate-700 font-kn">{t(lang, 'about.p1')}</p>
          <p className="mt-4 rounded-xl bg-brand-50 p-4 text-base font-bold leading-7 text-brand-800 font-kn">
            “{t(lang, 'about.goal')}”
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 font-kn">{t(lang, 'about.independent')}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: '🎯', kn: 'ಸರಳ ವಿವರಣೆ', hi: 'सरल व्याख्या', en: 'Simple explanations' },
            { icon: '📋', kn: 'ದಾಖಲೆ ಪಟ್ಟಿ', hi: 'दस्तावेज़ सूची', en: 'Document checklists' },
            { icon: '🗺️', kn: 'ಹಂತ-ಹಂತ ಮಾರ್ಗದರ್ಶಿ', hi: 'चरण-दर-चरण मार्गदर्शिका', en: 'Step-by-step guides' },
          ].map((f) => (
            <div key={f.en} className="card p-5 text-center">
              <span className="text-3xl" aria-hidden>{f.icon}</span>
              <p className="mt-2 text-sm font-bold text-slate-800 font-kn">{content(lang, f.kn, f.en, f.hi)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/schemes" className="btn-primary font-kn">{t(lang, 'nav.schemes')}</Link>
          <Link href="/contact" className="btn-secondary font-kn">{t(lang, 'nav.contact')}</Link>
        </div>

        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
