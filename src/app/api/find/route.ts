import { NextResponse } from 'next/server';
import { matchSchemes } from '@/lib/eligibility';
import type { QuestionnaireAnswers } from '@/lib/eligibility';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.age !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const answers: QuestionnaireAnswers = {
    age: Math.min(120, Math.max(0, body.age)),
    gender: body.gender ?? 'other',
    resident: !!body.resident,
    student: !!body.student,
    farmer: !!body.farmer,
    employment: body.employment ?? 'unemployed',
    income: Number(body.income) || 0,
    disability: !!body.disability,
    district: String(body.district ?? ''),
  };
  const schemes = await matchSchemes(answers);
  return NextResponse.json({ schemes });
}
