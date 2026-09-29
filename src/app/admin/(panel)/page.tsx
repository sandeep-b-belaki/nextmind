import Link from 'next/link';
import { adminGetStats } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await adminGetStats();

  const cards = [
    { label: 'Total Schemes', value: stats.total, icon: '📋', tone: 'bg-brand-50 text-brand-700' },
    { label: 'Published', value: stats.published, icon: '✅', tone: 'bg-accent-50 text-accent-700' },
    { label: 'Draft', value: stats.draft, icon: '📝', tone: 'bg-slate-100 text-slate-600' },
    { label: 'Expired', value: stats.expired, icon: '⏰', tone: 'bg-red-50 text-red-600' },
    { label: 'Needs Verification', value: stats.needs_verification, icon: '⚠️', tone: 'bg-amber-50 text-amber-700' },
    { label: 'Total Users', value: stats.users, icon: '👥', tone: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of schemes, users and reports.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/schemes/new" className="btn-primary !py-2.5 text-sm">
            + Add Scheme
          </Link>
          <Link href="/" className="btn-secondary !py-2.5 text-sm" target="_blank">
            View Site ↗
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${c.tone}`}>
              <span aria-hidden>{c.icon}</span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-slate-900">{c.value}</p>
            <p className="text-xs font-semibold text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Most Viewed Schemes</h2>
          <ul className="mt-3 space-y-2">
            {stats.mostViewed.map((s) => (
              <li key={s.slug} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/admin/schemes/${s.slug}`} className="truncate font-semibold text-slate-700 hover:text-brand-700">
                  {s.name_en}
                </Link>
                <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                  {s.view_count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Expiring Soon</h2>
          <ul className="mt-3 space-y-2">
            {stats.expiringSoon.map((s) => (
              <li key={s.slug} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/admin/schemes/${s.slug}`} className="truncate font-semibold text-slate-700 hover:text-brand-700">
                  {s.name_en}
                </Link>
                <span className="shrink-0 text-xs font-bold text-red-600">{s.last_date}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Open Reports</h2>
            <Link href="/admin/reports" className="text-xs font-bold text-brand-700 hover:underline">
              View all →
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {stats.recentReports.length === 0 && <li className="text-sm text-slate-400">No reports yet.</li>}
            {stats.recentReports.map((r) => (
              <li key={r.id} className="rounded-lg bg-slate-50 p-2.5 text-sm">
                <span className="text-xs font-bold uppercase text-amber-600">{r.type}</span>
                <p className="mt-0.5 line-clamp-2 text-slate-600">{r.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
