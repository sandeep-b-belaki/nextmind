'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Field {
  name: string;
  label: string;
  kannada?: boolean;
  placeholder?: string;
}

export default function AddSimpleForm({
  title,
  endpoint,
  fields,
}: {
  title: string;
  endpoint: string;
  fields: Field[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'error');
      setOk('Created successfully.');
      setValues({});
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card h-fit p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="mt-4 space-y-3">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={`f-${f.name}`} className="label">
              {f.label}
            </label>
            <input
              id={`f-${f.name}`}
              className={`input !py-2.5 ${f.kannada ? 'font-kn' : ''}`}
              placeholder={f.placeholder ?? ''}
              value={values[f.name] ?? ''}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            />
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
      {ok && <p className="mt-3 text-xs font-semibold text-accent-600">{ok}</p>}
      <button type="submit" disabled={busy} className="btn-primary mt-4 w-full !py-2.5 text-sm disabled:opacity-60">
        {busy ? '...' : `Add`}
      </button>
    </form>
  );
}
