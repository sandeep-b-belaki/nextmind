import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import Link from 'next/link';
import Logo from '@/components/Logo';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
          <Logo size={36} id="admin-side" />
          <span>
            <span className="block text-sm font-extrabold text-white">NEXTMIND</span>
            <span className="block text-[10px] font-medium text-slate-400">Admin Panel</span>
          </span>
        </Link>
        <AdminNav />
        <div className="mt-auto rounded-xl bg-slate-800 p-3 text-[11px] leading-relaxed text-slate-400">
          Logged in as <span className="font-semibold text-white">{admin.email}</span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link href="/admin" className="text-sm font-extrabold text-slate-900">
            NEXTMIND Admin
          </Link>
          <Link href="/" className="text-xs font-semibold text-brand-700">
            View site →
          </Link>
        </header>
        <div className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          <div className="flex gap-1 overflow-x-auto">
            {['/admin', '/admin/schemes', '/admin/categories', '/admin/reports'].map((h, i) => (
              <Link key={h} href={h} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                {['Dashboard', 'Schemes', 'Categories', 'Reports'][i]}
              </Link>
            ))}
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
