'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/schemes', label: 'Schemes', icon: '📋' },
  { href: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { href: '/admin/departments', label: 'Departments', icon: '🏛️' },
  { href: '/admin/tutorials', label: 'Tutorials', icon: '🎬' },
  { href: '/admin/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/reports', label: 'Reports', icon: '🚩' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {items.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
      >
        <span aria-hidden>🚪</span> Logout
      </button>
    </nav>
  );
}
