import { adminListReports } from '@/lib/admin';
import { rows } from '@/lib/pg';
import ReportActions from '@/components/admin/ReportActions';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const reports = await adminListReports();
  const messages = await rows<{ id: number; name: string; email: string; subject: string; message: string; created_at: string }>(
    'SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 50'
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Reports</h1>
      <p className="mt-1 text-sm text-slate-500">Incorrect information, broken links and user feedback.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Scheme Reports</h2>
          {reports.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No reports yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {reports.map((r) => (
                <li key={r.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                      {r.type}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{r.created_at}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{r.message}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">
                      {r.scheme_slug ? `Scheme: ${r.scheme_slug}` : 'General'} {r.email && `· ${r.email}`}
                    </span>
                    <ReportActions id={r.id} status={r.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Contact Messages</h2>
          {messages.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No messages yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {messages.map((m) => (
                <li key={m.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-800">{m.name}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{m.created_at}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {m.email}
                    {m.subject && ` · ${m.subject}`}
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
