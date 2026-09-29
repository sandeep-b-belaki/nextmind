'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const set = async (next: string) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-1.5">
      {status !== 'resolved' && (
        <button
          disabled={busy}
          onClick={() => set('resolved')}
          className="rounded-lg bg-accent-50 px-2.5 py-1 text-[11px] font-bold text-accent-700 hover:bg-accent-100"
        >
          Resolve
        </button>
      )}
      {status !== 'open' && (
        <button
          disabled={busy}
          onClick={() => set('open')}
          className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200"
        >
          Reopen
        </button>
      )}
    </div>
  );
}
