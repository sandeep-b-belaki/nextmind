import { rows } from '@/lib/pg';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  const prefs = await rows<{
    name: string;
    email: string;
    new_schemes: number;
    deadlines: number;
    scholarships: number;
    farmers: number;
    employment: number;
  }>(
    `SELECT u.name, u.email,
            p.new_schemes, p.deadlines, p.scholarships, p.farmers, p.employment
     FROM notification_prefs p JOIN users u ON u.id = p.user_id
     ORDER BY u.name`
  );

  const expiring = await rows<{ name_en: string; slug: string; last_date: string }>(
    `SELECT name_en, slug, last_date FROM schemes
     WHERE status IN ('published','needs_verification') AND last_date >= CURRENT_DATE
     ORDER BY last_date ASC LIMIT 10`
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
      <p className="mt-1 text-sm text-slate-500">User alert preferences and deadline reminders.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">User Preferences</h2>
          {prefs.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No users have set notification preferences yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="px-2 py-2 font-bold">User</th>
                    <th className="px-2 py-2 font-bold">🆕</th>
                    <th className="px-2 py-2 font-bold">📅</th>
                    <th className="px-2 py-2 font-bold">🎓</th>
                    <th className="px-2 py-2 font-bold">🌾</th>
                    <th className="px-2 py-2 font-bold">💼</th>
                  </tr>
                </thead>
                <tbody>
                  {prefs.map((p) => (
                    <tr key={p.email} className="border-b border-slate-100 last:border-0">
                      <td className="px-2 py-2">
                        <span className="block font-semibold text-slate-800">{p.name}</span>
                        <span className="text-xs text-slate-400">{p.email}</span>
                      </td>
                      {[p.new_schemes, p.deadlines, p.scholarships, p.farmers, p.employment].map((v, i) => (
                        <td key={i} className="px-2 py-2">{v ? '✅' : '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Deadline Reminders Queue</h2>
          <ul className="mt-3 space-y-2">
            {expiring.map((s) => (
              <li key={s.slug} className="flex items-center justify-between gap-2 rounded-lg bg-amber-50 p-2.5 text-sm">
                <Link href={`/schemes/${s.slug}`} className="truncate font-semibold text-slate-700 hover:text-brand-700">
                  {s.name_en}
                </Link>
                <span className="shrink-0 text-xs font-bold text-amber-700">{s.last_date}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Push delivery can be connected with Firebase Cloud Messaging — the preferences above control which alerts each
            user receives.
          </p>
        </div>
      </div>
    </div>
  );
}
