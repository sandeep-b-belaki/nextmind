'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const set = async (verify_status: string, schemeStatus?: string) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/schemes/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verify_status, status: schemeStatus }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const tone =
    status === 'verified' ? 'bg-accent-100 text-accent-800' : status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800';

  return (
    <div className="flex items-center gap-1.5">
      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${tone}`}>
        {status === 'verified' ? '🟢' : status === 'expired' ? '🔴' : '🟡'} {status}
      </span>
      <div className="flex gap-1">
        <button
          disabled={busy}
          onClick={() => set('verified', 'published')}
          title="Mark verified"
          className="rounded-md bg-slate-100 px-1.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-accent-100 hover:text-accent-700 disabled:opacity-50"
        >
          ✓
        </button>
        <button
          disabled={busy}
          onClick={() => set('needs_review', 'needs_verification')}
          title="Needs review"
          className="rounded-md bg-slate-100 px-1.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-amber-100 hover:text-amber-700 disabled:opacity-50"
        >
          !
        </button>
        <button
          disabled={busy}
          onClick={() => set('expired', 'expired')}
          title="Expired"
          className="rounded-md bg-slate-100 px-1.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
