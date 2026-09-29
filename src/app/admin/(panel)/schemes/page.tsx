import Link from 'next/link';
import { rows } from '@/lib/pg';
import VerifyActions from '@/components/admin/VerifyActions';

export const dynamic = 'force-dynamic';

interface Row {
  id: number;
  slug: string;
  name_kn: string;
  name_en: string;
  status: string;
  verify_status: string;
  start_date: string;
  last_date: string;
  view_count: number;
}

export default async function AdminSchemesPage() {
  const schemeRows = await rows<Row>(
    `SELECT id, slug, name_kn, name_en, status, verify_status, start_date, last_date, view_count
     FROM schemes ORDER BY updated_at DESC`
  );

  const statusTone: Record<string, string> = {
    published: 'bg-accent-100 text-accent-800',
    draft: 'bg-slate-100 text-slate-600',
    expired: 'bg-red-100 text-red-700',
    needs_verification: 'bg-amber-100 text-amber-800',
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Schemes</h1>
          <p className="mt-1 text-sm text-slate-500">{schemeRows.length} total schemes in the system.</p>
        </div>
        <Link href="/admin/schemes/new" className="btn-primary !py-2.5 text-sm">
          + Add Scheme
        </Link>
      </div>

      <div className="card mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-bold">Scheme</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Verification</th>
              <th className="px-4 py-3 font-bold">Last Date</th>
              <th className="px-4 py-3 font-bold">Views</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemeRows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/schemes/${r.id}`} className="font-bold text-slate-800 hover:text-brand-700">
                    {r.name_en}
                  </Link>
                  <p className="font-kn text-xs text-slate-400">{r.name_kn}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusTone[r.status] ?? ''}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <VerifyActions id={r.id} status={r.verify_status} />
                </td>
                <td className="px-4 py-3 font-semibold text-slate-600">{r.last_date}</td>
                <td className="px-4 py-3 font-semibold text-slate-600">{r.view_count}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/schemes/${r.id}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100">
                      Edit
                    </Link>
                    <Link href={`/schemes/${r.slug}`} target="_blank" className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">
                      View ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
