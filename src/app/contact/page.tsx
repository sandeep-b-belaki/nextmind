import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';
import ContactForm from '@/components/ContactForm';
import Disclaimer from '@/components/Disclaimer';

export const metadata: Metadata = {
  title: 'Contact — ಸಂಪರ್ಕಿಸಿ',
  description: 'Contact NextMind with questions, feedback, or to report incorrect scheme information.',
};

export default function ContactPage() {
  const lang = getLang();
  return (
    <div className="container-page py-8 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl font-kn">{t(lang, 'contact.title')}</h1>
        <p className="mt-2 text-sm text-slate-500 font-kn">{t(lang, 'contact.desc')}</p>

        <div className="mt-6">
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-900 font-kn">📧 Email</h2>
            <a href="mailto:hello@nextmind.demo" className="mt-1 block text-sm font-semibold text-brand-700 hover:underline">
              hello@nextmind.demo
            </a>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-900 font-kn">{t(lang, 'contact.social')}</h2>
            <div className="mt-2 flex gap-3 text-sm font-semibold text-brand-700">
              <span className="cursor-default rounded-lg bg-slate-50 px-3 py-1.5">X / Twitter</span>
              <span className="cursor-default rounded-lg bg-slate-50 px-3 py-1.5">Facebook</span>
              <span className="cursor-default rounded-lg bg-slate-50 px-3 py-1.5">YouTube</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
