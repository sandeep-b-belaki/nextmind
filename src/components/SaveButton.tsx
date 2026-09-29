'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp, useLang } from './Providers';
import { t } from '@/lib/i18n';

export default function SaveButton({ schemeSlug }: { schemeSlug: string }) {
  const lang = useLang();
  const { user } = useApp();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/saved?slug=${encodeURIComponent(schemeSlug)}`)
      .then((r) => r.json())
      .then((d) => setSaved(!!d.saved))
      .catch(() => {});
  }, [user, schemeSlug]);

  const toggle = async () => {
    if (!user) {
      router.push(`/login?next=/schemes/${schemeSlug}`);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/saved', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: schemeSlug }),
      });
      if (res.ok) setSaved(!saved);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={saved ? 'btn-accent !py-2.5 text-sm font-kn' : 'btn-secondary !py-2.5 text-sm font-kn'}
      aria-pressed={saved}
    >
      <span aria-hidden>{saved ? '★' : '☆'}</span> {saved ? t(lang, 'scheme.saved') : t(lang, 'scheme.save')}
    </button>
  );
}
