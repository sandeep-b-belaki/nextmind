'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Department, SchemeDetail } from '@/lib/types';

interface Rule {
  field: string;
  operator: string;
  value: string;
}
interface Doc {
  name_kn: string;
  name_en: string;
  desc_kn: string;
  desc_en: string;
}
interface Step {
  title_kn: string;
  title_en: string;
  body_kn: string;
  body_en: string;
  tip_kn: string;
  tip_en: string;
}

const ruleFields = [
  'residency',
  'student',
  'farmer',
  'disability',
  'gender',
  'employment',
  'age_min',
  'age_max',
  'income_max',
];

export default function SchemeForm({
  categories,
  departments,
  existing,
}: {
  categories: Category[];
  departments: Department[];
  existing?: SchemeDetail;
}) {
  const router = useRouter();
  const editing = !!existing;

  const [form, setForm] = useState({
    name_kn: existing?.name_kn ?? '',
    name_en: existing?.name_en ?? '',
    slug: existing?.slug ?? '',
    desc_kn: existing?.desc_kn ?? '',
    desc_en: existing?.desc_en ?? '',
    simple_kn: existing?.simple_kn ?? '',
    simple_en: existing?.simple_en ?? '',
    category_id: existing?.category_id ?? categories[0]?.id ?? 1,
    department_id: existing?.department_id ?? departments[0]?.id ?? 1,
    start_date: existing?.start_date ?? '',
    last_date: existing?.last_date ?? '',
    status: (existing?.status ?? 'draft') as string,
    official_url: existing?.official_url ?? '',
    notification_pdf: existing?.notification_pdf ?? '',
    tutorial_video: existing?.tutorial_video ?? '',
    image: existing?.image ?? '',
    last_verified_at: existing?.last_verified_at ?? new Date().toISOString().slice(0, 10),
    verify_status: (existing?.verify_status ?? 'needs_review') as string,
  });

  const [rules, setRules] = useState<Rule[]>(
    existing?.eligibility?.map((r) => ({ field: r.field, operator: r.operator, value: r.value })) ?? [
      { field: 'residency', operator: 'eq', value: 'true' },
    ]
  );
  const [docs, setDocs] = useState<Doc[]>(
    existing?.documents?.map((d) => ({ name_kn: d.name_kn, name_en: d.name_en, desc_kn: d.desc_kn, desc_en: d.desc_en })) ?? [
      { name_kn: '', name_en: '', desc_kn: '', desc_en: '' },
    ]
  );
  const [steps, setSteps] = useState<Step[]>(
    existing?.steps?.map((s) => ({
      title_kn: s.title_kn, title_en: s.title_en, body_kn: s.body_kn, body_en: s.body_en, tip_kn: s.tip_kn, tip_en: s.tip_en,
    })) ?? [{ title_kn: '', title_en: '', body_kn: '', body_en: '', tip_kn: '', tip_en: '' }]
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const setF = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      department_id: Number(form.department_id),
      status: form.status,
      verify_status: form.verify_status,
      notification_pdf: form.notification_pdf || null,
      tutorial_video: form.tutorial_video || null,
      image: form.image || null,
      eligibility: rules,
      documents: docs,
      steps,
    };
    try {
      const res = await fetch(editing ? `/api/admin/schemes/${existing!.id}` : '/api/admin/schemes', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'error');
      setOk(editing ? 'Scheme updated.' : 'Scheme created.');
      router.refresh();
      if (!editing) router.push('/admin/schemes');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const labelCls = 'label';
  const inputCls = 'input';

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="card p-5 sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Basic Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="s-kn" className={labelCls}>Scheme name – Kannada *</label>
            <input id="s-kn" required className={`${inputCls} font-kn`} value={form.name_kn} onChange={(e) => setF('name_kn', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-en" className={labelCls}>Scheme name – English *</label>
            <input id="s-en" required className={inputCls} value={form.name_en} onChange={(e) => setF('name_en', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-slug" className={labelCls}>URL slug (optional)</label>
            <input id="s-slug" className={inputCls} placeholder="auto-generated" value={form.slug} onChange={(e) => setF('slug', e.target.value)} disabled={editing} />
          </div>
          <div>
            <label htmlFor="s-status" className={labelCls}>Status *</label>
            <select id="s-status" className={inputCls} value={form.status} onChange={(e) => setF('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="expired">Expired</option>
              <option value="needs_verification">Needs Verification</option>
            </select>
          </div>
          <div>
            <label htmlFor="s-cat" className={labelCls}>Category *</label>
            <select id="s-cat" className={inputCls} value={form.category_id} onChange={(e) => setF('category_id', e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="s-dept" className={labelCls}>Department *</label>
            <select id="s-dept" className={inputCls} value={form.department_id} onChange={(e) => setF('department_id', e.target.value)}>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="s-start" className={labelCls}>Application start date *</label>
            <input id="s-start" type="date" required className={inputCls} value={form.start_date} onChange={(e) => setF('start_date', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-last" className={labelCls}>Application last date *</label>
            <input id="s-last" type="date" required className={inputCls} value={form.last_date} onChange={(e) => setF('last_date', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Descriptions (bilingual)</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="d-kn" className={labelCls}>Short description – Kannada</label>
              <textarea id="d-kn" rows={3} className={`${inputCls} font-kn`} value={form.desc_kn} onChange={(e) => setF('desc_kn', e.target.value)} />
            </div>
            <div>
              <label htmlFor="d-en" className={labelCls}>Short description – English</label>
              <textarea id="d-en" rows={3} className={inputCls} value={form.desc_en} onChange={(e) => setF('desc_en', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="e-kn" className={labelCls}>Simple explanation – Kannada</label>
              <textarea id="e-kn" rows={3} className={`${inputCls} font-kn`} value={form.simple_kn} onChange={(e) => setF('simple_kn', e.target.value)} />
            </div>
            <div>
              <label htmlFor="e-en" className={labelCls}>Simple explanation – English</label>
              <textarea id="e-en" rows={3} className={inputCls} value={form.simple_en} onChange={(e) => setF('simple_en', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Eligibility Rules</h2>
          <button type="button" onClick={() => setRules([...rules, { field: 'student', operator: 'eq', value: '' }])} className="btn-secondary !py-1.5 text-xs">
            + Add rule
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {rules.map((r, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <select className={`${inputCls} !py-2`} value={r.field} onChange={(e) => setRules(rules.map((x, j) => (j === i ? { ...x, field: e.target.value } : x)))}>
                {ruleFields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <select className={`${inputCls} !py-2`} value={r.operator} onChange={(e) => setRules(rules.map((x, j) => (j === i ? { ...x, operator: e.target.value } : x)))}>
                <option value="eq">equals</option>
                <option value="gte">≥</option>
                <option value="lte">≤</option>
              </select>
              <input className={`${inputCls} !py-2`} placeholder="value" value={r.value} onChange={(e) => setRules(rules.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
              <button type="button" onClick={() => setRules(rules.filter((_, j) => j !== i))} className="btn-secondary !py-2 text-xs text-red-600">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Required Documents</h2>
          <button type="button" onClick={() => setDocs([...docs, { name_kn: '', name_en: '', desc_kn: '', desc_en: '' }])} className="btn-secondary !py-1.5 text-xs">
            + Add document
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {docs.map((d, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
              <input className={`${inputCls} !py-2 font-kn`} placeholder="ದಾಖಲೆ ಹೆಸರು (KN)" value={d.name_kn} onChange={(e) => setDocs(docs.map((x, j) => (j === i ? { ...x, name_kn: e.target.value } : x)))} />
              <input className={`${inputCls} !py-2`} placeholder="Document name (EN)" value={d.name_en} onChange={(e) => setDocs(docs.map((x, j) => (j === i ? { ...x, name_en: e.target.value } : x)))} />
              <input className={`${inputCls} !py-2 font-kn`} placeholder="ವಿವರಣೆ (KN)" value={d.desc_kn} onChange={(e) => setDocs(docs.map((x, j) => (j === i ? { ...x, desc_kn: e.target.value } : x)))} />
              <input className={`${inputCls} !py-2`} placeholder="Description (EN)" value={d.desc_en} onChange={(e) => setDocs(docs.map((x, j) => (j === i ? { ...x, desc_en: e.target.value } : x)))} />
              <button type="button" onClick={() => setDocs(docs.filter((_, j) => j !== i))} className="text-xs font-bold text-red-600 sm:col-span-2">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Application Steps</h2>
          <button type="button" onClick={() => setSteps([...steps, { title_kn: '', title_en: '', body_kn: '', body_en: '', tip_kn: '', tip_en: '' }])} className="btn-secondary !py-1.5 text-xs">
            + Add step
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-700">STEP {i + 1}</span>
                <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="text-xs font-bold text-red-600">
                  Remove
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input className={`${inputCls} !py-2 font-kn`} placeholder="ಶೀರ್ಷಿಕೆ (KN)" value={s.title_kn} onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, title_kn: e.target.value } : x)))} />
                <input className={`${inputCls} !py-2`} placeholder="Title (EN)" value={s.title_en} onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, title_en: e.target.value } : x)))} />
                <input className={`${inputCls} !py-2 font-kn`} placeholder="ವಿವರಣೆ (KN)" value={s.body_kn} onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, body_kn: e.target.value } : x)))} />
                <input className={`${inputCls} !py-2`} placeholder="Body (EN)" value={s.body_en} onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, body_en: e.target.value } : x)))} />
                <input className={`${inputCls} !py-2 font-kn`} placeholder="ಸಲಹೆ (KN)" value={s.tip_kn} onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, tip_kn: e.target.value } : x)))} />
                <input className={`${inputCls} !py-2`} placeholder="Tip (EN)" value={s.tip_en} onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, tip_en: e.target.value } : x)))} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Official Source & Verification</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="s-url" className={labelCls}>Official website *</label>
            <input id="s-url" type="url" required className={inputCls} placeholder="https://sevasindhu.karnataka.gov.in" value={form.official_url} onChange={(e) => setF('official_url', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-pdf" className={labelCls}>Official notification PDF URL</label>
            <input id="s-pdf" type="url" className={inputCls} value={form.notification_pdf} onChange={(e) => setF('notification_pdf', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-video" className={labelCls}>Tutorial video URL</label>
            <input id="s-video" type="url" className={inputCls} value={form.tutorial_video} onChange={(e) => setF('tutorial_video', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-img" className={labelCls}>Scheme image URL</label>
            <input id="s-img" type="url" className={inputCls} value={form.image} onChange={(e) => setF('image', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-verified" className={labelCls}>Last verified date</label>
            <input id="s-verified" type="date" className={inputCls} value={form.last_verified_at} onChange={(e) => setF('last_verified_at', e.target.value)} />
          </div>
          <div>
            <label htmlFor="s-verify" className={labelCls}>Verification status</label>
            <select id="s-verify" className={inputCls} value={form.verify_status} onChange={(e) => setF('verify_status', e.target.value)}>
              <option value="verified">🟢 Verified</option>
              <option value="needs_review">🟡 Needs Review</option>
              <option value="expired">🔴 Expired</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      {ok && <p className="rounded-xl bg-accent-50 p-3 text-sm font-semibold text-accent-700">{ok}</p>}

      <div className="flex gap-3 pb-8">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? '...' : editing ? 'Update Scheme' : 'Create Scheme'}
        </button>
        <button type="button" onClick={() => router.push('/admin/schemes')} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
