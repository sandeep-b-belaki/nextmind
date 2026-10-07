import type { Metadata } from 'next';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';
import FindSchemesForm from '@/components/FindSchemesForm';
import ESahayakCard from '@/components/ESahayakCard';
import Disclaimer from '@/components/Disclaimer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Find Schemes For Me — ನನಗೆ ಯಾವ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ?',
  description:
    'Answer a few questions to discover Karnataka government schemes that may be relevant to you based on your profile.',
};

export default function FindSchemesPage() {
  const lang = getLang();
  return (
    <div className="container-page py-8 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-xs font-bold text-accent-700">
          <span aria-hidden>✨</span> {t(lang, 'search.findForMe')}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-4xl font-kn">{t(lang, 'find.title')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base font-kn">{t(lang, 'find.desc')}</p>
      </div>

      <div className="mt-8">
        <ESahayakCard />
      </div>

      <div className="mt-6">
        <FindSchemesForm />
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <Disclaimer />
      </div>
    </div>
  );
}
