'use client';

import { useState } from 'react';
import { useLang } from './Providers';
import { t } from '@/lib/i18n';
import { districts_kn, districts_hi, districts_en } from '@/lib/demo-data';
import type { SchemeListItem } from '@/lib/types';
import SchemeCard from './SchemeCard';

const INCOME_MAP: Record<string, number> = {
  u1l: 100000,
  '1to2.5l': 250000,
  '2.5to5l': 500000,
  '5l+': 5000000,
};

interface Answers {
  age: string;
  gender: string;
  resident: string;
  student: string;
  farmer: string;
  employment: string;
  income: string;
  disability: string;
  district: string;
}

const empty: Answers = { age: '', gender: '', resident: '', student: '', farmer: '', employment: '', income: '', disability: '', district: '' };

export default function FindSchemesForm() {
  const lang = useLang();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(empty);
  const [results, setResults] = useState<SchemeListItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const questions: { key: keyof Answers; label: string; type: 'choice' | 'number' | 'select'; options?: { value: string; label: string }[] }[] = [
    { key: 'age', label: t(lang, 'q.age'), type: 'number' },
    { key: 'gender', label: t(lang, 'q.gender'), type: 'choice', options: [
      { value: 'male', label: t(lang, 'q.gender.male') },
      { value: 'female', label: t(lang, 'q.gender.female') },
      { value: 'other', label: t(lang, 'q.gender.other') },
    ] },
    { key: 'resident', label: t(lang, 'q.resident'), type: 'choice', options: [
      { value: 'true', label: t(lang, 'q.yes') }, { value: 'false', label: t(lang, 'q.no') },
    ] },
    { key: 'student', label: t(lang, 'q.student'), type: 'choice', options: [
      { value: 'true', label: t(lang, 'q.yes') }, { value: 'false', label: t(lang, 'q.no') },
    ] },
    { key: 'farmer', label: t(lang, 'q.farmer'), type: 'choice', options: [
      { value: 'true', label: t(lang, 'q.yes') }, { value: 'false', label: t(lang, 'q.no') },
    ] },
    { key: 'employment', label: t(lang, 'q.employment'), type: 'choice', options: [
      { value: 'employed', label: t(lang, 'q.employed') },
      { value: 'unemployed', label: t(lang, 'q.unemployed') },
      { value: 'selfemployed', label: t(lang, 'q.selfemployed') },
      { value: 'student', label: t(lang, 'q.empStudent') },
    ] },
    { key: 'income', label: t(lang, 'q.income'), type: 'choice', options: [
      { value: 'u1l', label: t(lang, 'income.u1l') },
      { value: '1to2.5l', label: t(lang, 'income.1to2.5l') },
      { value: '2.5to5l', label: t(lang, 'income.2.5to5l') },
      { value: '5l+', label: t(lang, 'income.5l+') },
    ] },
    { key: 'disability', label: t(lang, 'q.disability'), type: 'choice', options: [
      { value: 'true', label: t(lang, 'q.yes') }, { value: 'false', label: t(lang, 'q.no') },
    ] },
    { key: 'district', label: t(lang, 'q.district'), type: 'select' },
  ];

  const q = questions[step];
  const districts = lang === 'kn' ? districts_kn : lang === 'hi' ? districts_hi : districts_en;
  const canProceed = answers[q.key] !== '';

  const set = (k: keyof Answers, v: string) => setAnswers((a) => ({ ...a, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        age: Number(answers.age || 0),
        gender: answers.gender,
        resident: answers.resident === 'true',
        student: answers.student === 'true',
        farmer: answers.farmer === 'true',
        employment: answers.employment,
        income: INCOME_MAP[answers.income] ?? 0,
        disability: answers.disability === 'true',
        district: answers.district,
      };
      const res = await fetch('/api/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResults(data.schemes ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return (
      <div>
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900 font-kn">
          {t(lang, 'find.note')}
        </div>
        <h3 className="section-title mt-6 font-kn">{t(lang, 'find.results')}</h3>
        {results.length === 0 ? (
          <p className="mt-4 text-slate-500 font-kn">{t(lang, 'find.noResults')}</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((s) => (
              <SchemeCard key={s.id} scheme={s} lang={lang} />
            ))}
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={() => {
              setResults(null);
              setStep(0);
              setAnswers(empty);
            }}
            className="btn-secondary font-kn"
          >
            {t(lang, 'find.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            {step + 1} / {questions.length}
          </span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-lg font-bold text-slate-900 font-kn">{q.label}</legend>
        <div className="mt-4">
          {q.type === 'number' && (
            <input
              type="number"
              min={0}
              max={120}
              value={answers[q.key]}
              onChange={(e) => set(q.key, e.target.value)}
              className="input !text-base"
              autoFocus
            />
          )}
          {q.type === 'choice' && (
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options?.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set(q.key, opt.value)}
                  className={`rounded-xl border px-4 py-3.5 text-sm font-semibold transition font-kn ${
                    answers[q.key] === opt.value
                      ? 'border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          {q.type === 'select' && (
            <select value={answers[q.key]} onChange={(e) => set(q.key, e.target.value)} className="input !text-base">
              <option value="">{t(lang, 'filter.all')}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-secondary font-kn disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t(lang, 'find.back')}
        </button>
        {step < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => canProceed && setStep((s) => s + 1)}
            disabled={!canProceed}
            className="btn-primary font-kn disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t(lang, 'find.next')}
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={!canProceed || loading} className="btn-primary font-kn disabled:opacity-50">
            {loading ? t(lang, 'common.loading') : t(lang, 'find.submit')}
          </button>
        )}
      </div>
    </div>
  );
}
