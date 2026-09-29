import SchemeForm from '@/components/admin/SchemeForm';
import { getCategories, getDepartments } from '@/lib/schemes';

export const dynamic = 'force-dynamic';

export default async function NewSchemePage() {
  const categories = await getCategories();
  const departments = await getDepartments();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Add Scheme</h1>
      <p className="mt-1 text-sm text-slate-500">Create a new scheme with bilingual content, eligibility, documents and steps.</p>
      <div className="mt-6">
        <SchemeForm categories={categories} departments={departments} />
      </div>
    </div>
  );
}
