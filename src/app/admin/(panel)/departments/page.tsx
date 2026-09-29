import { getDepartments, getPublishedSchemes } from '@/lib/schemes';
import AddSimpleForm from '@/components/admin/AddSimpleForm';

export const dynamic = 'force-dynamic';

export default async function AdminDepartmentsPage() {
  const departments = await getDepartments();
  const schemes = await getPublishedSchemes();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Departments</h1>
      <p className="mt-1 text-sm text-slate-500">Government departments referenced by schemes.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-0 lg:col-span-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <th className="px-4 py-3 font-bold">Name (EN)</th>
                <th className="px-4 py-3 font-bold">Name (KN)</th>
                <th className="px-4 py-3 font-bold">Slug</th>
                <th className="px-4 py-3 font-bold">Schemes</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-semibold text-slate-800">{d.name_en}</td>
                  <td className="px-4 py-3 font-kn text-slate-600">{d.name_kn}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{d.slug}</td>
                  <td className="px-4 py-3 font-bold text-brand-700">
                    {schemes.filter((s) => s.department_slug === d.slug).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddSimpleForm
          title="Add Department"
          endpoint="/api/admin/departments"
          fields={[
            { name: 'name_kn', label: 'Name – Kannada', kannada: true },
            { name: 'name_en', label: 'Name – English' },
            { name: 'slug', label: 'Slug (optional)' },
          ]}
        />
      </div>
    </div>
  );
}
