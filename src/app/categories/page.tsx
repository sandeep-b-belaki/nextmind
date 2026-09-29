import type { Metadata } from 'next';
import { getLang } from '@/lib/lang';
import { t } from '@/lib/i18n';
import { getCategories, getPublishedSchemes } from '@/lib/schemes';
import CategoryCard from '@/components/CategoryCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Categories — ವರ್ಗಗಳು',
  description: 'Browse Karnataka government schemes by category: students, farmers, women, employment, housing, health and more.',
};

export default async function CategoriesPage() {
  const lang = getLang();
  const categories = await getCategories();
  const schemes = await getPublishedSchemes();

  const counts = categories.map((c) => schemes.filter((s) => s.category_slug === c.slug).length);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl font-kn">{t(lang, 'nav.categories')}</h1>
        <p className="mt-2 text-sm text-slate-500 font-kn">{t(lang, 'home.categoriesSub')}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c, i) => (
          <CategoryCard key={c.id} category={c} count={counts[i]} />
        ))}
      </div>
    </div>
  );
}
