import { countSchemes, getCategories, getDepartments } from '@/lib/schemes';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const stats = await countSchemes();
  const categories = await getCategories();
  const departments = await getDepartments();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">System overview and platform information.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Platform</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Name</dt>
              <dd className="font-bold text-slate-800">E-Sahayak</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Total schemes</dt>
              <dd className="font-bold text-slate-800">{stats.total}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Categories</dt>
              <dd className="font-bold text-slate-800">{categories.length}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Departments</dt>
              <dd className="font-bold text-slate-800">{departments.length}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Data mode</dt>
              <dd className="font-bold text-amber-600">DEMO DATA</dd>
            </div>
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Security</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            <li>Admin authentication with scrypt-hashed passwords</li>
            <li>HttpOnly, SameSite=Lax session cookies</li>
            <li>Parameterised SQL queries everywhere</li>
            <li>Input validation on all API boundaries</li>
            <li>Role field on admins (admin/editor) for RBAC</li>
            <li>Never expose credentials in frontend code</li>
          </ul>
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            Demo admin: admin@nextmind.demo / Admin@1234 — change this before any real deployment. Serve the site over
            HTTPS in production.
          </p>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Architecture Notes</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
          <li>Next.js App Router + TypeScript + Tailwind CSS</li>
          <li>SQLite (better-sqlite3) for local/demo — PostgreSQL schema included in <code className="font-mono text-xs">docs/schema.postgresql.sql</code></li>
          <li>Same REST APIs can serve a future Android/iOS app</li>
          <li>AI assistant can be added on top of the verified scheme database later</li>
        </ul>
      </div>
    </div>
  );
}
