'use client';

import { useRouter } from 'next/navigation';
import { useApp, useLang } from './Providers';
import { t } from '@/lib/i18n';

export default function LogoutButton() {
  const lang = useLang();
  const { setUser } = useApp();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <button onClick={logout} className="btn-secondary font-kn">
      {t(lang, 'auth.logout')}
    </button>
  );
}
