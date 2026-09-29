'use client';

import { useLang } from './Providers';
import { t } from '@/lib/i18n';

export default function SectionHeading({ titleKey, subKey, title, sub }: { titleKey?: string; subKey?: string; title?: string; sub?: string }) {
  const lang = useLang();
  return (
    <div className="mb-6">
      <h2 className="section-title font-kn">
        {title ?? (titleKey ? t(lang, titleKey) : '')}
      </h2>
      {(sub ?? (subKey ? t(lang, subKey) : '')) && (
        <p className="section-sub font-kn">{sub ?? (subKey ? t(lang, subKey) : '')}</p>
      )}
    </div>
  );
}
