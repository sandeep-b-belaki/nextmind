import { notFound } from 'next/navigation';
import { row } from '@/lib/pg';
import { getCategories, getDepartments, getSchemeBySlug } from '@/lib/schemes';
import SchemeForm from '@/components/admin/SchemeForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

async function findScheme(idOrSlug: string) {
  if (/^\d+$/.test(idOrSlug)) {
    const found = await row<{ slug: string }>('SELECT slug FROM schemes WHERE id = $1', [Number(idOrSlug)]);
    if (found) return getSchemeBySlug(found.slug);
    return null;
  }
  return getSchemeBySlug(idOrSlug);
}

export default async function EditSchemePage({ params }: Props) {
  const scheme = await findScheme(params.id);
  if (!scheme) notFound();

  const categories = await getCategories();
  const departments = await getDepartments();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Edit Scheme</h1>
      <p className="mt-1 text-sm text-slate-500">
        Editing: <span className="font-semibold text-slate-700">{scheme.name_en}</span>
      </p>
      <div className="mt-6">
        <SchemeForm categories={categories} departments={departments} existing={scheme} />
      </div>
    </div>
  );
}
