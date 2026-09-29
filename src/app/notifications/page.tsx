import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';
import NotificationPrefs from '@/components/NotificationPrefs';
import { row, run } from '@/lib/pg';
import type { NotificationPrefs as Prefs } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Notifications — ಅಧಿಸೂಚನೆಗಳು' };

export default async function NotificationsPage() {
  const lang = getLang();
  const user = await currentUser();
  if (!user) redirect('/login?next=/notifications');

  let prefs = await row<Prefs & { user_id: number }>('SELECT * FROM notification_prefs WHERE user_id = $1', [
    user.id,
  ]);
  if (!prefs) {
    await run(
      'INSERT INTO notification_prefs (user_id, new_schemes, deadlines) VALUES ($1, 1, 1) ON CONFLICT DO NOTHING',
      [user.id]
    );
    prefs = (await row<Prefs & { user_id: number }>('SELECT * FROM notification_prefs WHERE user_id = $1', [
      user.id,
    ])) as Prefs & { user_id: number };
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl font-kn">🔔 {t(lang, 'notif.title')}</h1>
        <p className="mt-2 text-sm text-slate-500 font-kn">{t(lang, 'notif.desc')}</p>
        <div className="mt-6">
          <NotificationPrefs initial={prefs as unknown as Prefs} />
        </div>
      </div>
    </div>
  );
}
