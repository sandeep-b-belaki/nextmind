import { rows } from './pg';
import type { SchemeListItem } from './types';

export interface QuestionnaireAnswers {
  age: number;
  gender: 'male' | 'female' | 'other';
  resident: boolean;
  student: boolean;
  farmer: boolean;
  employment: 'employed' | 'unemployed' | 'selfemployed' | 'student';
  income: number;
  disability: boolean;
  district: string;
}

const SELECT_LIST = `
  SELECT s.*, c.slug AS category_slug, c.name_kn AS category_name_kn, c.name_en AS category_name_en,
         c.name_hi AS category_name_hi,
         c.icon AS category_icon, d.slug AS department_slug, d.name_kn AS department_name_kn,
         d.name_en AS department_name_en, d.name_hi AS department_name_hi,
         (SELECT COUNT(*) FROM eligibility_rules er WHERE er.scheme_id = s.id) AS eligibility_count
  FROM schemes s
  JOIN categories c ON c.id = s.category_id
  JOIN departments d ON d.id = s.department_id
`;

function evaluateRule(field: string, operator: string, value: string, a: QuestionnaireAnswers): boolean {
  switch (field) {
    case 'residency':
      return operator === 'eq' ? a.resident === (value === 'true') : true;
    case 'student':
      return operator === 'eq' ? a.student === (value === 'true') : true;
    case 'farmer':
      return operator === 'eq' ? a.farmer === (value === 'true') : true;
    case 'disability':
      return operator === 'eq' ? a.disability === (value === 'true') : true;
    case 'gender':
      if (value === 'other') return true;
      return a.gender === value;
    case 'employment':
      if (a.employment === value) return true;
      if (value === 'unemployed' && a.employment === 'student') return true;
      return false;
    case 'age_min':
      return a.age >= Number(value);
    case 'age_max':
      return a.age <= Number(value);
    case 'income_max':
      return a.income <= Number(value);
    default:
      return true;
  }
}

export async function matchSchemes(answers: QuestionnaireAnswers): Promise<SchemeListItem[]> {
  const schemes = await rows<SchemeListItem>(`${SELECT_LIST} WHERE s.status IN ('published','needs_verification')`);
  const allRules = await rows<{ scheme_id: number; field: string; operator: string; value: string }>(
    'SELECT scheme_id, field, operator, value FROM eligibility_rules'
  );
  const byScheme = new Map<number, { field: string; operator: string; value: string }[]>();
  for (const r of allRules) {
    const list = byScheme.get(r.scheme_id) ?? [];
    list.push({ field: r.field, operator: r.operator, value: r.value });
    byScheme.set(r.scheme_id, list);
  }

  return schemes.filter((scheme) => {
    const rules = byScheme.get(scheme.id) ?? [];
    if (rules.length === 0) return true;
    return rules.every((r) => evaluateRule(r.field, r.operator, r.value, answers));
  });
}
